"""Chat message database document model.

NOTE: This model represents individual conversational messages in the 'chat_messages' collection.
Specific Gemini metadata and session properties remain TBD pending the Chatbot prompt.
"""
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class ChatMessageDocument(BaseModel):
    id: Optional[str] = Field(default=None, description="Unique chat message document identifier (string ObjectId)")
    user_id: Optional[str] = Field(default=None, description="Optional associated user document identifier")
    session_id: str = Field(..., description="Unique conversation session identifier")
    role: str = Field(..., description="Message author role: 'user' or 'assistant'")
    message: str = Field(..., description="Text content of the message")
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="TEMPORARY/TBD: Generic metadata structure for conversational context or model parameters",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp when the message was recorded in UTC",
    )
