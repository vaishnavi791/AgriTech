"""
AGMARKNET ingestion helpers.

The historical AGMARKNET endpoint returns all available markets for a
state + commodity + year + month. This module flattens that response
into row-level records for the existing cost-estimation data pipeline.

No agricultural price/rate is hardcoded here.
"""

from __future__ import annotations

from typing import Any

from .agmarknet_client import AgmarknetClient


def _first(record: dict[str, Any], *names: str) -> Any:
    """Return the first non-empty value found under the supplied keys."""
    for name in names:
        if name in record and record[name] not in (None, ""):
            return record[name]
    return None


def _float_or_none(value: Any) -> float | None:
    """Convert a numeric value to float while preserving missing values."""
    if value in (None, ""):
        return None

    try:
        return float(str(value).replace(",", "").strip())
    except (TypeError, ValueError):
        return None


def flatten_date_wise_commodity_response(
    payload: dict[str, Any],
    *,
    state_name: str,
    commodity_name: str,
    state_id: int | str,
    commodity_id: int | str,
) -> list[dict[str, Any]]:
    """
    Flatten the AGMARKNET date-wise commodity response.

    Expected structure:

    {
      "success": true,
      "markets": [
        {
          "marketName": "...",
          "dates": [
            {
              "arrivalDate": "DD/MM/YYYY",
              "total_arrivals": ...,
              "data": [
                {
                  "variety": "...",
                  "arrivals": ...,
                  "minimumPrice": ...,
                  "maximumPrice": ...,
                  "modalPrice": ...
                }
              ]
            }
          ]
        }
      ]
    }

    Missing values remain None.
    No fallback or fabricated price is created.
    """

    # Do not process an unsuccessful API response.
    if payload.get("success") is False:
        return []

    markets = payload.get("markets", [])

    if not isinstance(markets, list):
        return []

    rows: list[dict[str, Any]] = []

    for market in markets:
        if not isinstance(market, dict):
            continue

        market_name = _first(
            market,
            "marketName",
            "market_name",
            "name",
        )

        dates = _first(
            market,
            "dates",
            "dateData",
            "date_data",
        ) or []

        if not isinstance(dates, list):
            continue

        for date_entry in dates:
            if not isinstance(date_entry, dict):
                continue

            arrival_date = _first(
                date_entry,
                "arrivalDate",
                "arrival_date",
                "date",
            )

            total_arrivals = _float_or_none(
                _first(
                    date_entry,
                    "total_arrivals",
                    "totalArrivals",
                    "arrivals",
                )
            )

            data = _first(
                date_entry,
                "data",
                "records",
            ) or []

            if not isinstance(data, list):
                data = []

            # Preserve every variety-level AGMARKNET record.
            for item in data:
                if not isinstance(item, dict):
                    continue

                item_arrivals = _float_or_none(
                    _first(
                        item,
                        "arrivals",
                        "arrival",
                        "total_arrivals",
                    )
                )

                # Only fall back to date-level arrivals when the
                # variety-level value is genuinely missing.
                if item_arrivals is None:
                    item_arrivals = total_arrivals

                rows.append(
                    {
                        "state_id": state_id,
                        "state_name": state_name,
                        "market_name": market_name,
                        "commodity_id": commodity_id,
                        "commodity": commodity_name,
                        "arrival_date": arrival_date,
                        "variety": _first(
                            item,
                            "variety",
                            "varietyName",
                        ),
                        "grade": _first(
                            item,
                            "grade",
                            "gradeName",
                        ),
                        "arrivals_mt": item_arrivals,
                        "minimum_price_inr_per_quintal": _float_or_none(
                            _first(
                                item,
                                "minimumPrice",
                                "minPrice",
                            )
                        ),
                        "maximum_price_inr_per_quintal": _float_or_none(
                            _first(
                                item,
                                "maximumPrice",
                                "maxPrice",
                            )
                        ),
                        "modal_price_inr_per_quintal": _float_or_none(
                            _first(
                                item,
                                "modalPrice",
                                "modal_price",
                            )
                        ),
                        "source": "AGMARKNET",
                    }
                )

            # Preserve a date-level record when AGMARKNET provides
            # no variety-level records for that date.
            if not data:
                rows.append(
                    {
                        "state_id": state_id,
                        "state_name": state_name,
                        "market_name": market_name,
                        "commodity_id": commodity_id,
                        "commodity": commodity_name,
                        "arrival_date": arrival_date,
                        "variety": None,
                        "grade": None,
                        "arrivals_mt": total_arrivals,
                        "minimum_price_inr_per_quintal": None,
                        "maximum_price_inr_per_quintal": None,
                        "modal_price_inr_per_quintal": None,
                        "source": "AGMARKNET",
                    }
                )

    return rows


def fetch_month(
    client: AgmarknetClient,
    *,
    year: int,
    month: int,
    state_id: int | str,
    state_name: str,
    commodity_id: int | str,
    commodity_name: str,
) -> list[dict[str, Any]]:
    """Fetch and flatten one month of AGMARKNET data."""

    payload = client.date_wise_specific_commodity(
        year=year,
        month=month,
        state_id=state_id,
        commodity_id=commodity_id,
    )

    if not isinstance(payload, dict):
        return []

    return flatten_date_wise_commodity_response(
        payload,
        state_name=state_name,
        commodity_name=commodity_name,
        state_id=state_id,
        commodity_id=commodity_id,
    )


def fetch_years(
    client: AgmarknetClient,
    *,
    years: list[int],
    state_id: int | str,
    state_name: str,
    commodity_id: int | str,
    commodity_name: str,
) -> list[dict[str, Any]]:
    """
    Fetch all 12 months for each requested year.

    Empty months are skipped.

    Absence of an AGMARKNET record never becomes a fabricated price.
    """

    rows: list[dict[str, Any]] = []

    for year in years:
        for month in range(1, 13):
            rows.extend(
                fetch_month(
                    client,
                    year=year,
                    month=month,
                    state_id=state_id,
                    state_name=state_name,
                    commodity_id=commodity_id,
                    commodity_name=commodity_name,
                )
            )

    return rows