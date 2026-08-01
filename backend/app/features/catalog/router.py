from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.infrastructure.database import get_db

router = APIRouter()
settings = get_settings()


@router.get("/cars", response_model=list[dict[str, Any]])
async def get_cars(db: AsyncSession = Depends(get_db)):
    query = text(f"SELECT * FROM {settings.catalog_schema}.car_catalog ORDER BY model_name")
    result = await db.execute(query)
    return [dict(row) for row in result.mappings().all()]


@router.get("/motorbikes", response_model=list[dict[str, Any]])
async def get_motorbikes(db: AsyncSession = Depends(get_db)):
    query = text(f"SELECT * FROM {settings.catalog_schema}.motorbike_catalog ORDER BY model_name")
    result = await db.execute(query)
    return [dict(row) for row in result.mappings().all()]

