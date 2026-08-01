import json
import os
from typing import List, Optional
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_roles
from app.domain.models import EScooter, User
from app.features.escooters.schemas import EScooterCreate, EScooterResponse, EScooterUpdate
from app.infrastructure.database import get_db

router = APIRouter()

UPLOAD_DIR = os.path.join("static", "uploads", "cars")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[EScooterResponse])
async def get_escooters(category: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(EScooter)
    if category:
        query = query.where(EScooter.category.ilike(f"%{category}%"))
    result = await db.execute(query.order_by(EScooter.base_price.asc()))
    return result.scalars().all()


@router.get("/{scooter_id_or_code}", response_model=EScooterResponse)
async def get_escooter_by_id_or_code(scooter_id_or_code: str, db: AsyncSession = Depends(get_db)):
    try:
        scooter_uuid = uuid.UUID(scooter_id_or_code)
        query = select(EScooter).where(EScooter.id == scooter_uuid)
    except ValueError:
        query = select(EScooter).where(EScooter.code == scooter_id_or_code)

    result = await db.execute(query)
    scooter = result.scalar_one_or_none()
    if not scooter:
        raise HTTPException(status_code=404, detail="Không tìm thấy mẫu xe máy điện này!")
    return scooter


@router.post("/", response_model=EScooterResponse, status_code=status.HTTP_201_CREATED)
async def create_escooter(
    name: str = Form(...),
    code: str = Form(...),
    category: str = Form("scooter"),
    base_price: int = Form(...),
    battery_buy_price: Optional[int] = Form(None),
    battery_rent_monthly: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    specs_json: Optional[str] = Form("{}"),
    rag_summary: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    is_available: bool = Form(True),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(require_roles(["admin", "consultant"])),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(EScooter).where(EScooter.code == code))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Mã xe máy điện này đã tồn tại!")

    try:
        specs = json.loads(specs_json) if specs_json else {}
    except Exception:
        raise HTTPException(status_code=400, detail="Chuỗi specs_json không đúng định dạng JSON!")

    final_image_url = image_url
    if image and image.filename:
        file_ext = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        contents = await image.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        final_image_url = f"/static/uploads/cars/{filename}"

    new_scooter = EScooter(
        name=name,
        code=code,
        category=category,
        base_price=base_price,
        battery_buy_price=battery_buy_price,
        battery_rent_monthly=battery_rent_monthly,
        description=description,
        specs=specs,
        rag_summary=rag_summary,
        image_url=final_image_url,
        is_available=is_available,
    )
    db.add(new_scooter)
    await db.commit()
    await db.refresh(new_scooter)
    return new_scooter


@router.put("/{scooter_id}", response_model=EScooterResponse)
async def update_escooter(
    scooter_id: uuid.UUID,
    name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    base_price: Optional[int] = Form(None),
    battery_buy_price: Optional[int] = Form(None),
    battery_rent_monthly: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    specs_json: Optional[str] = Form(None),
    rag_summary: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    is_available: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(require_roles(["admin", "consultant"])),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(EScooter).where(EScooter.id == scooter_id))
    scooter = result.scalar_one_or_none()
    if not scooter:
        raise HTTPException(status_code=404, detail="Không tìm thấy mẫu xe máy điện!")

    if name is not None:
        scooter.name = name
    if category is not None:
        scooter.category = category
    if base_price is not None:
        scooter.base_price = base_price
    if battery_buy_price is not None:
        scooter.battery_buy_price = battery_buy_price
    if battery_rent_monthly is not None:
        scooter.battery_rent_monthly = battery_rent_monthly
    if description is not None:
        scooter.description = description
    if is_available is not None:
        scooter.is_available = is_available
    if rag_summary is not None:
        scooter.rag_summary = rag_summary

    if specs_json:
        try:
            scooter.specs = json.loads(specs_json)
        except Exception:
            raise HTTPException(status_code=400, detail="Specs JSON không đúng định dạng!")

    if image and image.filename:
        file_ext = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        contents = await image.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        scooter.image_url = f"/static/uploads/cars/{filename}"
    elif image_url is not None:
        scooter.image_url = image_url

    await db.commit()
    await db.refresh(scooter)
    return scooter


@router.delete("/{scooter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_escooter(
    scooter_id: uuid.UUID,
    current_user: User = Depends(require_roles(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(EScooter).where(EScooter.id == scooter_id))
    scooter = result.scalar_one_or_none()
    if not scooter:
        raise HTTPException(status_code=404, detail="Không tìm thấy mẫu xe máy điện!")

    await db.delete(scooter)
    await db.commit()
    return None
