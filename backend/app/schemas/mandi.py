"""Pydantic schemas for mandi price APIs."""

from pydantic import BaseModel, Field


class MandiPrice(BaseModel):
    crop: str | None = None
    state: str | None = None
    district: str | None = None
    market: str | None = None
    date: str | None = None
    min_price_inr_per_kg: float | None = None
    max_price_inr_per_kg: float | None = None
    modal_price_inr_per_kg: float | None = None
    source: str | None = None


class MandiPriceResponse(BaseModel):
    success: bool = True
    message: str
    price: MandiPrice | None = None


class MandiHistoryResponse(BaseModel):
    success: bool = True
    message: str
    records: list[MandiPrice]


class MarketComparison(BaseModel):
    market: str
    state: str | None = None
    district: str | None = None
    crop: str | None = None
    date: str | None = None
    modal_price_inr_per_kg: float
    source: str | None = None


class MarketComparisonResponse(BaseModel):
    success: bool = True
    message: str
    markets: list[MarketComparison]


class VolatilityResponse(BaseModel):
    success: bool = True
    message: str
    observation_count: int
    mean_price_inr_per_kg: float | None = None
    standard_deviation_inr_per_kg: float | None = None
    coefficient_of_variation_percent: float | None = None