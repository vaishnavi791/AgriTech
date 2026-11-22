"""Request and response models for mandi price forecasting."""

from typing import Literal

from pydantic import BaseModel, Field


class PriceForecastRequest(BaseModel):
    commodity: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
    market: str | None = Field(default=None, min_length=1)
    days_ahead: int = Field(default=15, ge=7, le=30)


class PriceForecastChartData(BaseModel):
    dates: list[str]
    prices: list[float]
    min_prices: list[float]
    max_prices: list[float]


class PriceForecastResponse(BaseModel):
    success: bool = True
    commodity: str
    state: str
    market: str
    days_ahead: int
    current_price: float = Field(..., description="Latest observed modal price in INR/quintal.")
    forecasted_price: float = Field(..., description="Horizon-end estimate in INR/quintal.")
    change_percent: float
    trend: Literal["upward", "downward", "stable"]
    model: str
    observations_used: int
    last_observed_date: str
    data_age_days: int
    is_stale: bool
    warning: str | None = None
    source: str | None = None
    chart_data: PriceForecastChartData
