from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.domain.models import Base
from app.features.bookings.router import router as bookings_router
from app.features.quotes.router import router as quotes_router
from app.infrastructure.database import engine, get_db

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Creates tables for local development. Use migrations in production.
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health(db: AsyncSession = Depends(get_db)):
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


app.include_router(quotes_router, prefix=f"{settings.api_prefix}/quotes", tags=["quotes"])
app.include_router(bookings_router, prefix=f"{settings.api_prefix}/bookings", tags=["bookings"])
