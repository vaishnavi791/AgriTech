"""Tests for the location-to-soil portion of crop-model input preparation."""

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.crop_soil_service import SoilModelInputError, get_soil_model_inputs
from app.services.soil_lookup import SoilGeoJsonlLookup


DATASET_PATH = os.environ.get("SLUSI_SOIL_DATASET_PATH", "")
EXAMPLE_LATITUDE = 19.57430145
EXAMPLE_LONGITUDE = 79.72462943


class CropSoilServiceUnitTest(unittest.TestCase):
    def test_coordinates_produce_validated_soil_model_components(self) -> None:
        example_record = {
            "type": "Feature",
            "properties": {
                "VILLAGE": "Bhalepalle", "MANDAL": "Kouthala",
                "DISTRICT": "Adilabad", "STATE": "Telangana", "N": 341.0,
                "P": 35.0, "K": 135.0, "pH": 7.12, "cycle": "test-cycle",
            },
            "geometry": {
                "type": "Point", "coordinates": [EXAMPLE_LONGITUDE, EXAMPLE_LATITUDE],
            },
        }
        with tempfile.TemporaryDirectory() as temporary_directory:
            source = Path(temporary_directory) / "soil.geojsonl"
            source.write_text(json.dumps(example_record) + "\n", encoding="utf-8")
            lookup = SoilGeoJsonlLookup(source).find_nearest
            inputs = get_soil_model_inputs(
                EXAMPLE_LATITUDE, EXAMPLE_LONGITUDE, soil_lookup=lookup
            )

        self.assertEqual((inputs.N, inputs.P, inputs.K, inputs.ph), (341.0, 35.0, 135.0, 7.12))
        self.assertEqual(inputs.soil_record["village"], "Bhalepalle")
        self.assertEqual(inputs.soil_record["district"], "Adilabad")
        self.assertEqual(inputs.missing_model_inputs, ("temperature", "humidity", "rainfall"))

    def test_missing_soil_value_blocks_the_model_input_boundary(self) -> None:
        with self.assertRaisesRegex(SoilModelInputError, "valid pH value"):
            get_soil_model_inputs(
                EXAMPLE_LATITUDE,
                EXAMPLE_LONGITUDE,
                soil_lookup=lambda _latitude, _longitude: {"N": 341, "P": 35, "K": 135, "pH": None},
            )


@unittest.skipUnless(
    Path(DATASET_PATH).is_file(),
    "Set SLUSI_SOIL_DATASET_PATH to run this external-dataset integration test.",
)
class CropSoilServiceIntegrationTest(unittest.TestCase):
    def test_bhalepalle_coordinates_produce_real_soil_model_components(self) -> None:
        inputs = get_soil_model_inputs(
            EXAMPLE_LATITUDE,
            EXAMPLE_LONGITUDE,
            soil_lookup=SoilGeoJsonlLookup(DATASET_PATH).find_nearest,
        )

        self.assertEqual((inputs.N, inputs.P, inputs.K, inputs.ph), (341.0, 35.0, 135.0, 7.12))
        self.assertEqual(inputs.soil_record["village"], "Bhalepalle")
        self.assertEqual(inputs.soil_record["district"], "Adilabad")
        self.assertEqual(inputs.missing_model_inputs, ("temperature", "humidity", "rainfall"))
