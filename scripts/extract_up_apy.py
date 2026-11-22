"""Create the small Uttar Pradesh APY subset used by the backend prototype."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


OUTPUT_FIELDS = (
    "year",
    "state_name",
    "district_name",
    "crop_name",
    "crop_type",
    "season",
    "area",
    "production",
    "yield",
)
ALLOWED_YEARS = {"2019-2020", "2020-2021", "2021-2022", "2022-2023"}
ALLOWED_SEASONS = {"Kharif", "Rabi"}


def extract(source_path: Path, output_path: Path) -> int:
    """Stream the APY source and write only the requested Uttar Pradesh rows."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with source_path.open("r", encoding="utf-8-sig", newline="") as source, output_path.open(
        "w", encoding="utf-8", newline=""
    ) as output:
        reader = csv.DictReader(source)
        writer = csv.DictWriter(output, fieldnames=OUTPUT_FIELDS)
        writer.writeheader()
        for row in reader:
            if (
                row["state_name"] != "Uttar Pradesh"
                or row["season"] not in ALLOWED_SEASONS
                or row["year"] not in ALLOWED_YEARS
                or row["crop_name"] == "Total"
            ):
                continue
            writer.writerow({field: row[field] for field in OUTPUT_FIELDS})
            count += 1
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract the Uttar Pradesh APY subset.")
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    print(f"Extracted {extract(arguments.source, arguments.output)} records to {arguments.output}")


if __name__ == "__main__":
    main()
