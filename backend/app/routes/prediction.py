"""Prediction history API routes."""

from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, Query, status

from app.core.security import get_current_user
from app.schemas.common import ErrorResponse
from app.schemas.prediction import PredictionHistoryResponse, PredictionRecord
from app.services.prediction_service import get_user_predictions

router = APIRouter(prefix="/predictions", tags=["Predictions & History"])


@router.get(
    "/history",
    summary="Retrieve user prediction history",
    description="Fetches saved calculation and inference history for the authenticated user, optionally filtered by module.",
    response_model=PredictionHistoryResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {
            "model": PredictionHistoryResponse,
            "description": "User prediction history retrieved successfully",
        },
        status.HTTP_401_UNAUTHORIZED: {
            "model": ErrorResponse,
            "description": "Missing, invalid, or expired authentication token",
        },
    },
)
async def get_history(
    module: Optional[str] = Query(
        default=None,
        description="Filter by module: 'crop', 'disease', 'cost', or 'price'",
    ),
    limit: int = Query(
        default=50,
        ge=1,
        le=100,
        description="Maximum number of historical records to return",
    ),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> PredictionHistoryResponse:
    """Retrieves past prediction records for the authenticated user."""
    user_id = str(current_user["id"] if isinstance(current_user, dict) else getattr(current_user, "id"))
    records = await get_user_predictions(user_id=user_id, module=module, limit=limit)
    return PredictionHistoryResponse(
        success=True,
        total=len(records),
        predictions=[PredictionRecord(**r) for r in records],
    )

