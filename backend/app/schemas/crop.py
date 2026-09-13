"""Crop recommendation request and response schemas."""

from pydantic import BaseModel, Field


class CropPredictRequest(BaseModel):
    N: float = Field(..., allow_inf_nan=False)
    P: float = Field(..., allow_inf_nan=False)
    K: float = Field(..., allow_inf_nan=False)
    temperature: float = Field(..., allow_inf_nan=False)
    humidity: float = Field(..., allow_inf_nan=False)
    ph: float = Field(..., allow_inf_nan=False)
    rainfall: float = Field(..., allow_inf_nan=False)


class CropPredictResponse(BaseModel):
    prediction: str
    confidence: float = Field(..., ge=0.0, le=1.0)
