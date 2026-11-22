from fastapi import APIRouter, HTTPException

from app.services.mandi_repository import (
    get_available_mandi_commodities,
    get_available_mandi_markets,
    get_available_mandi_states,
    get_mandi_records,
)
from app.services.mandi_service import (
    get_latest_mandi_price,
    get_historical_prices,
    compare_markets,
    calculate_price_volatility,
    calculate_seasonal_analysis,
    crop_variants,
)

router = APIRouter(prefix="/mandi", tags=["Mandi Prices"])


@router.get("/commodities")
async def available_commodities(state: str | None = None):
    return await get_available_mandi_commodities(state=state)


@router.get("/states")
async def available_states(crop: str | None = None):
    crop_values = list(crop_variants(crop)) if crop else None
    return await get_available_mandi_states(crop=crop_values)


@router.get("/available-markets")
async def available_markets(
    crop: str,
    state: str,
):
    return await get_available_mandi_markets(
        crop=list(crop_variants(crop)),
        state=state,
    )


@router.get("/latest")
async def latest_price(
    crop: str,
    state: str,
    market: str | None = None,
):
    records = await get_mandi_records(
        crop=list(crop_variants(crop)),
        state=state,
        market=market,
    )

    result = get_latest_mandi_price(
        records,
        crop=crop,
        state=state,
        market=market,
    )
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"No verified mandi modal price is available for {crop} in {state}.",
        )
    return result


@router.get("/historical")
async def historical_prices(
    crop: str,
    state: str,
    market: str | None = None,
):
    records = await get_mandi_records(
        crop=list(crop_variants(crop)),
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
        crop=list(crop_variants(crop)),
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
        crop=list(crop_variants(crop)),
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
        crop=list(crop_variants(crop)),
        state=state,
    )

    return calculate_seasonal_analysis(
        records,
        crop=crop,
        state=state,
    )