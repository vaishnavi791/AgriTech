"""Prediction history persistence service.

Provides reusable database operations for the 'predictions' collection in MongoDB Atlas.
NOTE: This module strictly handles data persistence. ML model inference, cost calculation,
and price forecasting logic will be integrated in subsequent prompts.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_predictions_collection
from app.utils.helpers import serialize_mongo_doc


async def save_prediction(prediction_data: Dict[str, Any]) -> Dict[str, Any]:
    """Persists a prediction/estimation history document in MongoDB Atlas."""
    collection = get_predictions_collection()
    now = datetime.now(timezone.utc)
    document = {
        "user_id": prediction_data.get("user_id"),
        "module": prediction_data["module"],
        "inputs": prediction_data.get("inputs"),
        "results": prediction_data.get("results"),
        "status": prediction_data.get("status", "completed"),
        "created_at": prediction_data.get("created_at", now),
    }
    result = await collection.insert_one(document)
    document["_id"] = result.inserted_id
    return serialize_mongo_doc(document)


async def get_prediction_by_id(prediction_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a single prediction history record by ID."""
    collection = get_predictions_collection()
    try:
        oid = ObjectId(prediction_id)
    except (InvalidId, TypeError):
        return None
    document = await collection.find_one({"_id": oid})
    return serialize_mongo_doc(document)


async def get_user_predictions(
    user_id: str,
    module: Optional[str] = None,
    limit: int = 50,
) -> List[Dict[str, Any]]:
    """Retrieves prediction history records for a given user, optionally filtered by module."""
    collection = get_predictions_collection()
    query: Dict[str, Any] = {"user_id": user_id}
    if module:
        query["module"] = module

    cursor = collection.find(query).sort("created_at", -1).limit(limit)
    documents = await cursor.to_list(length=limit)
    return [serialize_mongo_doc(doc) for doc in documents]

