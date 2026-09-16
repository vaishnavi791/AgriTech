"""AI Agri Assistant Chatbot request and response schemas."""
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ChatbotRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    session_id: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=128,
        description="Durable application conversation session identifier",
    )

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("message must not be blank")
        return value


class ChatbotResponse(BaseModel):
    success: bool = True
    reply: str = Field(..., description="Assistant response")
    session_id: str = Field(..., description="Durable application conversation session identifier")
