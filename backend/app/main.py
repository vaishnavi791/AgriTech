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
from app.routes.api import api_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("agritech")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown hooks."""
    logger.info("Starting up %s (%s environment)...", settings.PROJECT_NAME, settings.ENVIRONMENT)
    await connect_to_mongo()
    yield
    logger.info("Shutting down %s...", settings.PROJECT_NAME)
    await close_mongo_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Agriculture Platform API backend",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global JSON Exception Handlers
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
async def database_unavailable_exception_handler(request: Request, exc: DatabaseUnavailableException):
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
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
    }


# Mount the top-level /api router
app.include_router(api_router, prefix=settings.API_PREFIX)

