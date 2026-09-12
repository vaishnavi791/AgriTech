from typing import Any, Optional
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    code: int = Field(..., description="HTTP status code")
    message: str = Field(..., description="Error message description")
    details: Optional[Any] = Field(default=None, description="Detailed validation or context information")


class ErrorResponse(BaseModel):
    success: bool = Field(default=False, description="Operation success flag")
    error: ErrorDetail


class TBDContractResponse(BaseModel):
    status: str = Field(
        default="TBD",
        description="Status flag indicating contract is temporary/TBD pending implementation",
    )
    message: str = Field(
        ...,
        description="Informational note confirming contract registration and pending status",
    )
    endpoint: str = Field(..., description="The registered API endpoint path")
