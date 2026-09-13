"""MongoDB persistence for official AGMARKNET mandi price data."""

from __future__ import annotations

from typing import Any

from app.core.database import get_mandi_prices_collection


async def save_mandi_records(records: list[dict[str, Any]]) -> int:
    """
    Insert official AGMARKNET records into the mandi_prices collection.

    Records are deduplicated using their source/date/market/commodity/variety
    identity so repeated ingestion does not create duplicate rows.
    """
    if not records:
        return 0

    collection = get_mandi_prices_collection()

    operations = []

    for record in records:
        identity = {
            "source": record.get("source"),
            "state_id": record.get("state_id"),
            "commodity_id": record.get("commodity_id"),
            "market_name": record.get("market_name"),
            "arrival_date": record.get("arrival_date"),
            "variety": record.get("variety"),
            "grade": record.get("grade"),
        }

        operations.append(
            {
                "filter": identity,
                "record": record,
            }
        )

    saved = 0

    for operation in operations:
        result = await collection.update_one(
            operation["filter"],
            {"$set": operation["record"]},
            upsert=True,
        )

        if result.upserted_id is not None:
            saved += 1
        elif result.modified_count > 0:
            saved += 1

    return saved

