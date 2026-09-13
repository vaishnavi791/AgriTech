"""
Data loading utilities for the AgriTech cost estimation module.

This module only loads data. It does not calculate agricultural costs
and does not contain hardcoded agricultural values.

Supported sources:
- CSV files
- JSON files
- already-loaded Python records

API integration can be added later without changing the calculator.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any


def load_csv(file_path: str | Path) -> list[dict[str, Any]]:
    """
    Load records from a CSV file.

    Each row is returned as a dictionary using the CSV header names.
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")

    if not path.is_file():
        raise ValueError(f"CSV path is not a file: {path}")

    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)

        if reader.fieldnames is None:
            raise ValueError("CSV file does not contain a header row.")

        return [dict(row) for row in reader]


def load_json(file_path: str | Path) -> list[dict[str, Any]]:
    """
    Load records from a JSON file.

    Accepted structures:

    1. A list of objects:
       [
           {"crop": "Wheat", ...},
           {"crop": "Rice", ...}
       ]

    2. An object containing a list under common keys such as:
       {
           "records": [...]
       }
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"JSON file not found: {path}")

    if not path.is_file():
        raise ValueError(f"JSON path is not a file: {path}")

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if isinstance(data, list):
        records = data

    elif isinstance(data, dict):
        records = None

        for key in ("records", "data", "results"):
            if isinstance(data.get(key), list):
                records = data[key]
                break

        if records is None:
            raise ValueError(
                "JSON object must contain a list under "
                "'records', 'data', or 'results'."
            )

    else:
        raise ValueError("JSON data must be a list or an object containing records.")

    for index, record in enumerate(records):
        if not isinstance(record, dict):
            raise ValueError(
                f"JSON record at index {index} must be an object."
            )

    return records


def load_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Validate and return already-loaded records.

    This is useful when records come directly from an API response.
    """
    if not isinstance(records, list):
        raise ValueError("records must be a list.")

    for index, record in enumerate(records):
        if not isinstance(record, dict):
            raise ValueError(
                f"Record at index {index} must be a dictionary."
            )

    return records