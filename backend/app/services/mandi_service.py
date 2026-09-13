"""
Mandi service for normalized AGMARKNET price data.

This service works with the schema produced by
ml.cost.normalizer.normalize_mandi_record().

No mandi prices are hardcoded.
No missing prices are fabricated.
"""

from __future__ import annotations

from collections import defaultdict
from statistics import mean, stdev
from typing import Any


def _valid_price(value: Any) -> float | None:
    """Return a positive numeric price or None."""
    if value in (None, ""):
        return None

    try:
        price = float(value)
    except (TypeError, ValueError):
        return None

    return price if price > 0 else None


def _date_sort_key(record: dict[str, Any]) -> str:
    """Return a sortable date value."""
    return str(record.get("date") or "")


def _matches(
    record: dict[str, Any],
    *,
    crop: str | None = None,
    state: str | None = None,
    market: str | None = None,
) -> bool:
    """Check optional crop/state/market filters."""

    if crop and str(record.get("crop", "")).lower() != crop.lower():
        return False

    if state and str(record.get("state", "")).lower() != state.lower():
        return False

    if market and str(record.get("market", "")).lower() != market.lower():
        return False

    return True


def get_latest_mandi_price(
    records: list[dict[str, Any]],
    *,
    crop: str | None = None,
    state: str | None = None,
    market: str | None = None,
) -> dict[str, Any] | None:
    """
    Return the latest valid modal mandi price.

    Records must already be normalized to INR/kg.
    """

    valid_records = [
        record
        for record in records
        if _matches(
            record,
            crop=crop,
            state=state,
            market=market,
        )
        and _valid_price(record.get("modal_price_inr_per_kg")) is not None
    ]

    if not valid_records:
        return None

    latest = max(valid_records, key=_date_sort_key)

    return {
        "crop": latest.get("crop"),
        "state": latest.get("state"),
        "district": latest.get("district"),
        "market": latest.get("market"),
        "date": latest.get("date"),
        "min_price_inr_per_kg": _valid_price(
            latest.get("min_price_inr_per_kg")
        ),
        "max_price_inr_per_kg": _valid_price(
            latest.get("max_price_inr_per_kg")
        ),
        "modal_price_inr_per_kg": _valid_price(
            latest.get("modal_price_inr_per_kg")
        ),
        "source": latest.get("source"),
    }


def get_historical_prices(
    records: list[dict[str, Any]],
    *,
    crop: str | None = None,
    state: str | None = None,
    market: str | None = None,
) -> list[dict[str, Any]]:
    """
    Return actual historical daily modal prices.

    Records without a valid modal price are excluded.
    """

    result: list[dict[str, Any]] = []

    for record in records:
        if not _matches(
            record,
            crop=crop,
            state=state,
            market=market,
        ):
            continue

        price = _valid_price(record.get("modal_price_inr_per_kg"))

        if price is None:
            continue

        result.append(
            {
                "date": record.get("date"),
                "crop": record.get("crop"),
                "state": record.get("state"),
                "district": record.get("district"),
                "market": record.get("market"),
                "modal_price_inr_per_kg": price,
                "source": record.get("source"),
            }
        )

    return sorted(
        result,
        key=lambda item: str(item.get("date") or ""),
    )


def compare_markets(
    records: list[dict[str, Any]],
    *,
    crop: str,
    state: str | None = None,
) -> list[dict[str, Any]]:
    """
    Compare markets using each market's latest available
    valid modal price.

    One result is returned per market.
    """

    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)

    for record in records:
        if not _matches(
            record,
            crop=crop,
            state=state,
        ):
            continue

        market = record.get("market")
        price = _valid_price(record.get("modal_price_inr_per_kg"))

        if not market or price is None:
            continue

        grouped[str(market)].append(record)

    comparison: list[dict[str, Any]] = []

    for market, market_records in grouped.items():
        latest = max(
            market_records,
            key=_date_sort_key,
        )

        price = _valid_price(
            latest.get("modal_price_inr_per_kg")
        )

        if price is None:
            continue

        comparison.append(
            {
                "market": market,
                "state": latest.get("state"),
                "district": latest.get("district"),
                "crop": latest.get("crop"),
                "date": latest.get("date"),
                "modal_price_inr_per_kg": price,
                "source": latest.get("source"),
            }
        )

    return sorted(
        comparison,
        key=lambda item: item["modal_price_inr_per_kg"],
        reverse=True,
    )


def calculate_price_volatility(
    records: list[dict[str, Any]],
    *,
    crop: str | None = None,
    state: str | None = None,
    market: str | None = None,
) -> dict[str, Any]:
    """
    Calculate price volatility from actual modal prices.

    Volatility metrics:
    - mean price
    - standard deviation
    - coefficient of variation (CV)

    CV = standard deviation / mean × 100
    """

    historical = get_historical_prices(
        records,
        crop=crop,
        state=state,
        market=market,
    )

    prices = [
        item["modal_price_inr_per_kg"]
        for item in historical
    ]

    if not prices:
        return {
            "observation_count": 0,
            "mean_price_inr_per_kg": None,
            "standard_deviation_inr_per_kg": None,
            "coefficient_of_variation_percent": None,
        }

    average = mean(prices)

    if len(prices) < 2:
        return {
            "observation_count": len(prices),
            "mean_price_inr_per_kg": average,
            "standard_deviation_inr_per_kg": None,
            "coefficient_of_variation_percent": None,
        }

    deviation = stdev(prices)

    coefficient_of_variation = (
        deviation / average * 100
        if average
        else None
    )

    return {
        "observation_count": len(prices),
        "mean_price_inr_per_kg": average,
        "standard_deviation_inr_per_kg": deviation,
        "coefficient_of_variation_percent": coefficient_of_variation,
    }


def calculate_seasonal_analysis(
    records: list[dict[str, Any]],
    *,
    crop: str,
    state: str | None = None,
    market: str | None = None,
) -> list[dict[str, Any]]:
    """
    Calculate actual monthly price statistics.

    Only months represented by actual AGMARKNET records
    are included.
    """

    historical = get_historical_prices(
        records,
        crop=crop,
        state=state,
        market=market,
    )

    monthly: dict[int, list[float]] = defaultdict(list)

    for item in historical:
        date_value = str(item.get("date") or "")

        try:
            # Expected AGMARKNET format: DD/MM/YYYY
            month = int(date_value.split("/")[1])
        except (IndexError, ValueError):
            continue

        monthly[month].append(
            item["modal_price_inr_per_kg"]
        )

    result: list[dict[str, Any]] = []

    for month in sorted(monthly):
        prices = monthly[month]

        result.append(
            {
                "month": month,
                "observation_count": len(prices),
                "average_price_inr_per_kg": mean(prices),
                "minimum_price_inr_per_kg": min(prices),
                "maximum_price_inr_per_kg": max(prices),
            }
        )

    return result