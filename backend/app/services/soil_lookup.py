"""Streaming lookup of the nearest SLUSI soil observation.

The SLUSI source is GeoJSON Lines and can be several gigabytes large. This
module reads one line at a time instead of materialising the dataset. Its
``SoilGeoJsonlLookup`` class keeps the lookup boundary separate from the source
format, so a disk-backed spatial index can later use the same interface.
"""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any, Optional

class SoilLookupError(Exception):
    """Raised when a soil lookup cannot be completed."""


class SoilGeoJsonlLookup:
    """Find the nearest valid Point feature by streaming a GeoJSONL file."""

    def __init__(self, dataset_path: str | Path) -> None:
        self.dataset_path = Path(dataset_path).expanduser()

    def find_nearest(self, latitude: float, longitude: float) -> dict[str, Any]:
        """Return the nearest SLUSI record, scanning the file incrementally.

        A non-identical coordinate receives an exact full-file nearest lookup.
        Exact coordinate matches return immediately because no point is nearer.
        Malformed lines and records without a valid Point are ignored.
        """
        query_latitude = _coordinate(latitude, "latitude", -90, 90)
        query_longitude = _coordinate(longitude, "longitude", -180, 180)
        if not self.dataset_path.is_file():
            raise SoilLookupError(
                "SLUSI soil dataset was not found. Set SLUSI_SOIL_DATASET_PATH to a valid file."
            )

        nearest: Optional[dict[str, Any]] = None
        nearest_distance = math.inf
        with self.dataset_path.open("r", encoding="utf-8", errors="replace") as source:
            for line in source:
                candidate = _soil_record(_parse_line(line))
                if candidate is None:
                    continue
                distance = _haversine_km(
                    query_latitude, query_longitude,
                    candidate["latitude"], candidate["longitude"],
                )
                if distance < nearest_distance:
                    nearest_distance = distance
                    nearest = candidate
                    if distance == 0:
                        break

        if nearest is None:
            raise SoilLookupError("No valid Point records were found in the SLUSI soil dataset.")
        nearest["distance_km"] = nearest_distance
        return nearest


def lookup_nearest_soil(latitude: float, longitude: float) -> dict[str, Any]:
    """Look up soil using the configured ``SLUSI_SOIL_DATASET_PATH``."""
    # Import lazily so this standalone streaming utility remains usable by
    # maintenance scripts without loading the FastAPI settings dependencies.
    from app.core.config import settings

    if not settings.SLUSI_SOIL_DATASET_PATH.strip():
        raise SoilLookupError("SLUSI_SOIL_DATASET_PATH is not configured.")
    return SoilGeoJsonlLookup(settings.SLUSI_SOIL_DATASET_PATH).find_nearest(
        latitude, longitude
    )


def _parse_line(line: str) -> Optional[dict[str, Any]]:
    if not line.strip():
        return None
    try:
        value = json.loads(line)
    except json.JSONDecodeError:
        return None
    return value if isinstance(value, dict) else None


def _soil_record(record: Optional[dict[str, Any]]) -> Optional[dict[str, Any]]:
    if record is None:
        return None
    geometry = record.get("geometry")
    if not isinstance(geometry, dict) or geometry.get("type") != "Point":
        return None
    coordinates = geometry.get("coordinates")
    if not isinstance(coordinates, (list, tuple)) or len(coordinates) < 2:
        return None
    try:
        longitude = _coordinate(coordinates[0], "longitude", -180, 180)
        latitude = _coordinate(coordinates[1], "latitude", -90, 90)
    except SoilLookupError:
        return None

    properties = record.get("properties")
    if not isinstance(properties, dict):
        properties = record
    return {
        "N": _safe_number(properties.get("N")),
        "P": _safe_number(properties.get("P")),
        "K": _safe_number(properties.get("K")),
        "pH": _safe_number(properties.get("pH", properties.get("ph"))),
        "latitude": latitude,
        "longitude": longitude,
        "village": _safe_text(properties.get("VILLAGE")),
        "mandal": _safe_text(properties.get("MANDAL")),
        "district": _safe_text(properties.get("DISTRICT")),
        "state": _safe_text(properties.get("STATE")),
        "dataset_cycle": _safe_text(properties.get("cycle")),
    }


def _coordinate(value: Any, name: str, minimum: float, maximum: float) -> float:
    number = _safe_number(value)
    if number is None or not minimum <= number <= maximum:
        raise SoilLookupError(f"{name.capitalize()} must be finite and between {minimum} and {maximum}.")
    return number


def _safe_number(value: Any) -> Optional[float]:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def _safe_text(value: Any) -> Optional[str]:
    if value is None:
        return None
    value = str(value).strip()
    return value or None


def _haversine_km(lat_one: float, lon_one: float, lat_two: float, lon_two: float) -> float:
    radius_km = 6371.0088
    lat_delta = math.radians(lat_two - lat_one)
    lon_delta = math.radians(lon_two - lon_one)
    a = (math.sin(lat_delta / 2) ** 2 + math.cos(math.radians(lat_one))
         * math.cos(math.radians(lat_two)) * math.sin(lon_delta / 2) ** 2)
    return radius_km * 2 * math.asin(math.sqrt(a))
