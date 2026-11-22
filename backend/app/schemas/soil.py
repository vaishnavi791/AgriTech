from typing import Any, Mapping

from pydantic import BaseModel, Field


class SoilModelInputRequest(BaseModel):
    """Request body for retrieving model-ready soil inputs by coordinates."""

    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")


class SoilModelInputsResponse(BaseModel):
    """Response containing model-ready soil inputs."""

    N: float
    P: float
    K: float
    ph: float
    soil_record: Mapping[str, Any]


class SoilDistrictRequest(BaseModel):
    """Request body for retrieving representative soil inputs by district."""

    state: str = Field(..., min_length=1, description="State name")
    district: str = Field(..., min_length=1, description="District name")


class SoilDistrictResponse(BaseModel):
    """Representative soil values for a Uttar Pradesh district."""

    state: str
    district: str
    record_count: int
    N: float | None
    P: float | None
    K: float | None
    ph: float | None