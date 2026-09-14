"""Disease detection API routes."""

from fastapi import APIRouter, File, UploadFile, status
from app.schemas.common import ErrorResponse
from app.schemas.disease import DiseasePredictResponse
from app.services.disease_service import disease_service

router = APIRouter(prefix="/disease", tags=["Disease Detection"])


@router.post(
    "/predict",
    summary="Detect plant disease from leaf imagery",
    description=(
        "Uploads a crop leaf image via multipart/form-data, pre-processes it to 224x224 RGB, "
        "and runs classification through the MobileNetV2 disease model."
    ),
    response_model=DiseasePredictResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {
            "model": DiseasePredictResponse,
            "description": "Disease diagnosis and classification outcome",
        },
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "Invalid file format or corrupted image",
        },
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE: {
            "model": ErrorResponse,
            "description": "Image file exceeds maximum limit of 10MB",
        },
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "model": ErrorResponse,
            "description": "Disease detection model service is currently unavailable",
        },
    },
)
async def predict_disease(
    file: UploadFile = File(
        ...,
        description="Plant leaf image file (JPEG, PNG, or WebP; maximum 10MB)",
    ),
) -> DiseasePredictResponse:
    """Handles crop leaf image upload and returns model prediction."""
    return await disease_service.predict_disease(file)
