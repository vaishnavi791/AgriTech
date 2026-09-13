"""
Validation helpers for agricultural cost-estimation data.

These functions validate data received from external sources or users.
They do not provide fallback agricultural values.
"""


def validate_required(value, field_name: str):
    """Ensure a required value is present."""
    if value is None:
        raise ValueError(f"{field_name} is required.")

    if isinstance(value, str) and not value.strip():
        raise ValueError(f"{field_name} cannot be empty.")

    return value


def validate_non_negative(value, field_name: str):
    """Ensure a numeric value is zero or greater."""
    validate_required(value, field_name)

    try:
        numeric_value = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} must be numeric.")

    if numeric_value < 0:
        raise ValueError(f"{field_name} cannot be negative.")

    return numeric_value


def validate_positive(value, field_name: str):
    """Ensure a numeric value is greater than zero."""
    validate_required(value, field_name)

    try:
        numeric_value = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} must be numeric.")

    if numeric_value <= 0:
        raise ValueError(f"{field_name} must be greater than zero.")

    return numeric_value


def validate_crop(crop: str):
    """Validate a crop name."""
    validate_required(crop, "crop")

    if not isinstance(crop, str):
        raise ValueError("crop must be a string.")

    return crop.strip()


def validate_unit(unit: str, allowed_units: set[str], field_name: str):
    """Validate that a unit belongs to the allowed set."""
    validate_required(unit, field_name)

    normalized_unit = str(unit).strip().lower()

    if normalized_unit not in allowed_units:
        raise ValueError(
            f"Unsupported {field_name}: {unit}. "
            f"Allowed units: {sorted(allowed_units)}"
        )

    return normalized_unit