import unittest
from unittest.mock import AsyncMock, patch

from app.core import security
from app.schemas.chatbot import ChatbotRequest


class ChatbotContractTests(unittest.IsolatedAsyncioTestCase):
    def test_message_is_trimmed_and_blank_message_is_rejected(self):
        self.assertEqual(ChatbotRequest(message="  hello  ").message, "hello")
        with self.assertRaises(ValueError):
            ChatbotRequest(message="   ")

    async def test_optional_auth_allows_anonymous_request(self):
        self.assertIsNone(await security.get_optional_current_user(None))

    async def test_optional_auth_uses_existing_validator_for_present_credentials(self):
        credentials = object()
        user = {"id": "user-1"}
        with patch.object(security, "get_current_user", AsyncMock(return_value=user)) as get_current_user:
            self.assertEqual(await security.get_optional_current_user(credentials), user)
        get_current_user.assert_awaited_once_with(credentials)

    def test_message_max_length_is_2000(self):
        request = ChatbotRequest(message="a" * 2000)
        self.assertEqual(len(request.message), 2000)

        with self.assertRaises(ValueError):
            ChatbotRequest(message="a" * 2001)


    def test_response_contains_success_true(self):
        from app.schemas.chatbot import ChatbotResponse

        response = ChatbotResponse(
            reply="Test reply",
            session_id="session-1",
        )

        self.assertTrue(response.success)
