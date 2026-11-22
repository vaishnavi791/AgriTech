from fastapi import APIRouter, HTTPException, status

from app.schemas.price import PriceForecastRequest, PriceForecastResponse
from app.services.mandi_repository import get_mandi_records
from app.services.mandi_service import crop_variants
from app.services.price_service import build_price_forecast


router = APIRouter(prefix="/price", tags=["Price Forecasting"])


@router.post(
    "/forecast",
    response_model=PriceForecastResponse,
    summary="Forecast agricultural commodity market prices",
    description=(
        "Projects mandi modal prices using ordinary least-squares linear "
        "regression over up to the latest 30 observed daily prices. It is a "
        "transparent trend baseline, not a trained or seasonal ML model."
    ),
)
async def forecast_price(
    payload: PriceForecastRequest,
) -> PriceForecastResponse:
    records = await get_mandi_records(
        crop=list(crop_variants(payload.commodity)),
        state=payload.state,
        market=payload.market,
        limit=5000,
    )
    if not records:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"No mandi price records were found for {payload.commodity} "
                f"in {payload.state}."
            ),
        )

    try:
        result = build_price_forecast(
            records,
            commodity=payload.commodity,
            state=payload.state,
            market=payload.market,
            days_ahead=payload.days_ahead,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    return PriceForecastResponse(**result)
