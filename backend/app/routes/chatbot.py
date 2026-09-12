from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.schemas.chatbot import ChatbotRequest, ChatbotResponse
from app.schemas.common import ErrorResponse, TBDContractResponse

router = APIRouter(prefix="/chatbot", tags=["AI Agri Assistant"])


@router.post(
    "/chat",
    summary="Send a message to the AI Agri Assistant",
    description=(
        "Contract placeholder for AI agricultural advisory. Gemini API integration, domain "
        "prompting, and conversation context will be implemented in the dedicated Chatbot prompt."
    ),
    response_model=ChatbotResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": ChatbotResponse, "description": "Assistant response generated successfully"},
        status.HTTP_400_BAD_REQUEST: {"model": ErrorResponse, "description": "Malformed chat message"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
        status.HTTP_501_NOT_IMPLEMENTED: {"model": TBDContractResponse, "description": "Contract registered; Chatbot logic pending"},
    },
)
async def chat(payload: ChatbotRequest):
    """Chatbot contract placeholder handler (no business logic)."""
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content=TBDContractResponse(
            status="TBD",
            message="Contract registered. Gemini chatbot integration deferred to Chatbot prompt.",
            endpoint="/api/chatbot/chat",
        ).model_dump(),
    )
