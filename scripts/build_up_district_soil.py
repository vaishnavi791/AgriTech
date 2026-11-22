import json
from collections import defaultdict
from pathlib import Path
from statistics import median

SOURCE = Path(
    r"D:\Study stuff\Final year project\CROP RECOMMENDATION"
    r"\New folder\new crop recommendation\SLUSI_UP.geojsonl"
)

OUTPUT = Path("backend/data/soil/up_district_soil.json")


def safe_number(value):
    try:
        number = float(value)
        return number if number == number else None
    except (TypeError, ValueError):
        return None


def main():
    if not SOURCE.is_file():
        raise SystemExit(f"Source dataset not found:\n{SOURCE}")

    districts = defaultdict(
        lambda: {
            "N": [],
            "P": [],
            "K": [],
            "pH": [],
        }
    )

    print(f"Reading:\n{SOURCE}")

    with SOURCE.open("r", encoding="utf-8", errors="replace") as source:
        for line in source:
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue

            properties = record.get("properties", record)

            if not isinstance(properties, dict):
                continue

            state = str(properties.get("STATE", "")).strip().casefold()
            district = str(properties.get("DISTRICT", "")).strip()

            if state != "uttar pradesh" or not district:
                continue

            bucket = districts[district]

            for key in ("N", "P", "K"):
                value = safe_number(properties.get(key))
                if value is not None:
                    bucket[key].append(value)

            ph = safe_number(
                properties.get("pH", properties.get("ph"))
            )

            if ph is not None:
                bucket["pH"].append(ph)

    result = {}

    for district, values in sorted(districts.items()):
        result[district] = {
            "record_count": max(
                len(values["N"]),
                len(values["P"]),
                len(values["K"]),
                len(values["pH"]),
            ),
            "N": median(values["N"]) if values["N"] else None,
            "P": median(values["P"]) if values["P"] else None,
            "K": median(values["K"]) if values["K"] else None,
            "ph": median(values["pH"]) if values["pH"] else None,
        }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT.open("w", encoding="utf-8") as output:
        json.dump(result, output, indent=2)

    print("\nDone.")
    print(f"Districts: {len(result)}")
    print(f"Output: {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size / 1024:.2f} KB")


if __name__ == "__main__":
    main()