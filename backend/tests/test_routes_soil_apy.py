import os
import json
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Import the FastAPI app
from app.main import app

client = TestClient(app)

# ----- Soil Model Inputs Tests -----

def test_soil_model_inputs_success():
    """POST /api/soil/model-inputs returns N, P, K, ph and raw record when dataset is present."""
    # Create a minimal GeoJSONL file with one point
    example_record = {
        "type": "Feature",
        "properties": {
            "VILLAGE": "TestVillage",
            "MANDAL": "TestMandal",
            "DISTRICT": "TestDistrict",
            "STATE": "TestState",
            "N": 100.0,
            "P": 20.0,
            "K": 30.0,
            "pH": 6.5,
            "cycle": "test-cycle",
        },
        "geometry": {"type": "Point", "coordinates": [79.0, 19.0]},
    }
    with tempfile.TemporaryDirectory() as tmp_dir:
        dataset_path = Path(tmp_dir) / "soil.geojsonl"
        dataset_path.write_text(json.dumps(example_record) + "\n", encoding="utf-8")
        # Point the env var to our temp dataset
        os.environ["SLUSI_SOIL_DATASET_PATH"] = str(dataset_path)
        payload = {"latitude": 19.0, "longitude": 79.0}
        response = client.post("/api/soil/model-inputs", json=payload)
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["N"] == 100.0
        assert data["P"] == 20.0
        assert data["K"] == 30.0
        assert data["ph"] == 6.5
        # Verify that raw record contains our village name
        assert data["soil_record"]["village"] == "TestVillage"

def test_soil_model_inputs_missing_dataset():
    """When SLUSI_SOIL_DATASET_PATH is not set, the endpoint returns 400."""
    # Ensure env var is unset
    os.environ.pop("SLUSI_SOIL_DATASET_PATH", None)
    payload = {"latitude": 0.0, "longitude": 0.0}
    response = client.post("/api/soil/model-inputs", json=payload)
    assert response.status_code == 400
    assert "SLUSI_SOIL_DATASET_PATH" in response.text

# ----- APY Candidates Tests -----

def test_apy_candidates_success():
    """GET /api/apy/candidates returns a list of candidates for valid inputs."""
    # Use known district/season that exist in the provided CSV (Uttar Pradesh dataset)
    # The dataset file is part of the repo, so no extra config needed.
    params = {"district": "Agra", "season": "Kharif"}
    response = client.get("/api/apy/candidates", params=params)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["district"] == "Agra"
    assert data["season"] == "Kharif"
    # At least one candidate should be present
    assert isinstance(data["candidates"], list)
    assert len(data["candidates"]) > 0
    candidate = data["candidates"][0]
    # Verify required fields exist
    for field in ["crop_name", "historical_record_count", "most_recent_year", "historical_evidence_rank"]:
        assert field in candidate

def test_apy_candidates_missing_params():
    """Missing query parameters should result in 422 validation error (FastAPI)."""
    response = client.get("/api/apy/candidates")
    # FastAPI returns 422 for missing required query params
    assert response.status_code == 422

