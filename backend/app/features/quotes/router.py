from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.quotes.schemas import QuoteCreate, QuoteResponse
from app.features.quotes.service import create_quote, list_quotes
from app.infrastructure.database import get_db

router = APIRouter()


@router.get("", response_model=list[QuoteResponse])
async def get_quotes(db: AsyncSession = Depends(get_db)):
    return await list_quotes(db)


@router.post("", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def post_quote(payload: QuoteCreate, db: AsyncSession = Depends(get_db)):
    return await create_quote(db, payload)

