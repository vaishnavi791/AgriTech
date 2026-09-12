"""AI Agri Assistant Chatbot schemas.

NOTE: All fields below are TEMPORARY / TBD and represent contract placeholders.
Exact fields, message limits, and session structures will be established in the
dedicated Chatbot implementation prompt.
"""
from typing import Optional
from pydantic import BaseModel, Field


class ChatbotRequest(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Chatbot request fields will be finalized in the Chatbot prompt.",
    )
    message: Optional[str] = Field(
        default=None,
        description="TEMPORARY/TBD: User question or message placeholder.",
    )
    session_id: Optional[str] = Field(
        default=None,
        description="TEMPORARY/TBD: Conversation session identifier placeholder.",
    )


class ChatbotResponse(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Chatbot response fields will be finalized in the Chatbot prompt.",
    )
    reply: Optional[str] = Field(
        default=None,
        description="TEMPORARY/TBD: Assistant reply placeholder.",
    )
    session_id: Optional[str] = Field(
        default=None,
        description="TEMPORARY/TBD: Active session identifier placeholder.",
    )
