from fastapi import APIRouter, Query

from app.services.mandi_repository import get_mandi_records
from app.services.mandi_service import (
    get_latest_mandi_price,
    get_historical_prices,
    compare_markets,
    calculate_price_volatility,
    calculate_seasonal_analysis,
)

router = APIRouter(prefix="/mandi", tags=["Mandi Prices"])


@router.get("/latest")
async def latest_price(
    crop: str,
    state: str,
    market: str | None = None,
):
    records = await get_mandi_records(
        crop=crop,
        state=state,
        market=market,
    )

    return get_latest_mandi_price(
        records,
        crop=crop,
        state=state,
        market=market,
    )


@router.get("/historical")
async def historical_prices(
    crop: str,
    state: str,
    market: str | None = None,
):
    records = await get_mandi_records(
        crop=crop,
        state=state,
        market=market,
    )

    return get_historical_prices(
        records,
        crop=crop,
        state=state,
        market=market,
    )


@router.get("/markets")
async def market_comparison(
    crop: str,
    state: str,
):
    records = await get_mandi_records(
        crop=crop,
        state=state,
    )

    return compare_markets(
        records,
        crop=crop,
        state=state,
    )


@router.get("/volatility")
async def price_volatility(
    crop: str,
    state: str,
):
    records = await get_mandi_records(
        crop=crop,
        state=state,
    )

    return calculate_price_volatility(
        records,
        crop=crop,
        state=state,
    )


@router.get("/seasonal")
async def seasonal_analysis(
    crop: str,
    state: str,
):
    records = await get_mandi_records(
        crop=crop,
        state=state,
    )

    return calculate_seasonal_analysis(
        records,
        crop=crop,
        state=state,
    )