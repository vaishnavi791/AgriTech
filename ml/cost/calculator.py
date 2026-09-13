"""
AgriTech Cost Estimation Calculation Engine.

This module contains deterministic cost calculations only.

It does NOT:
- fetch data from the internet
- contain hardcoded crop prices
- contain fake/sample agricultural rates
- access MongoDB
- access FastAPI
- access the React frontend

External data such as seed prices, fertilizer prices, labour wages,
water tariffs, crop water requirements and market prices must be supplied
by the data/integration layer.

The intended production flow is:

    Real agricultural data
            ↓
    validated/normalized inputs
            ↓
    calculate_cost()
            ↓
    structured result
            ↓
    FastAPI service
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from .constants import (
    MONEY_DECIMAL_PLACES,
    PERCENT_DECIMAL_PLACES,
    MIN_LAND_SIZE_ACRES,
    ZERO_COST_ROI,
)


# ============================================================================
# Validation helpers
# ============================================================================

def _validate_number(
    value: Any,
    field_name: str,
    *,
    allow_zero: bool = True,
) -> float:
    """
    Validate and convert a numeric input to float.

    Parameters
    ----------
    value:
        Input value.
    field_name:
        Name used in error messages.
    allow_zero:
        Whether zero is a valid value.

    Returns
    -------
    float
        Validated numeric value.
    """

    if isinstance(value, bool):
        raise ValueError(f"{field_name} must be a number.")

    try:
        number = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} must be a number.")

    if number != number:  # NaN check
        raise ValueError(f"{field_name} cannot be NaN.")

    if number < 0:
        raise ValueError(f"{field_name} cannot be negative.")

    if not allow_zero and number == 0:
        raise ValueError(f"{field_name} must be greater than zero.")

    return number


def _validate_land_size(land_size_acres: Any) -> float:
    """Validate farm/land size in acres."""

    land_size = _validate_number(
        land_size_acres,
        "land_size_acres",
        allow_zero=False,
    )

    if land_size < MIN_LAND_SIZE_ACRES:
        raise ValueError(
            f"land_size_acres must be at least {MIN_LAND_SIZE_ACRES} acres."
        )

    return land_size


def _money(value: float) -> float:
    """Round a monetary result consistently."""

    return round(float(value), MONEY_DECIMAL_PLACES)


def _percentage(value: float) -> float:
    """Round a percentage result consistently."""

    return round(float(value), PERCENT_DECIMAL_PLACES)


# ============================================================================
# Individual cost calculations
# ============================================================================

def calculate_seed_cost(
    land_size_acres: float,
    seed_rate_kg_per_acre: float,
    seed_price_inr_per_kg: float,
) -> float:
    """
    Calculate total seed cost.

    Formula:

        Seed Cost =
            land area × seed rate × seed price

    Units:

        acres × kg/acre × INR/kg = INR
    """

    land_size = _validate_land_size(land_size_acres)

    seed_rate = _validate_number(
        seed_rate_kg_per_acre,
        "seed_rate_kg_per_acre",
    )

    seed_price = _validate_number(
        seed_price_inr_per_kg,
        "seed_price_inr_per_kg",
    )

    cost = (
        land_size
        * seed_rate
        * seed_price
    )

    return _money(cost)


def calculate_fertilizer_cost(
    land_size_acres: float,
    n_rate_kg_per_acre: float,
    p_rate_kg_per_acre: float,
    k_rate_kg_per_acre: float,
    fertilizer_price_inr_per_kg: float,
) -> float:
    """
    Calculate total fertilizer cost.

    Formula:

        Total fertilizer quantity =
            (N rate + P rate + K rate) × land area

        Fertilizer Cost =
            total fertilizer quantity × fertilizer price

    The N, P and K rates and the fertilizer price must come from
    the data source supplied to the calculator.
    """

    land_size = _validate_land_size(land_size_acres)

    n_rate = _validate_number(
        n_rate_kg_per_acre,
        "n_rate_kg_per_acre",
    )

    p_rate = _validate_number(
        p_rate_kg_per_acre,
        "p_rate_kg_per_acre",
    )

    k_rate = _validate_number(
        k_rate_kg_per_acre,
        "k_rate_kg_per_acre",
    )

    fertilizer_price = _validate_number(
        fertilizer_price_inr_per_kg,
        "fertilizer_price_inr_per_kg",
    )

    total_fertilizer_quantity = (
        n_rate + p_rate + k_rate
    ) * land_size

    cost = (
        total_fertilizer_quantity
        * fertilizer_price
    )

    return _money(cost)


def calculate_water_cost(
    land_size_acres: float,
    water_requirement_mm: float,
    water_rate_inr_per_mm_per_acre: float,
    water_efficiency_factor: float = 1.0,
) -> float:
    """
    Calculate irrigation/water cost.

    Formula:

        Water Cost =
            water requirement
            × water rate
            × land area
            × efficiency factor

    The water requirement and water tariff/rate must come from
    authoritative sources.

    The efficiency factor defaults to 1.0 because we must not
    introduce an arbitrary efficiency assumption.
    """

    land_size = _validate_land_size(land_size_acres)

    water_requirement = _validate_number(
        water_requirement_mm,
        "water_requirement_mm",
    )

    water_rate = _validate_number(
        water_rate_inr_per_mm_per_acre,
        "water_rate_inr_per_mm_per_acre",
    )

    efficiency = _validate_number(
        water_efficiency_factor,
        "water_efficiency_factor",
        allow_zero=False,
    )

    cost = (
        water_requirement
        * water_rate
        * land_size
        * efficiency
    )

    return _money(cost)


def calculate_labour_cost(
    land_size_acres: float,
    labor_days_per_acre: float,
    wage_inr_per_day: float,
) -> float:
    """
    Calculate total labour cost.

    Formula:

        Labour Cost =
            labour days per acre
            × wage per day
            × land area
    """

    land_size = _validate_land_size(land_size_acres)

    labour_days = _validate_number(
        labor_days_per_acre,
        "labor_days_per_acre",
    )

    wage = _validate_number(
        wage_inr_per_day,
        "wage_inr_per_day",
    )

    cost = (
        labour_days
        * wage
        * land_size
    )

    return _money(cost)


def calculate_machinery_cost(
    land_size_acres: float,
    machinery_cost_inr_per_acre: float = 0.0,
) -> float:
    """
    Calculate machinery cost.

    Machinery cost is optional because the availability of
    authoritative regional machinery-rental data will be established
    during the real-data phase.

    If no machinery cost is supplied, it remains zero.
    """

    land_size = _validate_land_size(land_size_acres)

    machinery_rate = _validate_number(
        machinery_cost_inr_per_acre,
        "machinery_cost_inr_per_acre",
    )

    return _money(land_size * machinery_rate)


def calculate_other_input_cost(
    land_size_acres: float,
    other_input_cost_inr_per_acre: float = 0.0,
) -> float:
    """
    Calculate optional additional input costs.

    No default agricultural price is assumed.
    """

    land_size = _validate_land_size(land_size_acres)

    other_rate = _validate_number(
        other_input_cost_inr_per_acre,
        "other_input_cost_inr_per_acre",
    )

    return _money(land_size * other_rate)


# ============================================================================
# Financial calculations
# ============================================================================

def calculate_total_cost(
    seed_cost: float,
    fertilizer_cost: float,
    water_cost: float,
    labour_cost: float,
    machinery_cost: float = 0.0,
    other_input_cost: float = 0.0,
) -> float:
    """
    Calculate total cultivation/input cost.
    """

    costs = {
        "seed_cost": seed_cost,
        "fertilizer_cost": fertilizer_cost,
        "water_cost": water_cost,
        "labour_cost": labour_cost,
        "machinery_cost": machinery_cost,
        "other_input_cost": other_input_cost,
    }

    validated_costs = {
        name: _validate_number(value, name)
        for name, value in costs.items()
    }

    total = sum(validated_costs.values())

    return _money(total)


def calculate_revenue(
    land_size_acres: float,
    expected_yield_kg_per_acre: float,
    market_price_inr_per_kg: float,
) -> float:
    """
    Calculate estimated crop revenue.

    Formula:

        Total yield =
            expected yield per acre × land area

        Revenue =
            total yield × market price

    The market price must be supplied by the real market-data layer.
    """

    land_size = _validate_land_size(land_size_acres)

    expected_yield = _validate_number(
        expected_yield_kg_per_acre,
        "expected_yield_kg_per_acre",
    )

    market_price = _validate_number(
        market_price_inr_per_kg,
        "market_price_inr_per_kg",
    )

    total_yield = expected_yield * land_size

    revenue = total_yield * market_price

    return _money(revenue)


def calculate_net_profit(
    revenue: float,
    total_cost: float,
) -> float:
    """
    Calculate net profit.

    Formula:

        Net Profit = Revenue - Total Cost
    """

    revenue_value = _validate_number(
        revenue,
        "revenue",
    )

    cost_value = _validate_number(
        total_cost,
        "total_cost",
    )

    return _money(revenue_value - cost_value)


def calculate_roi(
    net_profit: float,
    total_cost: float,
) -> Optional[float]:
    """
    Calculate ROI percentage.

    Formula:

        ROI (%) =
            (Net Profit / Total Cost) × 100

    Returns None when total cost is zero because ROI would
    otherwise require division by zero.
    """

    profit = float(net_profit)

    cost = _validate_number(
        total_cost,
        "total_cost",
    )

    if cost == 0:
        return ZERO_COST_ROI

    return _percentage((profit / cost) * 100)


# ============================================================================
# Main calculation function
# ============================================================================

def calculate_cost(
    *,
    crop: str,
    land_size_acres: float,

    seed_rate_kg_per_acre: float,
    seed_price_inr_per_kg: float,

    n_rate_kg_per_acre: float,
    p_rate_kg_per_acre: float,
    k_rate_kg_per_acre: float,
    fertilizer_price_inr_per_kg: float,

    water_requirement_mm: float,
    water_rate_inr_per_mm_per_acre: float,
    water_efficiency_factor: float = 1.0,

    labor_days_per_acre: float,
    wage_inr_per_day: float,

    expected_yield_kg_per_acre: float,
    market_price_inr_per_kg: float,

    machinery_cost_inr_per_acre: float = 0.0,
    other_input_cost_inr_per_acre: float = 0.0,
) -> Dict[str, Any]:
    """
    Calculate a complete crop cultivation cost estimate.

    Parameters
    ----------
    crop:
        Crop name.

    land_size_acres:
        Farm area in acres.

    seed_rate_kg_per_acre:
        Seed requirement per acre.

    seed_price_inr_per_kg:
        Seed price per kilogram.

    n_rate_kg_per_acre:
        Nitrogen-related input quantity per acre.

    p_rate_kg_per_acre:
        Phosphorus-related input quantity per acre.

    k_rate_kg_per_acre:
        Potassium-related input quantity per acre.

    fertilizer_price_inr_per_kg:
        Fertilizer/input price per kilogram.

    water_requirement_mm:
        Crop water requirement in millimetres.

    water_rate_inr_per_mm_per_acre:
        Water/irrigation cost rate.

    water_efficiency_factor:
        Efficiency multiplier supplied by the data/methodology layer.
        Defaults to 1.0 and is NOT an arbitrary 1.15 assumption.

    labor_days_per_acre:
        Labour requirement per acre.

    wage_inr_per_day:
        Wage per labour day.

    expected_yield_kg_per_acre:
        Expected crop yield per acre.

    market_price_inr_per_kg:
        Current/selected market selling price.

    machinery_cost_inr_per_acre:
        Optional machinery cost.

    other_input_cost_inr_per_acre:
        Optional additional input cost.

    Returns
    -------
    dict
        Structured cost, revenue, profit and ROI result.
    """

    if not isinstance(crop, str) or not crop.strip():
        raise ValueError("crop must be a non-empty string.")

    crop_name = crop.strip()

    # ------------------------------------------------------------------
    # Individual costs
    # ------------------------------------------------------------------

    seed_cost = calculate_seed_cost(
        land_size_acres=land_size_acres,
        seed_rate_kg_per_acre=seed_rate_kg_per_acre,
        seed_price_inr_per_kg=seed_price_inr_per_kg,
    )

    fertilizer_cost = calculate_fertilizer_cost(
        land_size_acres=land_size_acres,
        n_rate_kg_per_acre=n_rate_kg_per_acre,
        p_rate_kg_per_acre=p_rate_kg_per_acre,
        k_rate_kg_per_acre=k_rate_kg_per_acre,
        fertilizer_price_inr_per_kg=fertilizer_price_inr_per_kg,
    )

    water_cost = calculate_water_cost(
        land_size_acres=land_size_acres,
        water_requirement_mm=water_requirement_mm,
        water_rate_inr_per_mm_per_acre=water_rate_inr_per_mm_per_acre,
        water_efficiency_factor=water_efficiency_factor,
    )

    labour_cost = calculate_labour_cost(
        land_size_acres=land_size_acres,
        labor_days_per_acre=labor_days_per_acre,
        wage_inr_per_day=wage_inr_per_day,
    )

    machinery_cost = calculate_machinery_cost(
        land_size_acres=land_size_acres,
        machinery_cost_inr_per_acre=machinery_cost_inr_per_acre,
    )

    other_input_cost = calculate_other_input_cost(
        land_size_acres=land_size_acres,
        other_input_cost_inr_per_acre=other_input_cost_inr_per_acre,
    )

    # ------------------------------------------------------------------
    # Total cost
    # ------------------------------------------------------------------

    total_cost = calculate_total_cost(
        seed_cost=seed_cost,
        fertilizer_cost=fertilizer_cost,
        water_cost=water_cost,
        labour_cost=labour_cost,
        machinery_cost=machinery_cost,
        other_input_cost=other_input_cost,
    )

    # ------------------------------------------------------------------
    # Revenue
    # ------------------------------------------------------------------

    estimated_revenue = calculate_revenue(
        land_size_acres=land_size_acres,
        expected_yield_kg_per_acre=expected_yield_kg_per_acre,
        market_price_inr_per_kg=market_price_inr_per_kg,
    )

    # ------------------------------------------------------------------
    # Profit and ROI
    # ------------------------------------------------------------------

    net_profit = calculate_net_profit(
        revenue=estimated_revenue,
        total_cost=total_cost,
    )

    roi_percent = calculate_roi(
        net_profit=net_profit,
        total_cost=total_cost,
    )

    # ------------------------------------------------------------------
    # Final structured result
    # ------------------------------------------------------------------

    return {
        "crop": crop_name,
        "land_size_acres": _money(land_size_acres),

        "breakdown": {
            "seed": seed_cost,
            "fertilizer": fertilizer_cost,
            "water": water_cost,
            "labor": labour_cost,
            "machinery": machinery_cost,
            "other_inputs": other_input_cost,
        },

        "total_cost": total_cost,

        "estimated_revenue": estimated_revenue,

        "net_profit": net_profit,

        "roi_percent": roi_percent,
    }