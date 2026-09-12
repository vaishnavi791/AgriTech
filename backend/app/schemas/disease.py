"""Disease detection schemas.

NOTE: All fields below are TEMPORARY / TBD and represent contract placeholders.
Because ml/disease/ files in the repository contain no code or model artifacts,
image upload format, multipart requirements, and diagnostic classes remain TBD.
"""
from typing import Any, Optional
from pydantic import BaseModel, Field


class DiseasePredictRequest(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Image format (multipart/file/JSON) and parameters will be derived from ml/disease.",
    )
    image_data: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Plant leaf image payload placeholder.",
    )


class DiseasePredictResponse(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Disease detection response fields will be derived from ml/disease when available.",
    )
    message: str = Field(
        default="Contract registered. Model interface is TBD.",
        description="Contract status message.",
    )
    diagnosis: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Disease diagnosis output placeholder.",
    )
