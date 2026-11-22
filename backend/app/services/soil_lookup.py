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
    """Look up soil using the configured ``SLUSI_SOIL_DATASET_PATH``.

    This implementation first tries to use a pre-built KD‑Tree index stored in
    ``soil_index.npz`` (located alongside the GeoJSONL dataset). If the index is
    missing or any error occurs, it falls back to the original streaming
    ``SoilGeoJsonlLookup`` implementation.
    """
    import os
    import numpy as np
    from scipy.spatial import cKDTree

    dataset_path = os.getenv("SLUSI_SOIL_DATASET_PATH", "").strip()
    if not dataset_path:
        raise SoilLookupError("SLUSI_SOIL_DATASET_PATH is not configured.")

    try:
        # Resolve index path – same directory, named soil_index.npz
        index_path = Path(dataset_path).with_name("soil_index.npz")
        if not index_path.is_file():
            raise FileNotFoundError
        # Load the index (coords: Nx2 float32, offsets: N int64)
        index_data = np.load(index_path)
        coords = index_data["coords"]  # shape (N, 2)
        offsets = index_data["offsets"]  # shape (N,)
        # Build KD‑Tree (Euclidean in degree space)
        tree = cKDTree(coords)
        # Query the nearest point
        dist_deg, idx = tree.query([latitude, longitude], k=1)
        nearest_lat, nearest_lon = coords[idx]
        # Convert Euclidean degree distance to haversine km for the API response
        distance_km = _haversine_km(latitude, longitude, nearest_lat, nearest_lon)
        # Retrieve the original line from the GeoJSONL file using the byte offset
        with open(dataset_path, "rb") as f:
            f.seek(int(offsets[idx]))
            line_bytes = f.readline()
        line = line_bytes.decode("utf-8", errors="replace")
        record = _soil_record(_parse_line(line))
        if record is None:
            raise SoilLookupError("Failed to parse soil record from indexed line.")
        record["distance_km"] = distance_km
        return record
    except Exception:
        # Any problem (missing index, corrupted file, etc.) → fallback to streaming
        return SoilGeoJsonlLookup(dataset_path).find_nearest(latitude, longitude)

    """Look up soil using the configured ``SLUSI_SOIL_DATASET_PATH``."""
    import os
    dataset_path = os.getenv("SLUSI_SOIL_DATASET_PATH", "").strip()
    if not dataset_path:
        raise SoilLookupError("SLUSI_SOIL_DATASET_PATH is not configured.")
    return SoilGeoJsonlLookup(dataset_path).find_nearest(
        latitude, longitude
    )
def lookup_soil_by_district(
    state: str,
    district: str,
) -> dict[str, Any]:
    """Return representative soil values from the precomputed district dataset."""

    import json

    normalized_state = _normalized_location_text(state, "state")
    normalized_district = _normalized_location_text(district, "district")

    if normalized_state != "uttar pradesh":
        raise SoilLookupError(
            "The current soil recommendation dataset only supports Uttar Pradesh."
        )

    dataset_path = (
        Path(__file__).resolve().parents[2]
        / "data"
        / "soil"
        / "up_district_soil.json"
    )

    if not dataset_path.is_file():
        raise SoilLookupError(
            f"UP district soil dataset was not found: {dataset_path}"
        )

    try:
        with dataset_path.open("r", encoding="utf-8") as source:
            districts = json.load(source)
    except (OSError, json.JSONDecodeError) as exc:
        raise SoilLookupError(
            f"Unable to read UP district soil dataset: {exc}"
        ) from exc



    district_aliases = {
    "prayagraj": "allahabad",
    }

    lookup_name = district_aliases.get(
        normalized_district,
        normalized_district,
    )

    district_data = None

    for name, values in districts.items():
        if name.strip().casefold() == lookup_name:
            district_data = values
            break

    if district_data is None:
        raise SoilLookupError(
            f"No soil data found for {state.strip()} / {district.strip()}."
        )

    return {
        "state": "Uttar Pradesh",
        "district": district.strip(),
        "record_count": district_data.get("record_count", 0),
        "N": district_data.get("N"),
        "P": district_data.get("P"),
        "K": district_data.get("K"),
        "ph": district_data.get("ph"),
    }


def _normalized_location_text(value: Any, field: str) -> str:
    normalized = _normalized_location_value(value)

    if not normalized:
        raise SoilLookupError(f"{field.capitalize()} is required.")

    return normalized


def _normalized_location_value(value: Any) -> str:
    if value is None:
        return ""

    return str(value).strip().casefold()

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
