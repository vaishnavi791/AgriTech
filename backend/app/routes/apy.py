from fastapi import APIRouter, HTTPException, status
from app.schemas.apy import APYCandidatesResponse
from app.services.apy_recommendation_service import historical_crop_candidates, APYRecommendationError

router = APIRouter(prefix="/apy", tags=["APY Recommendation"])

@router.get(
    "/candidates",
    response_model=APYCandidatesResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Invalid query parameters"},
        status.HTTP_404_NOT_FOUND: {"description": "No candidates found"},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Server error"},
    },
)
async def apy_candidates(district: str, season: str):
    """Return historical crop candidates for a district and season.

    Delegates to `historical_crop_candidates` service.
    """
    try:
        candidates = historical_crop_candidates(district, season)
        if not candidates:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No candidates found for given district/season")
        return APYCandidatesResponse(district=district, season=season, candidates=candidates)
    except APYRecommendationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))

