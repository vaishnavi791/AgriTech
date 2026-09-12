"""User collection persistence service.

Provides reusable database operations for the 'users' collection in MongoDB Atlas.
NOTE: This module strictly handles persistence. Authentication workflows, password hashing,
and JWT generation are deferred to the dedicated Auth prompt and not implemented here.
"""
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_users_collection
from app.utils.helpers import serialize_mongo_doc


async def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Inserts a new user document into the 'users' collection.

    Expects 'password_hash' in user_data (plain passwords must NEVER be passed or stored).
    """
    collection = get_users_collection()
    now = datetime.now(timezone.utc)
    document = {
        "email": user_data["email"],
        "password_hash": user_data["password_hash"],
        "full_name": user_data.get("full_name"),
        "is_active": user_data.get("is_active", True),
        "created_at": user_data.get("created_at", now),
        "updated_at": user_data.get("updated_at", now),
    }
    result = await collection.insert_one(document)
    document["_id"] = result.inserted_id
    return serialize_mongo_doc(document)


async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Finds a user document by unique email address."""
    collection = get_users_collection()
    document = await collection.find_one({"email": email})
    return serialize_mongo_doc(document)


async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Finds a user document by its string ObjectId."""
    collection = get_users_collection()
    try:
        oid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return None
    document = await collection.find_one({"_id": oid})
    return serialize_mongo_doc(document)


async def update_user(user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Updates fields of an existing user document."""
    collection = get_users_collection()
    try:
        oid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return None

    update_payload = dict(update_data)
    update_payload["updated_at"] = datetime.now(timezone.utc)
    # Never allow updating the immutable _id
    update_payload.pop("_id", None)
    update_payload.pop("id", None)

    await collection.update_one({"_id": oid}, {"$set": update_payload})
    return await get_user_by_id(user_id)

