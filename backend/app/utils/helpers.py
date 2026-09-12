"""Utility helpers for common operations."""
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from bson import ObjectId


def get_current_utc_time() -> str:
    """Returns current UTC timestamp in ISO 8601 format."""
    return datetime.now(timezone.utc).isoformat()


def serialize_mongo_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Converts a MongoDB document dictionary into a JSON-serializable format.
    Replaces BSON ObjectId '_id' with string 'id'.
    """
    if doc is None:
        return None
    serialized = dict(doc)
    if "_id" in serialized:
        serialized["id"] = str(serialized.pop("_id"))
    return serialized
