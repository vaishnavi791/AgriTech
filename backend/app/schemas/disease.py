"""Disease detection schemas."""

from typing import Optional
from pydantic import BaseModel, Field


class DiseasePredictResponse(BaseModel):
    """Schema for plant disease diagnosis response."""

    success: bool = Field(
        default=True,
        description="Indicates whether plant disease analysis succeeded",
    )
    predicted_class_index: int = Field(
        ge=0,
        le=37,
        description="Raw model argmax class index (0-37)",
    )
    prediction: Optional[str] = Field(
        default=None,
        description="Authoritative plant disease classification label corresponding to predicted_class_index",
    )
    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Genuine model softmax confidence score between 0.0 and 1.0",
    )
    message: str = Field(
        description="Diagnostic status or outcome description",
    )
