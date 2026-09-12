"""Crop recommendation schemas.

NOTE: All fields below are TEMPORARY / TBD and represent contract placeholders.
Because ml/crop/ files in the repository contain no code or model artifacts,
all input features, units, ordering, and prediction structures remain TBD.
"""
from typing import Any, Optional
from pydantic import BaseModel, Field


class CropPredictRequest(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Crop prediction input fields will be derived from ml/crop when available.",
    )
    features: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Soil, environmental, or crop feature inputs placeholder.",
    )


class CropPredictResponse(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Crop prediction response fields will be derived from ml/crop when available.",
    )
    message: str = Field(
        default="Contract registered. Model interface is TBD.",
        description="Contract status message.",
    )
    prediction: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Crop recommendation output placeholder.",
    )
