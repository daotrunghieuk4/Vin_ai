from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import TestDriveBooking
from app.features.bookings.schemas import BookingCreate


async def list_bookings(db: AsyncSession) -> list[TestDriveBooking]:
    result = await db.scalars(select(TestDriveBooking).order_by(TestDriveBooking.created_at.desc()))
    return list(result.all())


async def create_booking(db: AsyncSession, payload: BookingCreate) -> TestDriveBooking:
    booking = TestDriveBooking(**payload.model_dump())
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking

