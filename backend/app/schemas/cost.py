"""Cost estimation schemas.

NOTE: All fields below are TEMPORARY / TBD and represent contract placeholders.
Because ml/cost/ files in the repository contain no code or constant definitions,
all input parameters (acreage, seed, fertilizer, labor) and cost breakdowns remain TBD.
"""
from typing import Any, Optional
from pydantic import BaseModel, Field


class CostEstimateRequest(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Farming cost estimation input parameters will be derived from ml/cost.",
    )
    parameters: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Cost variables placeholder.",
    )


class CostEstimateResponse(BaseModel):
    status: str = Field(
        default="TBD",
        description="TEMPORARY/TBD: Cost estimation response breakdown will be derived from ml/cost.",
    )
    message: str = Field(
        default="Contract registered. Logic interface is TBD.",
        description="Contract status message.",
    )
    estimate: Optional[Any] = Field(
        default=None,
        description="TEMPORARY/TBD: Estimated farming expenditure breakdown placeholder.",
    )
