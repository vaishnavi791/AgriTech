"""Prediction history schemas."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PredictionRecord(BaseModel):
    """Schema representing a single historical prediction document."""

    id: str = Field(..., description="Unique prediction identifier")
    user_id: Optional[str] = Field(default=None, description="Associated user identifier")
    module: str = Field(..., description="Module identifier (crop, disease, cost, price)")
    inputs: Optional[Dict[str, Any]] = Field(default=None, description="Input parameters provided")
    results: Optional[Dict[str, Any]] = Field(default=None, description="Calculation or inference outputs")
    status: str = Field(default="completed", description="Execution status")
    created_at: Optional[datetime] = Field(default=None, description="UTC timestamp of creation")


class PredictionHistoryResponse(BaseModel):
    """Schema for prediction history list query."""

    success: bool = Field(default=True, description="Indicates successful retrieval")
    total: int = Field(..., description="Total records returned")
    predictions: List[PredictionRecord] = Field(
        default_factory=list,
        description="List of prediction history items",
    )

