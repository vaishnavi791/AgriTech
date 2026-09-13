"""Prediction history database document model.

NOTE: This model represents records in the 'predictions' collection.
Specific input/output schemas for Crop, Disease, Cost, and Price modules remain TBD.
Generic structures are used here so no model-specific fields are invented.
"""
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class PredictionDocument(BaseModel):
    id: Optional[str] = Field(default=None, description="Unique prediction record identifier (string ObjectId)")
    user_id: Optional[str] = Field(default=None, description="Optional associated user document identifier")
    module: str = Field(..., description="Application module: 'crop', 'disease', 'cost', or 'price'")
    inputs: Optional[Dict[str, Any]] = Field(
        default=None,
        description="TEMPORARY/TBD: Generic input payload structure pending specific module contract",
    )
    results: Optional[Dict[str, Any]] = Field(
        default=None,
        description="TEMPORARY/TBD: Generic prediction/estimation result structure pending specific module contract",
    )
    status: str = Field(default="completed", description="Prediction processing status indicator")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp when the prediction record was created in UTC",
    )
