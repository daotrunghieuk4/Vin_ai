import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import require_roles
from app.domain.models import Quote, User
from app.features.quotes.schemas import QuoteCreate, QuoteResponse, QuoteUpdateStatus
from app.features.quotes.service import create_quote, list_quotes
from app.infrastructure.database import get_db

router = APIRouter()



@router.get("", response_model=list[QuoteResponse])
async def get_quotes(db: AsyncSession = Depends(get_db)):
    return await list_quotes(db)


@router.post("", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def post_quote(payload: QuoteCreate, db: AsyncSession = Depends(get_db)):
    return await create_quote(db, payload)


@router.put("/{quote_id}", response_model=QuoteResponse)
async def update_quote_status(
    quote_id: uuid.UUID,
    payload: QuoteUpdateStatus,
    current_user: User = Depends(require_roles(["admin", "consultant"])),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Quote).where(Quote.id == quote_id))
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Không tìm thấy báo giá này!")

    quote.status = payload.status
    if payload.notes is not None:
        quote.notes = payload.notes
    if payload.discount is not None:
        quote.discount = payload.discount
    if payload.final_price is not None:
        quote.final_price = payload.final_price

    await db.commit()
    await db.refresh(quote)
    return quote


