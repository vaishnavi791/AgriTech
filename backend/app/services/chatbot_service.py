"""Gemini-backed AI Agri Assistant orchestration."""

import asyncio
import logging
from typing import Any, Dict, List, Optional
from types import SimpleNamespace
from uuid import uuid4

import httpx
from google import genai
from google.genai import types

from app.core.config import settings
from app.services.chat_service import (
    get_latest_provider_interaction_id,
    get_recent_session_messages,
    save_chat_message,
)


logger = logging.getLogger(__name__)

GEMINI_MODEL = settings.GEMINI_MODEL or "gemini-3-flash-preview"
RECOVERY_HISTORY_LIMIT = 10
AGRICULTURAL_SYSTEM_INSTRUCTION = """You are AgriTech's agricultural advisor. Provide practical,
scientifically grounded agronomic guidance suitable for farmers. State important uncertainty,
ask for crop, growth stage, location, weather, soil, and symptom details when they would change
the advice. Give actionable, proportionate recommendations and safe integrated pest-management
guidance. Do not present general advice as a field diagnosis; for urgent, severe, pesticide,
human-safety, animal-safety, or regulatory matters, recommend consulting a qualified local
agronomist, extension officer, or relevant authority."""


class ChatbotProviderError(Exception):
    """Safe provider failure exposed by the chatbot route."""

    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(message)


def _provider_status_code(exc: Exception) -> Optional[int]:
    """Read an upstream status without serialising or logging its response body."""
    for value in (
        getattr(exc, "status_code", None),
        getattr(exc, "status", None),
        getattr(getattr(exc, "response", None), "status_code", None),
    ):
        if isinstance(value, int):
            return value
    return None


def _is_continuation_state_error(exc: Exception) -> bool:
    """Recognise only explicit failures of the previous interaction reference."""
    if _provider_status_code(exc) not in {400, 404, 410}:
        return False

    # Used solely for classification; this provider detail is never logged or returned.
    detail = str(exc).lower()
    references_previous = "previous_interaction_id" in detail or "previous interaction" in detail
    unavailable = any(token in detail for token in ("invalid", "not found", "unavailable", "expired", "missing", "rejected"))
    return references_previous and unavailable


def _translate_provider_error(exc: Exception) -> ChatbotProviderError:
    """Convert provider failures to the approved, user-safe HTTP contract."""
    logger.error(
        "Gemini request failed (type=%s, status=%s)",
        type(exc).__name__,
        _provider_status_code(exc),
    )
    if isinstance(exc, (asyncio.TimeoutError, TimeoutError, httpx.TimeoutException)):
        return ChatbotProviderError(504, "The AI service timed out. Please try again.")

    status_code = _provider_status_code(exc)
    if status_code in {401, 403}:
        return ChatbotProviderError(503, "The AI service is temporarily unavailable.")
    if status_code == 429:
        return ChatbotProviderError(429, "The AI service is busy. Please try again shortly.")
    return ChatbotProviderError(502, "The AI service could not process the request.")


def _recovery_steps(history: List[Dict[str, Any]], current_message: str) -> List[Dict[str, Any]]:
    """Map durable history to the required Interactions API step format."""
    steps: List[Dict[str, Any]] = []
    for item in history:
        role = item.get("role")
        message = item.get("message")
        if role not in {"user", "assistant"} or not isinstance(message, str):
            continue
        steps.append(
            {
                "type": "user_input" if role == "user" else "model_output",
                "content": [{"type": "text", "text": message}],
            }
        )
    steps.append(
        {
            "type": "user_input",
            "content": [{"type": "text", "text": current_message}],
        }
    )
    return steps


async def _create_interaction(input_data: Any, previous_interaction_id: Optional[str] = None) -> Any:
    api_key = settings.GEMINI_API_KEY.strip()
    if not api_key:
        logger.error("Gemini is not configured: GEMINI_API_KEY is missing from the backend environment.")
        raise ChatbotProviderError(
            503,
            "The AI service is not configured. Set GEMINI_API_KEY in backend/.env and restart the backend.",
        )

    client = genai.Client(api_key=api_key)
    response = await client.aio.models.generate_content(
        model=GEMINI_MODEL,
        contents=input_data,
        config=types.GenerateContentConfig(
            system_instruction=AGRICULTURAL_SYSTEM_INSTRUCTION,
        ),
    )
    reply = getattr(response, "text", None)
    if not isinstance(reply, str) or not reply.strip():
        raise ChatbotProviderError(502, "The AI service returned an incomplete response.")
    return SimpleNamespace(output_text=reply, id=f"gemini-{uuid4()}")


async def _get_recovery_history(session_id: str) -> List[Dict[str, Any]]:
    try:
        return await get_recent_session_messages(session_id, limit=RECOVERY_HISTORY_LIMIT)
    except Exception as exc:
        logger.warning("Chat recovery history unavailable for session %s (%s)", session_id, type(exc).__name__)
        return []


async def _persist_turn(
    session_id: str,
    user_id: Optional[str],
    message: str,
    reply: str,
    provider_interaction_id: str,
) -> None:
    """Persist each record independently so an outage never suppresses a reply."""
    records = (
        {"session_id": session_id, "user_id": user_id, "role": "user", "message": message},
        {
            "session_id": session_id,
            "user_id": user_id,
            "role": "assistant",
            "message": reply,
            "metadata": {"provider_interaction_id": provider_interaction_id},
        },
    )
    for record in records:
        try:
            await save_chat_message(record)
        except Exception as exc:
            logger.warning("Chat persistence unavailable for session %s (%s)", session_id, type(exc).__name__)


async def generate_chat_reply(session_id: str, message: str, user_id: Optional[str] = None) -> str:
    """Generate and best-effort persist one assistant turn for an application session."""
    previous_interaction_id: Optional[str] = None
    try:
        previous_interaction_id = await get_latest_provider_interaction_id(session_id)
    except Exception as exc:
        logger.warning("Chat continuation lookup unavailable for session %s (%s)", session_id, type(exc).__name__)

    try:
        interaction = await _create_interaction(message, previous_interaction_id)
    except ChatbotProviderError:
        raise
    except Exception as exc:
        if previous_interaction_id and _is_continuation_state_error(exc):
            recovery_input = _recovery_steps(await _get_recovery_history(session_id), message)
            try:
                interaction = await _create_interaction(recovery_input)
            except ChatbotProviderError:
                raise
            except Exception as recovery_exc:
                raise _translate_provider_error(recovery_exc) from recovery_exc
        else:
            raise _translate_provider_error(exc) from exc

    reply = getattr(interaction, "output_text", None)
    interaction_id = getattr(interaction, "id", None)
    if not isinstance(reply, str) or not reply.strip() or not isinstance(interaction_id, str) or not interaction_id:
        raise ChatbotProviderError(502, "The AI service returned an incomplete response.")

    await _persist_turn(session_id, user_id, message, reply, interaction_id)
    return reply

