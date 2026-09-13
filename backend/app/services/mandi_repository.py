from __future__ import annotations

from typing import Any

from app.core.database import db_manager


async def upsert_mandi_records(records: list[dict[str, Any]]) -> int:
    if not records:
        return 0

    if not db_manager.is_connected or db_manager.database is None:
        raise RuntimeError("MongoDB is not connected")

    collection = db_manager.database["mandi_prices"]

    saved_count = 0

    for record in records:
        identity = {
            "source": record.get("source"),
            "crop": record.get("crop"),
            "state": record.get("state"),
            "district": record.get("district"),
            "market": record.get("market"),
            "date": record.get("date"),
            "variety": record.get("variety"),
        }

        result = await collection.update_one(
            identity,
            {"$set": record},
            upsert=True,
        )

        if result.upserted_id is not None or result.modified_count > 0:
            saved_count += 1

    return saved_count


async def get_mandi_records(
    *,
    crop: str | None = None,
    state: str | None = None,
    market: str | None = None,
    limit: int = 5000,
) -> list[dict[str, Any]]:

    if not db_manager.is_connected or db_manager.database is None:
        raise RuntimeError("MongoDB is not connected")

    collection = db_manager.database["mandi_prices"]

    query: dict[str, Any] = {}

    if crop:
        query["crop"] = crop

    if state:
        query["state"] = state

    if market:
        query["market"] = market

    cursor = (
        collection
        .find(query, {"_id": 0})
        .sort("date", -1)
        .limit(limit)
    )

    return await cursor.to_list(length=limit)