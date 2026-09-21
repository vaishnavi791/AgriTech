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
    crop: str | list[str] | None = None,
    state: str | None = None,
    market: str | None = None,
    limit: int = 5000,
) -> list[dict[str, Any]]:

    if not db_manager.is_connected or db_manager.database is None:
        raise RuntimeError("MongoDB is not connected")

    collection = db_manager.database["mandi_prices"]

    query: dict[str, Any] = {}

    if crop:
        query["crop"] = {"$in": crop} if isinstance(crop, list) else crop

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


async def get_available_mandi_commodities(
    *,
    state: str | None = None,
) -> list[dict[str, Any]]:
    """Return commodities with at least one usable modal mandi price."""
    if not db_manager.is_connected or db_manager.database is None:
        raise RuntimeError("MongoDB is not connected")

    match: dict[str, Any] = {
        "modal_price_inr_per_kg": {"$gt": 0},
        "crop": {"$nin": [None, ""]},
    }
    if state:
        match["state"] = state

    pipeline = [
        {"$match": match},
        {
            "$group": {
                "_id": "$crop",
                "record_count": {"$sum": 1},
                "state_count": {"$addToSet": "$state"},
                "market_count": {"$addToSet": "$market"},
                "latest_date": {"$max": "$date"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "commodity": "$_id",
                "record_count": 1,
                "state_count": {
                    "$size": {
                        "$filter": {
                            "input": "$state_count",
                            "as": "state",
                            "cond": {"$ne": ["$$state", None]},
                        }
                    }
                },
                "market_count": {
                    "$size": {
                        "$filter": {
                            "input": "$market_count",
                            "as": "market",
                            "cond": {"$ne": ["$$market", None]},
                        }
                    }
                },
                "latest_date": 1,
            }
        },
        {"$sort": {"commodity": 1}},
    ]
    return await db_manager.database["mandi_prices"].aggregate(pipeline).to_list(None)


async def get_available_mandi_states(
    *,
    crop: str | list[str] | None = None,
) -> list[dict[str, Any]]:
    """Return states represented by usable modal mandi records."""
    if not db_manager.is_connected or db_manager.database is None:
        raise RuntimeError("MongoDB is not connected")

    match: dict[str, Any] = {
        "modal_price_inr_per_kg": {"$gt": 0},
        "state": {"$nin": [None, ""]},
    }
    if crop:
        match["crop"] = {"$in": crop} if isinstance(crop, list) else crop

    pipeline = [
        {"$match": match},
        {
            "$group": {
                "_id": "$state",
                "record_count": {"$sum": 1},
                "commodity_count": {"$addToSet": "$crop"},
                "latest_date": {"$max": "$date"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "state": "$_id",
                "record_count": 1,
                "commodity_count": {"$size": "$commodity_count"},
                "latest_date": 1,
            }
        },
        {"$sort": {"state": 1}},
    ]
    return await db_manager.database["mandi_prices"].aggregate(pipeline).to_list(None)


async def get_available_mandi_markets(
    *,
    crop: str | list[str] | None = None,
    state: str | None = None,
) -> list[dict[str, Any]]:
    """Return markets represented by usable modal mandi records."""
    if not db_manager.is_connected or db_manager.database is None:
        raise RuntimeError("MongoDB is not connected")

    match: dict[str, Any] = {
        "modal_price_inr_per_kg": {"$gt": 0},
        "market": {"$nin": [None, ""]},
    }
    if crop:
        match["crop"] = {"$in": crop} if isinstance(crop, list) else crop
    if state:
        match["state"] = state

    pipeline = [
        {"$match": match},
        {
            "$group": {
                "_id": "$market",
                "record_count": {"$sum": 1},
                "latest_date": {"$max": "$date"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "market": "$_id",
                "record_count": 1,
                "latest_date": 1,
            }
        },
        {"$sort": {"market": 1}},
    ]
    return await db_manager.database["mandi_prices"].aggregate(pipeline).to_list(None)