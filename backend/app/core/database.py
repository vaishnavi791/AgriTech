import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger(__name__)


class DatabaseUnavailableException(Exception):
    """Exception raised when database operations are attempted while MongoDB is unreachable."""

    def __init__(self, message: str = "Database service is currently unavailable."):
        self.message = message
        super().__init__(self.message)


class MongoDBManager:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False


db_manager = MongoDBManager()


async def connect_to_mongo() -> None:
    """Initialize MongoDB Atlas client connection with connectivity verification.

    If MongoDB is unavailable or misconfigured, logs a clear warning and allows
    FastAPI startup to complete in degraded mode without crashing.
    """
    if not settings.MONGODB_URL:
        logger.info(
            "MONGODB_URL is not configured. Running in local mode without active database."
        )
        db_manager.is_connected = False
        return

    try:
        logger.info("Connecting to MongoDB Atlas at %s...", settings.DATABASE_NAME)
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=2000,
        )
        # Verify server connectivity via ping
        await client.admin.command("ping")
        db_manager.client = client
        db_manager.database = client[settings.DATABASE_NAME]
        db_manager.is_connected = True
        logger.info("Successfully connected to MongoDB Atlas database: %s", settings.DATABASE_NAME)
    except Exception as exc:
        logger.warning(
            "Could not connect to MongoDB Atlas (%s). Application running in degraded mode without active database.",
            exc,
        )
        if db_manager.client:
            db_manager.client.close()
        db_manager.client = None
        db_manager.database = None
        db_manager.is_connected = False


async def close_mongo_connection() -> None:
    """Close MongoDB connection gracefully on application shutdown."""
    if db_manager.client:
        logger.info("Closing MongoDB Atlas connection...")
        db_manager.client.close()
        db_manager.client = None
        db_manager.database = None
        db_manager.is_connected = False
        logger.info("MongoDB connection closed.")


async def ping_database() -> bool:
    """Check database health status via ping."""
    if not db_manager.client or not db_manager.is_connected:
        return False
    try:
        await db_manager.client.admin.command("ping")
        return True
    except Exception:
        return False


def get_database() -> AsyncIOMotorDatabase:
    """Retrieve active database instance.

    Raises:
        DatabaseUnavailableException: If MongoDB connection is unavailable.
    """
    if not db_manager.is_connected or db_manager.database is None:
        raise DatabaseUnavailableException(
            "Database service is currently unavailable. Please check MongoDB Atlas connectivity."
        )
    return db_manager.database


def get_users_collection() -> AsyncIOMotorCollection:
    """Retrieve the 'users' MongoDB collection."""
    return get_database()["users"]


def get_predictions_collection() -> AsyncIOMotorCollection:
    """Retrieve the 'predictions' MongoDB collection."""
    return get_database()["predictions"]


def get_chat_messages_collection() -> AsyncIOMotorCollection:
    """Retrieve the 'chat_messages' MongoDB collection."""
    return get_database()["chat_messages"]

def get_mandi_prices_collection() -> AsyncIOMotorCollection:
    """Retrieve the 'mandi_prices' MongoDB collection."""
    return get_database()["mandi_prices"]
