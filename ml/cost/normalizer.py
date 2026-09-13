"""
Normalization utilities for agricultural data.

Different government datasets use different field names and units.
This module converts those records into a consistent internal format.

IMPORTANT:
No agricultural prices, yields, wages, or requirements are created here.
Only supplied source data is transformed.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from .constants import (
    ACRE_TO_HECTARE,
    HECTARE_TO_ACRE,
    KG_PER_QUINTAL,
)
from .validators import (
    validate_crop,
    validate_non_negative,
    validate_required,
)


def _get_first(record: dict[str, Any], *field_names: str):
    """
    Return the first available field from a record.

    Empty strings are treated as missing.
    """
    for field_name in field_names:
        value = record.get(field_name)

        if value is not None and str(value).strip() != "":
            return value

    return None


def _to_float(value: Any, field_name: str) -> float:
    """Convert a supplied value to a non-negative float."""
    return validate_non_negative(value, field_name)


def quintal_to_kg(value: Any) -> float:
    """Convert a quantity expressed in quintals to kilograms."""
    return _to_float(value, "quantity_quintal") * KG_PER_QUINTAL


def price_quintal_to_kg(value: Any) -> float:
    """Convert a price expressed in INR/quintal to INR/kg."""
    return _to_float(value, "price_inr_per_quintal") / KG_PER_QUINTAL


def hectare_to_acre(value: Any) -> float:
    """Convert hectares to acres."""
    return _to_float(value, "area_hectare") * HECTARE_TO_ACRE


def acre_to_hectare(value: Any) -> float:
    """Convert acres to hectares."""
    return _to_float(value, "area_acre") * ACRE_TO_HECTARE


def normalize_mandi_record(record: dict[str, Any]) -> dict[str, Any]:
    """
    Normalize an AGMARKNET/data.gov.in-style mandi record.

    The function preserves the original market information while
    converting prices from INR/quintal to INR/kg.

    No price is created if the source does not provide one.
    """
    validate_required(record, "record")

    crop = _get_first(
        record,
        "Commodity",
        "commodity",
        "Crop",
        "crop",
    )

    crop = validate_crop(crop)
    state = _get_first(
    record,
    "State",
    "state",
    "state_name",
    )

    district = _get_first(
    record,
    "District",
    "district",
    "district_name",
    )

    market = _get_first(
        record,
        "Market",
        "market",
        "Market Name",
        "market_name",
    )
    date = _get_first(
        record,
        "Arrival_Date",
        "arrival_date",
        "Date",
        "date",
    )

    min_price = _get_first(
    record,
    "Min_Price",
    "min_price",
    "Minimum Price",
    "min_price_inr_per_quintal",
    "minimum_price_inr_per_quintal",
)

    max_price = _get_first(
    record,
    "Max_Price",
    "max_price",
    "Maximum Price",
    "max_price_inr_per_quintal",
    "maximum_price_inr_per_quintal",
)

    modal_price = _get_first(
        record,
        "Modal_Price",
        "modal_price",
        "Modal Price",
        "modal_price_inr_per_quintal",
    )

    result = {
        "crop": crop,
        "state": state,
        "district": district,
        "market": market,
        "date": date,
        "min_price_inr_per_quintal": None,
        "max_price_inr_per_quintal": None,
        "modal_price_inr_per_quintal": None,
        "min_price_inr_per_kg": None,
        "max_price_inr_per_kg": None,
        "modal_price_inr_per_kg": None,
        "source": "AGMARKNET/data.gov.in",
    }

    if min_price is not None:
        result["min_price_inr_per_quintal"] = _to_float(
            min_price,
            "min_price_inr_per_quintal",
        )
        result["min_price_inr_per_kg"] = price_quintal_to_kg(min_price)

    if max_price is not None:
        result["max_price_inr_per_quintal"] = _to_float(
            max_price,
            "max_price_inr_per_quintal",
        )
        result["max_price_inr_per_kg"] = price_quintal_to_kg(max_price)

    if modal_price is not None:
        result["modal_price_inr_per_quintal"] = _to_float(
            modal_price,
            "modal_price_inr_per_quintal",
        )
        result["modal_price_inr_per_kg"] = price_quintal_to_kg(modal_price)

    return result


def normalize_yield_record(record: dict[str, Any]) -> dict[str, Any]:
    """
    Normalize an official crop-yield record.

    Expected source information may be supplied in kg/hectare
    or tonnes/hectare.

    The function does not estimate or invent missing yield values.
    """
    validate_required(record, "record")

    crop = validate_crop(
        _get_first(record, "Crop", "crop", "Commodity", "commodity")
    )

    state = _get_first(record, "State", "state")
    district = _get_first(record, "District", "district")
    season = _get_first(record, "Season", "season")
    year = _get_first(record, "Year", "year")

    yield_kg_per_hectare = _get_first(
        record,
        "yield_kg_per_hectare",
        "Yield_kg_per_hectare",
    )

    yield_tonnes_per_hectare = _get_first(
        record,
        "yield_tonnes_per_hectare",
        "Yield_tonnes_per_hectare",
    )

    if yield_kg_per_hectare is not None:
        yield_value = _to_float(
            yield_kg_per_hectare,
            "yield_kg_per_hectare",
        )

    elif yield_tonnes_per_hectare is not None:
        yield_value = (
            _to_float(
                yield_tonnes_per_hectare,
                "yield_tonnes_per_hectare",
            )
            * 1000.0
        )

    else:
        yield_value = None

    return {
        "crop": crop,
        "state": state,
        "district": district,
        "season": season,
        "year": year,
        "yield_kg_per_hectare": yield_value,
        "yield_kg_per_acre": (
            yield_value * ACRE_TO_HECTARE
            if yield_value is not None
            else None
        ),
        "source": "official",
    }


def normalize_labour_record(record: dict[str, Any]) -> dict[str, Any]:
    """
    Normalize a Labour Bureau rural agricultural wage record.

    Male/female wages remain separate because combining them without
    knowing the labour composition would introduce an assumption.
    """
    validate_required(record, "record")

    state = _get_first(record, "State", "state")
    year = _get_first(record, "Year", "year")
    month = _get_first(record, "Month", "month")

    occupation = _get_first(
        record,
        "Occupation",
        "occupation",
    )

    activity = _get_first(
        record,
        "Item",
        "item",
        "Activity",
        "activity",
    )

    male_wage = _get_first(
        record,
        "Male",
        "male",
        "Male_Wage",
        "male_wage",
    )

    female_wage = _get_first(
        record,
        "Female",
        "female",
        "Female_Wage",
        "female_wage",
    )

    return {
        "state": state,
        "year": year,
        "month": month,
        "occupation": occupation,
        "activity": activity,
        "male_wage_inr_per_day": (
            _to_float(male_wage, "male_wage_inr_per_day")
            if male_wage is not None
            else None
        ),
        "female_wage_inr_per_day": (
            _to_float(female_wage, "female_wage_inr_per_day")
            if female_wage is not None
            else None
        ),
        "source": "Labour Bureau",
    }