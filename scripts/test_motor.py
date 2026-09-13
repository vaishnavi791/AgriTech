import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def main():
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        serverSelectionTimeoutMS=10000,
    )

    try:
        result = await client.admin.command("ping")
        print("PING RESULT:", result)
        print("DATABASE:", settings.DATABASE_NAME)
        print("MOTOR CONNECTION: SUCCESS")
    except Exception as exc:
        print("MOTOR CONNECTION: FAILED")
        print(type(exc).__name__)
        print(str(exc))
    finally:
        client.close()

asyncio.run(main())
