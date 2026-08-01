from datetime import datetime
from typing import Any, Dict, Optional
import uuid

from pydantic import BaseModel, Field


class EScooterBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=50)
    category: str = Field(default="scooter", min_length=2, max_length=50)
    base_price: int = Field(..., ge=0)
    battery_buy_price: Optional[int] = None
    battery_rent_monthly: Optional[int] = None
    description: Optional[str] = None
    specs: Dict[str, Any] = Field(default_factory=dict)
    rag_summary: Optional[str] = None
    is_available: bool = True


class EScooterCreate(EScooterBase):
    pass


class EScooterUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    base_price: Optional[int] = None
    battery_buy_price: Optional[int] = None
    battery_rent_monthly: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None
    rag_summary: Optional[str] = None
    is_available: Optional[bool] = None


class EScooterResponse(EScooterBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
