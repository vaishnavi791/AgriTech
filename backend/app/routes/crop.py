from fastapi import APIRouter, status
from fastapi import HTTPException

from app.schemas.crop import CropPredictRequest, CropPredictResponse
from app.schemas.common import ErrorResponse
from app.services.crop_service import CropModelError, predict_crop as predict_crop_service

router = APIRouter(prefix="/crop", tags=["Crop Recommendation"])


@router.post(
    "/predict",
    summary="Predict recommended crops based on agricultural conditions",
    description="Predict a crop from the seven features expected by the trained RandomForest model.",
    response_model=CropPredictResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": CropPredictResponse, "description": "Crop recommendation response"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse, "description": "Model loading or inference error"},
    },
)
async def predict_crop(payload: CropPredictRequest):
    try:
        return predict_crop_service(payload)
    except CropModelError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
