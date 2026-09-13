"""
Constants used by the AgriTech cost calculation engine.

IMPORTANT:
This file intentionally does NOT contain crop prices, fertilizer prices,
labour wages, water tariffs, or other market-dependent values.

Those values must come from authoritative data sources and are passed
into the calculator at runtime.

Only unit conversions and mathematical safeguards belong here.
"""

# ---------------------------------------------------------------------------
# Unit conversions
# ---------------------------------------------------------------------------

KG_PER_QUINTAL = 100.0
KG_PER_TONNE = 1000.0

HECTARE_TO_ACRE = 2.4710538147
ACRE_TO_HECTARE = 1.0 / HECTARE_TO_ACRE


# ---------------------------------------------------------------------------
# Validation limits
# ---------------------------------------------------------------------------

MIN_LAND_SIZE_ACRES = 0.01

MIN_NON_NEGATIVE_VALUE = 0.0


# ---------------------------------------------------------------------------
# Financial calculation safeguards
# ---------------------------------------------------------------------------

# ROI cannot be calculated when total cultivation cost is zero.
# We return None instead of dividing by zero.
ZERO_COST_ROI = None


# ---------------------------------------------------------------------------
# Decimal precision
# ---------------------------------------------------------------------------

# Monetary results are rounded to two decimal places.
MONEY_DECIMAL_PLACES = 2
PERCENT_DECIMAL_PLACES = 2