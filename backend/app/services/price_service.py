"""Data-backed mandi price trend forecasting."""

from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime, timedelta
import math
from statistics import median
from typing import Any


MODEL_NAME = "Ordinary least-squares linear trend (30-observation window)"
MIN_OBSERVATIONS = 3
MAX_TREND_OBSERVATIONS = 30
STABLE_CHANGE_PERCENT = 1.0
KG_PER_QUINTAL = 100.0


def _parse_observation_date(value: Any) -> date | None:
    if not value:
        return None

    text = str(value).strip()
    try:
        return date.fromisoformat(text[:10])
    except ValueError:
        pass

    try:
        return datetime.strptime(text, "%d/%m/%Y").date()
    except ValueError:
        return None


def _valid_price(value: Any) -> float | None:
    try:
        price = float(value)
    except (TypeError, ValueError):
        return None
    if price <= 0 or not math.isfinite(price):
        return None
    return price


def build_price_forecast(
    records: list[dict[str, Any]],
    *,
    commodity: str,
    state: str,
    market: str | None,
    days_ahead: int,
    as_of: date | None = None,
) -> dict[str, Any]:
    """Fit a short-term linear trend to actual daily modal prices."""
    daily_prices: dict[date, list[float]] = defaultdict(list)
    sources: set[str] = set()

    for record in records:
        observation_date = _parse_observation_date(record.get("date"))
        price = _valid_price(record.get("modal_price_inr_per_kg"))
        if observation_date is None or price is None:
            continue

        daily_prices[observation_date].append(price)
        source = record.get("source")
        if source:
            sources.add(str(source))

    daily_series = [
        (observation_date, median(prices))
        for observation_date, prices in sorted(daily_prices.items())
    ][-MAX_TREND_OBSERVATIONS:]

    if len(daily_series) < MIN_OBSERVATIONS:
        raise ValueError(
            "At least 3 distinct dates with valid mandi modal prices are "
            "required for a forecast. Choose another market or commodity."
        )

    first_date = daily_series[0][0]
    x_values = [(observed_date - first_date).days for observed_date, _ in daily_series]
    y_values = [price for _, price in daily_series]
    x_mean = sum(x_values) / len(x_values)
    y_mean = sum(y_values) / len(y_values)
    denominator = sum((x - x_mean) ** 2 for x in x_values)
    if denominator == 0:
        raise ValueError(
            "The available mandi history does not span enough time to forecast."
        )

    slope = sum(
        (x - x_mean) * (y - y_mean)
        for x, y in zip(x_values, y_values)
    ) / denominator
    intercept = y_mean - slope * x_mean
    residuals = [
        observed - (intercept + slope * x)
        for x, observed in zip(x_values, y_values)
    ]
    residual_rmse = (
        sum(residual**2 for residual in residuals)
        / max(len(residuals) - 2, 1)
    ) ** 0.5

    last_observed_date, current_price_per_kg = daily_series[-1]
    current_price = round(current_price_per_kg * KG_PER_QUINTAL, 2)
    forecast_dates = [
        last_observed_date + timedelta(days=day)
        for day in range(1, days_ahead + 1)
    ]
    forecast_prices: list[float] = []
    lower_prices: list[float] = []
    upper_prices: list[float] = []

    for step, forecast_date in enumerate(forecast_dates, start=1):
        elapsed_days = (forecast_date - first_date).days
        estimate_per_kg = max(0.0, intercept + slope * elapsed_days)
        estimate = estimate_per_kg * KG_PER_QUINTAL
        range_width = residual_rmse * (step**0.5) * KG_PER_QUINTAL
        forecast_prices.append(round(estimate, 2))
        lower_prices.append(round(max(0.0, estimate - range_width), 2))
        upper_prices.append(round(estimate + range_width, 2))

    forecasted_price = forecast_prices[-1]
    change_percent = (
        (forecasted_price - current_price) / current_price * 100
        if current_price
        else 0.0
    )
    if change_percent > STABLE_CHANGE_PERCENT:
        trend = "upward"
    elif change_percent < -STABLE_CHANGE_PERCENT:
        trend = "downward"
    else:
        trend = "stable"

    reference_date = as_of or date.today()
    data_age_days = max((reference_date - last_observed_date).days, 0)
    is_stale = data_age_days > 30
    warning = (
        "The latest observation is more than 30 days old. This projection "
        "starts after the last recorded mandi date and should not be treated "
        "as a current market quote."
        if is_stale
        else None
    )
    chart_dates = [last_observed_date.isoformat()] + [
        forecast_date.isoformat() for forecast_date in forecast_dates
    ]

    return {
        "success": True,
        "commodity": commodity,
        "state": state,
        "market": market or "All matching markets (daily median)",
        "days_ahead": days_ahead,
        "current_price": current_price,
        "forecasted_price": forecasted_price,
        "change_percent": round(change_percent, 2),
        "trend": trend,
        "model": MODEL_NAME,
        "observations_used": len(daily_series),
        "last_observed_date": last_observed_date.isoformat(),
        "data_age_days": data_age_days,
        "is_stale": is_stale,
        "warning": warning,
        "source": ", ".join(sorted(sources)) or None,
        "chart_data": {
            "dates": chart_dates,
            "prices": [current_price, *forecast_prices],
            "min_prices": [current_price, *lower_prices],
            "max_prices": [current_price, *upper_prices],
        },
    }
