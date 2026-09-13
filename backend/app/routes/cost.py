"""Cost Estimation API routes."""

from fastapi import APIRouter, status

from app.schemas.cost import CostEstimateRequest, CostEstimateResponse
from app.services.cost_service import estimate_cost


router = APIRouter(
    prefix="/cost",
    tags=["Cost Estimation"],
)


@router.post(
    "/estimate",
    response_model=CostEstimateResponse,
    status_code=status.HTTP_200_OK,
    summary="Estimate crop cultivation cost",
)
async def estimate_cost_endpoint(
    payload: CostEstimateRequest,
) -> CostEstimateResponse:
    """
    Estimate cultivation cost using the existing ml/cost calculation engine.
    """

    result = estimate_cost(payload)

    return CostEstimateResponse(
        success=True,
        message="Cost estimation calculated successfully.",
        estimate=result,
    )