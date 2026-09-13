"""Business logic for Cost Estimation."""

from typing import Any, Dict

from app.schemas.cost import CostEstimateRequest
from ml.cost.calculator import calculate_cost


def estimate_cost(payload: CostEstimateRequest) -> Dict[str, Any]:
    """
    Pass validated API inputs to the existing cost calculation engine.

    The agricultural formulas remain inside ml/cost/calculator.py.
    """

    try:
        return calculate_cost(
            crop=payload.crop,
            land_size_acres=payload.land_size_acres,

            seed_rate_kg_per_acre=payload.seed_rate_kg_per_acre,
            seed_price_inr_per_kg=payload.seed_price_inr_per_kg,

            n_rate_kg_per_acre=payload.n_rate_kg_per_acre,
            p_rate_kg_per_acre=payload.p_rate_kg_per_acre,
            k_rate_kg_per_acre=payload.k_rate_kg_per_acre,
            fertilizer_price_inr_per_kg=payload.fertilizer_price_inr_per_kg,

            water_requirement_mm=payload.water_requirement_mm,
            water_rate_inr_per_mm_per_acre=(
                payload.water_rate_inr_per_mm_per_acre
            ),
            water_efficiency_factor=payload.water_efficiency_factor,

            labor_days_per_acre=payload.labor_days_per_acre,
            wage_inr_per_day=payload.wage_inr_per_day,

            expected_yield_kg_per_acre=payload.expected_yield_kg_per_acre,
            market_price_inr_per_kg=payload.market_price_inr_per_kg,

            machinery_cost_inr_per_acre=(
                payload.machinery_cost_inr_per_acre
            ),
            other_input_cost_inr_per_acre=(
                payload.other_input_cost_inr_per_acre
            ),
        )

    except ValueError as exc:
        raise ValueError(str(exc)) from exc