import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class BookingCreate(BaseModel):
    customer_name: str
    customer_phone: str
    vehicle_id: str
    vehicle_name: str
    preferred_date: date
    preferred_time: str = "09:00"
    notes: str | None = None


class BookingResponse(BookingCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    status: str
    created_at: datetime

