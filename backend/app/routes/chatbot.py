from typing import Any, Dict, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_optional_current_user
from app.schemas.chatbot import ChatbotRequest, ChatbotResponse
from app.schemas.common import ErrorResponse
from app.services.chatbot_service import ChatbotProviderError, generate_chat_reply

router = APIRouter(prefix="/chatbot", tags=["AI Agri Assistant"])


@router.post(
    "/chat",
    summary="Send a message to the AI Agri Assistant",
    description="Send a message to the AI agricultural advisor.",
    response_model=ChatbotResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": ChatbotResponse, "description": "Assistant response generated successfully"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
        status.HTTP_429_TOO_MANY_REQUESTS: {"model": ErrorResponse, "description": "Gemini rate limit reached"},
        status.HTTP_502_BAD_GATEWAY: {"model": ErrorResponse, "description": "Gemini provider failure"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"model": ErrorResponse, "description": "Gemini service unavailable"},
        status.HTTP_504_GATEWAY_TIMEOUT: {"model": ErrorResponse, "description": "Gemini request timed out"},
    },
)
async def chat(
    payload: ChatbotRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_current_user),
) -> ChatbotResponse:
    """Generate a response while preserving anonymous access and application sessions."""
    session_id = payload.session_id or str(uuid4())
    user_id = str(current_user["id"]) if current_user else None
    try:
        reply = await generate_chat_reply(session_id=session_id, message=payload.message, user_id=user_id)
    except ChatbotProviderError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    return ChatbotResponse(reply=reply, session_id=session_id)
