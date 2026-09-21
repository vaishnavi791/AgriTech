"""Integration test for the external SLUSI GeoJSONL soil dataset."""

import os
import sys
import tempfile
import unittest
import json
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.soil_lookup import SoilGeoJsonlLookup


DATASET_PATH = os.environ.get("SLUSI_SOIL_DATASET_PATH", "")


class SoilLookupUnitTest(unittest.TestCase):
    def test_finds_bhalepalle_example_and_safely_normalizes_bad_soil_values(self) -> None:
        example_record = {
            "type": "Feature",
            "properties": {
                "VILLAGE": "Bhalepalle", "MANDAL": "Kouthala",
                "DISTRICT": "Adilabad", "STATE": "Telangana", "N": 341.0,
                "P": 35.0, "K": 135.0, "pH": 7.12, "EC": "not-a-number",
                "cycle": "test-cycle",
            },
            "geometry": {"type": "Point", "coordinates": [79.72462943, 19.57430145]},
        }
        with tempfile.TemporaryDirectory() as temporary_directory:
            source = Path(temporary_directory) / "soil.geojsonl"
            source.write_text("not json\n" + json.dumps(example_record) + "\n", encoding="utf-8")
            match = SoilGeoJsonlLookup(source).find_nearest(19.57430145, 79.72462943)

        self.assertEqual(match["village"], "Bhalepalle")
        self.assertEqual(match["district"], "Adilabad")
        self.assertEqual((match["N"], match["P"], match["K"], match["pH"]), (341.0, 35.0, 135.0, 7.12))
        self.assertEqual(match["distance_km"], 0.0)


@unittest.skipUnless(
    Path(DATASET_PATH).is_file(),
    "Set SLUSI_SOIL_DATASET_PATH to run this external-dataset integration test.",
)
class SoilLookupIntegrationTest(unittest.TestCase):
    def test_finds_bhalepalle_adilabad_example_record(self) -> None:
        match = SoilGeoJsonlLookup(DATASET_PATH).find_nearest(19.57430145, 79.72462943)

        self.assertEqual(match["village"], "Bhalepalle")
        self.assertEqual(match["district"], "Adilabad")
        self.assertEqual(match["state"], "Telangana")
        self.assertEqual(match["N"], 341.0)
        self.assertEqual(match["P"], 35.0)
        self.assertEqual(match["K"], 135.0)
        self.assertEqual(match["pH"], 7.12)
        self.assertEqual(match["distance_km"], 0.0)
