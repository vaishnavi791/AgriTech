"""Pydantic schemas for the Cost Estimation API."""

from pydantic import BaseModel, Field


class CostEstimateRequest(BaseModel):
    """Inputs required by the cost calculation engine."""

    crop: str = Field(
        ...,
        min_length=1,
        description="Crop name.",
    )

    land_size_acres: float = Field(
        ...,
        gt=0,
        description="Cultivated land area in acres.",
    )

    seed_rate_kg_per_acre: float = Field(
        ...,
        ge=0,
        description="Seed requirement per acre in kilograms.",
    )

    seed_price_inr_per_kg: float = Field(
        ...,
        ge=0,
        description="Seed price in INR per kilogram.",
    )

    n_rate_kg_per_acre: float = Field(
        ...,
        ge=0,
        description="Nitrogen input quantity per acre in kilograms.",
    )

    p_rate_kg_per_acre: float = Field(
        ...,
        ge=0,
        description="Phosphorus input quantity per acre in kilograms.",
    )

    k_rate_kg_per_acre: float = Field(
        ...,
        ge=0,
        description="Potassium input quantity per acre in kilograms.",
    )

    fertilizer_price_inr_per_kg: float = Field(
        ...,
        ge=0,
        description="Fertilizer price in INR per kilogram.",
    )

    water_requirement_mm: float = Field(
        ...,
        ge=0,
        description="Crop water requirement in millimetres.",
    )

    water_rate_inr_per_mm_per_acre: float = Field(
        ...,
        ge=0,
        description="Verified irrigation/water cost rate.",
    )

    water_efficiency_factor: float = Field(
        default=1.0,
        gt=0,
        description="Water efficiency factor. Defaults to 1.0.",
    )

    labor_days_per_acre: float = Field(
        ...,
        ge=0,
        description="Labour requirement per acre in labour-days.",
    )

    wage_inr_per_day: float = Field(
        ...,
        ge=0,
        description="Labour wage in INR per day.",
    )

    expected_yield_kg_per_acre: float = Field(
        ...,
        ge=0,
        description="Expected crop yield in kilograms per acre.",
    )

    market_price_inr_per_kg: float = Field(
        ...,
        ge=0,
        description="Verified market/mandi price in INR per kilogram.",
    )

    machinery_cost_inr_per_acre: float = Field(
        default=0.0,
        ge=0,
        description="Optional machinery cost per acre.",
    )

    other_input_cost_inr_per_acre: float = Field(
        default=0.0,
        ge=0,
        description="Optional additional input cost per acre.",
    )


class CostBreakdown(BaseModel):
    """Calculated cost and profitability breakdown."""

    seed: float
    fertilizer: float
    water: float
    labor: float
    machinery: float
    other_inputs: float


class CostEstimate(BaseModel):
    """Complete cost estimation result."""

    crop: str
    land_size_acres: float
    breakdown: CostBreakdown
    total_cost: float
    estimated_revenue: float
    net_profit: float
    roi_percent: float | None


class CostEstimateResponse(BaseModel):
    """Response returned by the Cost Estimation API."""

    success: bool = True
    message: str
    estimate: CostEstimate