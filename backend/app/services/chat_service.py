"""Chat conversation history persistence service.

Provides reusable database operations for the 'chat_messages' collection in MongoDB Atlas.
NOTE: This module strictly handles message persistence. Gemini API calls, prompt templates,
and AI response generation will be implemented in the dedicated Chatbot prompt.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from app.core.database import get_chat_messages_collection
from app.utils.helpers import serialize_mongo_doc


async def save_chat_message(message_data: Dict[str, Any]) -> Dict[str, Any]:
    """Persists an individual chat message document in MongoDB Atlas."""
    collection = get_chat_messages_collection()
    now = datetime.now(timezone.utc)
    document = {
        "session_id": message_data["session_id"],
        "user_id": message_data.get("user_id"),
        "role": message_data["role"],
        "message": message_data["message"],
        "metadata": message_data.get("metadata"),
        "created_at": message_data.get("created_at", now),
    }
    result = await collection.insert_one(document)
    document["_id"] = result.inserted_id
    return serialize_mongo_doc(document)


async def get_session_messages(
    session_id: str,
    limit: int = 50,
) -> List[Dict[str, Any]]:
    """Retrieves conversation history messages for a session in chronological order."""
    collection = get_chat_messages_collection()
    cursor = collection.find({"session_id": session_id}).sort("created_at", 1).limit(limit)
    documents = await cursor.to_list(length=limit)
    return [serialize_mongo_doc(doc) for doc in documents]


async def get_recent_session_messages(
    session_id: str,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Return the latest session records in chronological order for recovery."""
    collection = get_chat_messages_collection()
    cursor = collection.find({"session_id": session_id}).sort("created_at", -1).limit(limit)
    documents = await cursor.to_list(length=limit)
    documents.reverse()
    return [serialize_mongo_doc(doc) for doc in documents]


async def get_latest_provider_interaction_id(session_id: str) -> Optional[str]:
    """Find the latest persisted Gemini continuation identifier for a session."""
    collection = get_chat_messages_collection()
    document = await collection.find_one(
        {
            "session_id": session_id,
            "role": "assistant",
            "metadata.provider_interaction_id": {"$type": "string", "$ne": ""},
        },
        sort=[("created_at", -1)],
    )
    if not document:
        return None
    metadata = document.get("metadata") or {}
    interaction_id = metadata.get("provider_interaction_id")
    return interaction_id if isinstance(interaction_id, str) and interaction_id else None


async def get_user_sessions(user_id: str) -> List[str]:
    """Retrieves a list of distinct session IDs associated with a user."""
    collection = get_chat_messages_collection()
    return await collection.distinct("session_id", {"user_id": user_id})

