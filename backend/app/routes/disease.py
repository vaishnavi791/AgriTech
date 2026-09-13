from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.schemas.disease import DiseasePredictRequest, DiseasePredictResponse
from app.schemas.common import ErrorResponse, TBDContractResponse

router = APIRouter(prefix="/disease", tags=["Disease Detection"])


@router.post(
    "/predict",
    summary="Detect plant disease from leaf imagery",
    description=(
        "Contract placeholder. Because ml/disease files in the repository contain no code or "
        "model artifacts, payload transport (multipart form-data vs JSON), image dimensions, "
        "and diagnostic classes remain TBD and will be derived once real ML artifacts are delivered."
    ),
    response_model=DiseasePredictResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": DiseasePredictResponse, "description": "Disease diagnosis response (TBD)"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
        status.HTTP_501_NOT_IMPLEMENTED: {"model": TBDContractResponse, "description": "Contract registered; Model interface is TBD"},
    },
)
async def predict_disease(payload: DiseasePredictRequest):
    """Disease detection contract placeholder handler (no business logic)."""
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content=TBDContractResponse(
            status="TBD",
            message="Contract registered. Disease detection model interface is TBD.",
            endpoint="/api/disease/predict",
        ).model_dump(),
    )
