from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.schemas.cost import CostEstimateRequest, CostEstimateResponse
from app.schemas.common import ErrorResponse, TBDContractResponse

router = APIRouter(prefix="/cost", tags=["Cost Estimation"])


@router.post(
    "/estimate",
    summary="Estimate farming expenditures and operational costs",
    description=(
        "Contract placeholder. Because ml/cost files in the repository contain no code or "
        "constant definitions, input parameters (acreage, seed, fertilizer, labor) and cost "
        "breakdown outputs remain TBD and will be derived once real logic code is delivered."
    ),
    response_model=CostEstimateResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": CostEstimateResponse, "description": "Cost estimation response (TBD)"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
        status.HTTP_501_NOT_IMPLEMENTED: {"model": TBDContractResponse, "description": "Contract registered; Logic interface is TBD"},
    },
)
async def estimate_cost(payload: CostEstimateRequest):
    """Cost estimation contract placeholder handler (no business logic)."""
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content=TBDContractResponse(
            status="TBD",
            message="Contract registered. Cost estimation logic interface is TBD.",
            endpoint="/api/cost/estimate",
        ).model_dump(),
    )
