from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.schemas.crop import CropPredictRequest, CropPredictResponse
from app.schemas.common import ErrorResponse, TBDContractResponse

router = APIRouter(prefix="/crop", tags=["Crop Recommendation"])


@router.post(
    "/predict",
    summary="Predict recommended crops based on agricultural conditions",
    description=(
        "Contract placeholder. Because ml/crop files in the repository contain no code or "
        "model artifacts, input features, preprocessing, and prediction outputs remain TBD "
        "and will be derived once real ML artifacts are delivered."
    ),
    response_model=CropPredictResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": CropPredictResponse, "description": "Crop recommendation response (TBD)"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
        status.HTTP_501_NOT_IMPLEMENTED: {"model": TBDContractResponse, "description": "Contract registered; Model interface is TBD"},
    },
)
async def predict_crop(payload: CropPredictRequest):
    """Crop recommendation contract placeholder handler (no business logic)."""
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content=TBDContractResponse(
            status="TBD",
            message="Contract registered. Crop recommendation model interface is TBD.",
            endpoint="/api/crop/predict",
        ).model_dump(),
    )
