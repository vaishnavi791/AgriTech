from fastapi import APIRouter, HTTPException, status

from app.schemas.soil import (
    SoilModelInputRequest,
    SoilModelInputsResponse,
    SoilDistrictRequest,
    SoilDistrictResponse,
)

from app.services.crop_soil_service import (
    get_soil_model_inputs,
    SoilModelInputError,
)

from app.services.soil_lookup import (
    SoilLookupError,
    lookup_soil_by_district,
)


router = APIRouter(prefix="/soil", tags=["Soil Service"])


@router.post(
    "/model-inputs",
    response_model=SoilModelInputsResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Invalid request or missing soil data"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Server error while processing soil data"
        },
    },
)
async def soil_model_inputs(request: SoilModelInputRequest):
    """Return the four model-ready soil fields (N, P, K, ph)."""

    try:
        inputs = get_soil_model_inputs(
            request.latitude,
            request.longitude,
        )

        return SoilModelInputsResponse(
            N=inputs.N,
            P=inputs.P,
            K=inputs.K,
            ph=inputs.ph,
            soil_record=inputs.soil_record,
        )

    except (SoilLookupError, SoilModelInputError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.post(
    "/model-inputs-by-district",
    response_model=SoilDistrictResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Invalid state, district, or missing soil data"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Server error while processing soil data"
        },
    },
)
async def soil_model_inputs_by_district(
    request: SoilDistrictRequest,
):
    """Return representative soil inputs for a state/district."""

    try:
        soil_data = lookup_soil_by_district(
            request.state,
            request.district,
        )

        return SoilDistrictResponse(**soil_data)

    except SoilLookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )