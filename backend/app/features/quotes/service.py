from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Quote
from app.features.quotes.schemas import QuoteCreate


async def list_quotes(db: AsyncSession) -> list[Quote]:
    result = await db.scalars(select(Quote).order_by(Quote.created_at.desc()))
    return list(result.all())


async def create_quote(db: AsyncSession, payload: QuoteCreate) -> Quote:
    quote = Quote(**payload.model_dump())
    db.add(quote)
    await db.commit()
    await db.refresh(quote)
    return quote

