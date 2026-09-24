'''Build a KD-Tree index for the SLUSI soil GeoJSONL dataset.

The script reads the file once, records the latitude/longitude of each
record and the byte offset of the line in the original file. Those arrays are
saved to ``soil_index.npz`` placed next to the source dataset.

Usage:
    export SLUSI_SOIL_DATASET_PATH=/path/to/SLUSI_SHC.geojsonl
    python scripts/build_soil_index.py
'''

import os
import sys
from pathlib import Path
import json
import numpy as np

def main():
    dataset_path = os.getenv("SLUSI_SOIL_DATASET_PATH", "").strip()
    if not dataset_path:
        sys.stderr.write("SLUSI_SOIL_DATASET_PATH environment variable is not set.\n")
        sys.exit(1)
    dataset_file = Path(dataset_path).expanduser()
    if not dataset_file.is_file():
        sys.stderr.write(f"Dataset file not found: {dataset_file}\n")
        sys.exit(1)

    coords = []  # list of (lat, lon)
    offsets = []  # byte offsets of each line

    with dataset_file.open("rb") as f:
        while True:
            offset = f.tell()
            line_bytes = f.readline()
            if not line_bytes:
                break
            try:
                line = line_bytes.decode("utf-8", errors="replace")
                obj = json.loads(line)
                geometry = obj.get("geometry", {})
                if geometry.get("type") != "Point":
                    continue
                lon, lat = geometry.get("coordinates", [None, None])
                # Basic validation – ensure they are numbers
                if isinstance(lat, (int, float)) and isinstance(lon, (int, float)):
                    coords.append((float(lat), float(lon)))
                    offsets.append(offset)
            except Exception:
                # Skip malformed lines silently – the lookup code already does this.
                continue

    if not coords:
        sys.stderr.write("No valid Point records found in the dataset.\n")
        sys.exit(1)

    coords_array = np.array(coords, dtype=np.float32)  # shape (N, 2)
    offsets_array = np.array(offsets, dtype=np.int64)

    index_path = dataset_file.with_name("soil_index.npz")
    np.savez_compressed(index_path, coords=coords_array, offsets=offsets_array)
    print(f"Index written to {index_path} (records: {len(coords)})")

if __name__ == "__main__":
    main()

