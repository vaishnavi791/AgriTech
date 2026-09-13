import asyncio

from ml.cost.agmarknet_client import AgmarknetClient
from ml.cost.agmarknet_ingestion import fetch_month
from ml.cost.normalizer import normalize_mandi_record

from app.services.mandi_repository import upsert_mandi_records
from app.core.database import (
    connect_to_mongo,
    close_mongo_connection,
    db_manager,
)

async def main():
    print("Connecting to MongoDB...")
    await connect_to_mongo()

    print("CONNECTED:", db_manager.is_connected)
    print("DATABASE:", db_manager.database)

    if not db_manager.is_connected:
        raise RuntimeError("MongoDB connection failed")

    print("Fetching AGMARKNET data...")
    client = AgmarknetClient()

    raw_records = fetch_month(
        client,
        year=2026,
        month=9,
        state_id=34,
        state_name="Uttar Pradesh",
        commodity_id=1,
        commodity_name="Wheat",
    )

    print(f"RAW RECORDS: {len(raw_records)}")

    normalized_records = [
        normalize_mandi_record(record)
        for record in raw_records
    ]

    print(f"NORMALIZED RECORDS: {len(normalized_records)}")

    saved = await upsert_mandi_records(normalized_records)

    print(f"UPSERTED RECORDS: {saved}")

    await close_mongo_connection()

    print("Mandi ingestion completed.")


if __name__ == "__main__":
    asyncio.run(main())