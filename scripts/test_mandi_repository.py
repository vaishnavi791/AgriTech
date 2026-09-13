import asyncio

from app.core.database import connect_to_mongo, close_mongo_connection
from app.services.mandi_repository import get_mandi_records


async def main():
    await connect_to_mongo()

    records = await get_mandi_records(
        crop="Wheat",
        state="Uttar Pradesh",
        limit=10,
    )

    print("RECORDS FOUND:", len(records))

    for record in records[:5]:
        print(record)

    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(main())