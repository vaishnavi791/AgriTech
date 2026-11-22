"""Historical crop candidates from the reduced Uttar Pradesh APY dataset.

This is descriptive historical evidence, not an agronomic-suitability model.
"""

from __future__ import annotations

import csv
import math
from collections import defaultdict
from pathlib import Path
from typing import Any, Optional


APY_DATASET_PATH = (
    Path(__file__).resolve().parents[2] / "data" / "apy" / "uttar_pradesh_apy_2019_2023.csv"
)


class APYRecommendationError(ValueError):
    """Raised when APY historical candidates cannot be calculated."""


def historical_crop_candidates(
    district: str,
    season: str,
    *,
    dataset_path: Path = APY_DATASET_PATH,
) -> list[dict[str, Any]]:
    """Return historical crop candidates based on APY records.

    Candidates are ranked by record count, then most recent appearance, then
    average observed area. This ranking describes historical evidence only; it
    does not establish agronomic suitability.
    """
    normalized_district = _normalized_text(district, "district")
    normalized_season = _normalized_text(season, "season")
    if not dataset_path.is_file():
        raise APYRecommendationError(f"Reduced APY dataset was not found: {dataset_path}")

    groups: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"records": 0, "area": [], "production": [], "yield": [], "years": []}
    )
    with dataset_path.open("r", encoding="utf-8", newline="") as source:
        for row in csv.DictReader(source):
            if (
                row["district_name"].strip().casefold() != normalized_district
                or row["season"].strip().casefold() != normalized_season
            ):
                continue
            group = groups[row["crop_name"]]
            group["records"] += 1
            group["years"].append(row["year"])
            for measure in ("area", "production", "yield"):
                value = _safe_number(row.get(measure))
                if value is not None:
                    group[measure].append(value)

    candidates = [
        {
            "crop_name": crop_name,
            "historical_record_count": group["records"],
            "average_area": _average(group["area"]),
            "average_production": _average(group["production"]),
            "average_yield": _average(group["yield"]),
            "most_recent_year": max(group["years"], key=_year_sort_key),
        }
        for crop_name, group in groups.items()
    ]
    candidates.sort(
        key=lambda candidate: (
            -candidate["historical_record_count"],
            tuple(-value for value in _year_sort_key(candidate["most_recent_year"])),
            -(candidate["average_area"] or 0),
            candidate["crop_name"],
        )
    )
    for rank, candidate in enumerate(candidates, start=1):
        candidate["historical_evidence_rank"] = rank
    return candidates


def _normalized_text(value: str, field: str) -> str:
    normalized = value.strip().casefold() if isinstance(value, str) else ""
    if not normalized:
        raise APYRecommendationError(f"{field.capitalize()} is required.")
    return normalized


def _safe_number(value: Optional[str]) -> Optional[float]:
    try:
        number = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def _average(values: list[float]) -> Optional[float]:
    return sum(values) / len(values) if values else None


def _year_sort_key(year: str) -> tuple[int, int]:
    try:
        start, end = year.split("-", maxsplit=1)
        return int(start), int(end)
    except (AttributeError, ValueError):
        return -1, -1
