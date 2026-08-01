import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import require_roles
from app.domain.models import TestDriveBooking, User
from app.features.bookings.schemas import BookingCreate, BookingResponse, BookingUpdateStatus
from app.features.bookings.service import create_booking, list_bookings
from app.infrastructure.database import get_db

router = APIRouter()



@router.get("", response_model=list[BookingResponse])
async def get_bookings(db: AsyncSession = Depends(get_db)):
    return await list_bookings(db)


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def post_booking(payload: BookingCreate, db: AsyncSession = Depends(get_db)):
    return await create_booking(db, payload)


@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking_status(
    booking_id: uuid.UUID,
    payload: BookingUpdateStatus,
    current_user: User = Depends(require_roles(["admin", "consultant"])),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(TestDriveBooking).where(TestDriveBooking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch hẹn lái thử này!")

    booking.status = payload.status
    if payload.notes is not None:
        booking.notes = payload.notes

    await db.commit()
    await db.refresh(booking)
    return booking


