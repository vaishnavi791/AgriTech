"""Boundary between location-derived soil data and crop-model inputs.

This module deliberately prepares only the four fields available from SLUSI.
It does not call the crop model because temperature, humidity, and rainfall
must be provided by a real weather source before prediction is possible.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any, Callable, Mapping

from app.services.soil_lookup import lookup_nearest_soil


class SoilModelInputError(ValueError):
    """Raised when SLUSI cannot supply the soil inputs required by the model."""


@dataclass(frozen=True)
class SoilModelInputs:
    """The location-derived portion of the existing seven-field model input."""

    N: float
    P: float
    K: float
    ph: float
    soil_record: Mapping[str, Any]

    @property
    def missing_model_inputs(self) -> tuple[str, str, str]:
        """Weather fields still required before calling ``predict_crop``."""
        return ("temperature", "humidity", "rainfall")


SoilLookup = Callable[[float, float], Mapping[str, Any]]


def get_soil_model_inputs(
    latitude: float,
    longitude: float,
    *,
    soil_lookup: SoilLookup = lookup_nearest_soil,
) -> SoilModelInputs:
    """Resolve coordinates to validated N/P/K/pH without making a prediction."""
    soil_record = soil_lookup(latitude, longitude)
    values = {
        "N": _required_soil_value(soil_record, "N"),
        "P": _required_soil_value(soil_record, "P"),
        "K": _required_soil_value(soil_record, "K"),
        "ph": _required_soil_value(soil_record, "pH"),
    }
    return SoilModelInputs(**values, soil_record=soil_record)


def _required_soil_value(soil_record: Mapping[str, Any], field: str) -> float:
    try:
        value = float(soil_record.get(field))
    except (TypeError, ValueError):
        raise SoilModelInputError(f"Nearest soil record has no valid {field} value.") from None
    if not math.isfinite(value):
        raise SoilModelInputError(f"Nearest soil record has no valid {field} value.")
    return value
