from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.bookings.schemas import BookingCreate, BookingResponse
from app.features.bookings.service import create_booking, list_bookings
from app.infrastructure.database import get_db

router = APIRouter()


@router.get("", response_model=list[BookingResponse])
async def get_bookings(db: AsyncSession = Depends(get_db)):
    return await list_bookings(db)


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def post_booking(payload: BookingCreate, db: AsyncSession = Depends(get_db)):
    return await create_booking(db, payload)

