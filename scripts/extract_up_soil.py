import json
from pathlib import Path

# Original 2.3 GB SLUSI dataset
SOURCE = Path(
    r"D:\Study stuff\Final year project\CROP RECOMMENDATION"
    r"\New folder\new crop recommendation\SLUSI_SHC.geojsonl"
)

# Uttar Pradesh-only output
OUTPUT = SOURCE.with_name("SLUSI_UP.geojsonl")


def main():
    if not SOURCE.is_file():
        raise SystemExit(f"Source dataset not found:\n{SOURCE}")

    count = 0
    invalid = 0

    print(f"Reading:\n{SOURCE}")
    print(f"Writing UP records to:\n{OUTPUT}")
    print("This will scan the original dataset once...\n")

    with SOURCE.open("r", encoding="utf-8", errors="replace") as src, \
         OUTPUT.open("w", encoding="utf-8") as dst:

        for line in src:
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                invalid += 1
                continue

            properties = record.get("properties", record)

            if not isinstance(properties, dict):
                invalid += 1
                continue

            state = str(
                properties.get("STATE", "")
            ).strip().casefold()

            if state == "uttar pradesh":
                dst.write(line)
                count += 1

    print("\nExtraction complete.")
    print(f"UP records: {count:,}")
    print(f"Invalid records skipped: {invalid:,}")
    print(f"Output file: {OUTPUT}")
    print(f"Output size: {OUTPUT.stat().st_size / (1024**3):.2f} GB")


if __name__ == "__main__":
    main()