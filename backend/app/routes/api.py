from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse
from app.routes.auth import router as auth_router
from app.routes.crop import router as crop_router
from app.routes.disease import router as disease_router
from app.routes.cost import router as cost_router
from app.routes.price import router as price_router
from app.routes.chatbot import router as chatbot_router
from app.routes.mandi import router as mandi_router


api_router = APIRouter()


@api_router.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health check endpoint",
)
async def health_check() -> HealthResponse:
    """Returns application health status and environment information."""
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version="1.0.0",
        environment=settings.ENVIRONMENT,
    )


# Mount feature router modules
api_router.include_router(auth_router)
api_router.include_router(crop_router)
api_router.include_router(disease_router)
api_router.include_router(cost_router)
api_router.include_router(price_router)
api_router.include_router(chatbot_router)
api_router.include_router(mandi_router)
