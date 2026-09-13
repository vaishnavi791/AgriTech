"""Crop recommendation inference service."""

from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from app.schemas.crop import CropPredictRequest, CropPredictResponse


MODEL_PATH = (
	Path(__file__).resolve().parents[3]
	/ "ml"
	/ "crop"
	/ "crop_recommendation_model.pkl"
)
FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


class CropModelError(Exception):
	"""Raised when the crop model cannot be loaded or executed."""


@lru_cache(maxsize=1)
def get_crop_model() -> Any:
	if not MODEL_PATH.is_file():
		raise CropModelError("Crop recommendation model is unavailable")

	try:
		model = joblib.load(MODEL_PATH)
	except Exception as exc:
		raise CropModelError("Crop recommendation model could not be loaded") from exc

	if not callable(getattr(model, "predict", None)) or not callable(
		getattr(model, "predict_proba", None)
	):
		raise CropModelError("Crop recommendation model has an unsupported interface")

	model_features = getattr(model, "feature_names_in_", None)
	if model_features is not None and list(model_features) != FEATURE_NAMES:
		raise CropModelError("Crop recommendation model feature order is incompatible")
	if getattr(model, "n_features_in_", len(FEATURE_NAMES)) != len(FEATURE_NAMES):
		raise CropModelError("Crop recommendation model feature count is incompatible")

	return model


def predict_crop(payload: CropPredictRequest) -> CropPredictResponse:
	features = pd.DataFrame(
		[[
			payload.N,
			payload.P,
			payload.K,
			payload.temperature,
			payload.humidity,
			payload.ph,
			payload.rainfall,
		]],
		columns=FEATURE_NAMES,
	)

	try:
		model = get_crop_model()
		prediction = model.predict(features)[0]
		probabilities = model.predict_proba(features)[0]
		confidence = float(max(probabilities))
	except CropModelError:
		raise
	except Exception as exc:
		raise CropModelError("Crop recommendation inference failed") from exc

	return CropPredictResponse(prediction=str(prediction), confidence=confidence)

