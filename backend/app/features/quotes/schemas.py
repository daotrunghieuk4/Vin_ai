import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class QuoteCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr | None = None
    customer_phone: str
    vehicle_id: str
    vehicle_name: str
    base_price: int
    discount: int = 0
    final_price: int
    ai_summary: str | None = None


class QuoteResponse(QuoteCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    status: str
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

