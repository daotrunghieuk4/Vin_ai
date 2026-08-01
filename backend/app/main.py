from contextlib import asynccontextmanager
import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.domain.models import Base
from app.features.auth.router import router as auth_router
from app.features.bookings.router import router as bookings_router
from app.features.cars.router import router as cars_router
from app.features.escooters.router import router as escooters_router
from app.features.quotes.router import router as quotes_router
from app.infrastructure.database import engine, get_db

settings = get_settings()

os.makedirs("static", exist_ok=True)


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

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/health")
async def health(db: AsyncSession = Depends(get_db)):
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


app.include_router(auth_router, prefix=f"{settings.api_prefix}/auth", tags=["auth"])
app.include_router(cars_router, prefix=f"{settings.api_prefix}/cars", tags=["cars"])
app.include_router(escooters_router, prefix=f"{settings.api_prefix}/escooters", tags=["escooters"])
app.include_router(quotes_router, prefix=f"{settings.api_prefix}/quotes", tags=["quotes"])
app.include_router(bookings_router, prefix=f"{settings.api_prefix}/bookings", tags=["bookings"])

