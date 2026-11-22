from pydantic import BaseModel, Field
from typing import List, Optional

class APYCandidate(BaseModel):
    """A single historical crop candidate derived from the APY dataset.

    The ranking fields follow the service implementation.
    """
    crop_name: str = Field(..., description="Crop name")
    historical_record_count: int = Field(..., description="Number of APY records for this crop")
    average_area: Optional[float] = Field(None, description="Average cultivated area (hectares)")
    average_production: Optional[float] = Field(None, description="Average production (tons)")
    average_yield: Optional[float] = Field(None, description="Average yield (kg/ha)")
    most_recent_year: str = Field(..., description="Most recent year the crop appears in the dataset")
    historical_evidence_rank: int = Field(..., description="Rank based on evidence criteria")

class APYCandidatesResponse(BaseModel):
    """Response model for the `/api/apy/candidates` endpoint.

    Includes the query parameters for clarity.
    """
    district: str = Field(..., description="District name used in the query")
    season: str = Field(..., description="Season name used in the query")
    candidates: List[APYCandidate] = Field(..., description="List of ranked crop candidates")

