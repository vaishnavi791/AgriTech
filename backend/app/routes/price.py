from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.schemas.price import PriceForecastRequest, PriceForecastResponse
from app.schemas.common import ErrorResponse, TBDContractResponse

router = APIRouter(prefix="/price", tags=["Price Forecasting"])


@router.post(
    "/forecast",
    summary="Forecast agricultural commodity market prices",
    description=(
        "Contract placeholder. Because ml/price files in the repository contain no code or "
        "model artifacts, input parameters (market, crop, time horizon) and price forecasting "
        "time-series outputs remain TBD and will be derived once real ML artifacts are delivered."
    ),
    response_model=PriceForecastResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": PriceForecastResponse, "description": "Price forecast response (TBD)"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
        status.HTTP_501_NOT_IMPLEMENTED: {"model": TBDContractResponse, "description": "Contract registered; Model interface is TBD"},
    },
)
async def forecast_price(payload: PriceForecastRequest):
    """Price forecasting contract placeholder handler (no business logic)."""
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content=TBDContractResponse(
            status="TBD",
            message="Contract registered. Price forecasting model interface is TBD.",
            endpoint="/api/price/forecast",
        ).model_dump(),
    )
