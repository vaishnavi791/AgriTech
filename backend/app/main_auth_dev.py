"""Temporary Auth-Only FastAPI Development Entry Point.

=============================================================================
WARNING / NOTICE:
This is a TEMPORARY development and testing entry point created specifically
to test and verify the JWT authentication endpoints (/api/auth/register,
/api/auth/login, /api/auth/me) independently of the machine learning modules
(ml.*) that are currently experiencing import errors.

DO NOT USE AS PRODUCTION ENTRY POINT.
DO NOT IMPORT app.routes.api OR ML-DEPENDENT ROUTERS.
=============================================================================
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import (
    DatabaseUnavailableException,
    connect_to_mongo,
    close_mongo_connection,
)
from app.schemas.health import HealthResponse
from app.routes.auth import router as auth_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("agritech.auth_dev")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager preserving standard MongoDB hooks."""
    logger.info(
        "Starting up %s [AUTH-ONLY DEV MODE] (%s environment)...",
        settings.PROJECT_NAME,
        settings.ENVIRONMENT,
    )
    await connect_to_mongo()
    yield
    logger.info("Shutting down %s [AUTH-ONLY DEV MODE]...", settings.PROJECT_NAME)
    await close_mongo_connection()


app = FastAPI(
    title=f"{settings.PROJECT_NAME} (Auth Dev)",
    description=(
        "Temporary auth-only development server for testing JWT authentication "
        "independently of ML dependencies."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for React frontend (preserves existing configuration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global JSON Exception Handlers (preserves standard error envelopes)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handles standard HTTP exceptions with uniform JSON output."""
    logger.warning("HTTP %s on %s: %s", exc.status_code, request.url.path, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
            },
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handles request body/param validation errors uniformly."""
    logger.warning("Validation error on %s: %s", request.url.path, exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": status.HTTP_422_UNPROCESSABLE_ENTITY,
                "message": "Validation error",
                "details": exc.errors(),
            },
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Fallback handler for unhandled server exceptions."""
    logger.exception("Unhandled server error on %s: %s", request.url.path, str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Internal server error",
            },
        },
    )


@app.exception_handler(DatabaseUnavailableException)
async def database_unavailable_exception_handler(
    request: Request, exc: DatabaseUnavailableException
):
    """Handles database unavailability with standard 503 service unavailable response."""
    logger.error("Database unavailable on %s: %s", request.url.path, exc.message)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "success": False,
            "error": {
                "code": status.HTTP_503_SERVICE_UNAVAILABLE,
                "message": "Database service is currently unavailable. Please try again later.",
            },
        },
    )


# Root information endpoint
@app.get("/", tags=["Root"], include_in_schema=False)
async def root():
    """Root info pointer."""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} (Auth-Only Development Server)",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
        "note": "Temporary development entry point running auth routes without ML dependencies.",
    }


# Health check endpoint
@app.get(
    f"{settings.API_PREFIX}/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health check endpoint",
)
async def health_check() -> HealthResponse:
    """Returns application health status."""
    return HealthResponse(
        status="healthy",
        service=f"{settings.PROJECT_NAME} (Auth Dev)",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
    )


# Mount the existing authentication router preserving the exact /api/auth prefix
app.include_router(auth_router, prefix=settings.API_PREFIX)

