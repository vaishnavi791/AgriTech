import asyncio
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from app.services import chatbot_service


class ProviderFailure(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        super().__init__(detail)


class ChatbotServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_missing_or_whitespace_api_key_reports_actionable_configuration_error(self):
        for api_key in ("", "   "):
            with (
                patch.object(chatbot_service.settings, "GEMINI_API_KEY", api_key),
                patch.object(chatbot_service.genai, "Client") as client,
            ):
                with self.assertRaises(chatbot_service.ChatbotProviderError) as raised:
                    await chatbot_service._create_interaction("Hello")

            self.assertEqual(raised.exception.status_code, 503)
            self.assertIn("GEMINI_API_KEY", raised.exception.message)
            client.assert_not_called()

    async def test_normal_continuation_uses_latest_provider_id_and_persists_metadata(self):
        interaction = SimpleNamespace(output_text="Water in the early morning.", id="interaction-new")
        save_message = AsyncMock()
        with (
            patch.object(chatbot_service, "get_latest_provider_interaction_id", AsyncMock(return_value="interaction-old")),
            patch.object(chatbot_service, "_create_interaction", AsyncMock(return_value=interaction)) as create_interaction,
            patch.object(chatbot_service, "save_chat_message", save_message),
        ):
            reply = await chatbot_service.generate_chat_reply("session-1", "When should I irrigate?", "user-1")

        self.assertEqual(reply, "Water in the early morning.")
        create_interaction.assert_awaited_once_with("When should I irrigate?", "interaction-old")
        self.assertEqual(save_message.await_count, 2)
        self.assertEqual(save_message.await_args_list[0].args[0]["user_id"], "user-1")
        assistant_record = save_message.await_args_list[1].args[0]
        self.assertEqual(assistant_record["metadata"], {"provider_interaction_id": "interaction-new"})
        self.assertEqual(assistant_record["session_id"], "session-1")

    async def test_database_failures_do_not_prevent_response(self):
        interaction = SimpleNamespace(output_text="Use clean seed.", id="interaction-1")
        with (
            patch.object(chatbot_service, "get_latest_provider_interaction_id", AsyncMock(side_effect=RuntimeError("db down"))),
            patch.object(chatbot_service, "_create_interaction", AsyncMock(return_value=interaction)) as create_interaction,
            patch.object(chatbot_service, "save_chat_message", AsyncMock(side_effect=RuntimeError("db down"))),
        ):
            reply = await chatbot_service.generate_chat_reply("session-1", "How do I prevent disease?")

        self.assertEqual(reply, "Use clean seed.")
        create_interaction.assert_awaited_once_with("How do I prevent disease?", None)

    async def test_explicit_continuation_failure_recovers_with_exact_step_input_once(self):
        expired = ProviderFailure(404, "previous_interaction_id expired")
        interaction = SimpleNamespace(output_text="Recovered advice.", id="interaction-recovered")
        history = [
            {"role": "user", "message": "My crop is yellow."},
            {"role": "assistant", "message": "Please share the crop stage."},
        ]
        with (
            patch.object(chatbot_service, "get_latest_provider_interaction_id", AsyncMock(return_value="expired-id")),
            patch.object(chatbot_service, "get_recent_session_messages", AsyncMock(return_value=history)),
            patch.object(chatbot_service, "_create_interaction", AsyncMock(side_effect=[expired, interaction])) as create_interaction,
            patch.object(chatbot_service, "save_chat_message", AsyncMock()),
        ):
            reply = await chatbot_service.generate_chat_reply("session-1", "It is flowering now.")

        self.assertEqual(reply, "Recovered advice.")
        self.assertEqual(create_interaction.await_count, 2)
        recovery_input = create_interaction.await_args_list[1].args[0]
        self.assertEqual(create_interaction.await_args_list[1].kwargs, {})
        self.assertEqual(
            recovery_input,
            [
                {"type": "user_input", "content": [{"type": "text", "text": "My crop is yellow."}]},
                {"type": "model_output", "content": [{"type": "text", "text": "Please share the crop stage."}]},
                {"type": "user_input", "content": [{"type": "text", "text": "It is flowering now."}]},
            ],
        )

    async def test_authentication_failure_does_not_trigger_recovery(self):
        failure = ProviderFailure(401, "unauthorised")
        with (
            patch.object(chatbot_service, "get_latest_provider_interaction_id", AsyncMock(return_value="old-id")),
            patch.object(chatbot_service, "get_recent_session_messages", AsyncMock()) as get_history,
            patch.object(chatbot_service, "_create_interaction", AsyncMock(side_effect=failure)),
        ):
            with self.assertRaises(chatbot_service.ChatbotProviderError) as raised:
                await chatbot_service.generate_chat_reply("session-1", "Hello")

        self.assertEqual(raised.exception.status_code, 503)
        get_history.assert_not_awaited()

    def test_provider_error_mapping(self):
        self.assertEqual(chatbot_service._translate_provider_error(ProviderFailure(403, "forbidden")).status_code, 503)
        self.assertEqual(chatbot_service._translate_provider_error(ProviderFailure(429, "quota")).status_code, 429)
        self.assertEqual(chatbot_service._translate_provider_error(asyncio.TimeoutError()).status_code, 504)
        self.assertEqual(chatbot_service._translate_provider_error(ProviderFailure(500, "error")).status_code, 502)

    def test_recovery_steps_map_only_persisted_user_and_assistant_messages(self):
        steps = chatbot_service._recovery_steps(
            [
                {"role": "system", "message": "skip"},
                {"role": "user", "message": "First"},
                {"role": "assistant", "message": "Second"},
            ],
            "Current",
        )
        self.assertEqual(len(steps), 3)
        self.assertEqual(steps[-1], {"type": "user_input", "content": [{"type": "text", "text": "Current"}]})
