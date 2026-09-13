import asyncio

from app.core.database import (
    connect_to_mongo,
    close_mongo_connection,
    db_manager,
)


async def main():
    await connect_to_mongo()

    print("CONNECTED:", db_manager.is_connected)
    print("DATABASE:", db_manager.database)

    if db_manager.is_connected:
        collection = db_manager.database["mandi_prices"]
        print("COLLECTION:", collection.name)

    await close_mongo_connection()


asyncio.run(main())