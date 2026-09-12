from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    UserMeResponse,
)
from app.schemas.common import ErrorResponse
from app.core.security import get_current_user
from app.services.auth_service import (
    DuplicateAccountError,
    InvalidCredentialsError,
    authenticate_user,
    issue_access_token,
    public_user,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    summary="Register a new user account",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_201_CREATED: {"model": RegisterResponse, "description": "User registered successfully"},
        status.HTTP_409_CONFLICT: {"model": ErrorResponse, "description": "An account with this email already exists"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
    },
)
async def register(payload: RegisterRequest):
    try:
        user = await register_user(payload.email, payload.password, payload.full_name)
    except DuplicateAccountError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists") from exc
    return RegisterResponse(user=user)


@router.post(
    "/login",
    summary="Authenticate user and issue JWT token",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": LoginResponse, "description": "Authentication successful, token returned"},
        status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Invalid email or password"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Request validation error"},
    },
)
async def login(payload: LoginRequest):
    try:
        user = await authenticate_user(payload.email, payload.password)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password") from exc
    return LoginResponse(access_token=issue_access_token(user), user=public_user(user))


@router.get(
    "/me",
    summary="Get current authenticated user profile",
    response_model=UserMeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {"model": UserMeResponse, "description": "User profile retrieved successfully"},
        status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Missing, expired, or invalid token"},
    },
)
async def get_me(current_user=Depends(get_current_user)):
    return UserMeResponse(**public_user(current_user))
