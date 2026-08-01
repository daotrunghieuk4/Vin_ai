import json
import os
from typing import List, Optional
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_roles
from app.domain.models import Car, User
from app.features.cars.schemas import CarCreate, CarResponse, CarUpdate
from app.infrastructure.database import get_db

router = APIRouter()

UPLOAD_DIR = os.path.join("static", "uploads", "cars")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[CarResponse])
async def get_cars(category: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(Car)
    if category:
        query = query.where(Car.category.ilike(f"%{category}%"))
    result = await db.execute(query.order_by(Car.base_price.asc()))
    return result.scalars().all()


@router.get("/{car_id_or_code}", response_model=CarResponse)
async def get_car_by_id_or_code(car_id_or_code: str, db: AsyncSession = Depends(get_db)):
    try:
        car_uuid = uuid.UUID(car_id_or_code)
        query = select(Car).where(Car.id == car_uuid)
    except ValueError:
        query = select(Car).where(Car.code == car_id_or_code)

    result = await db.execute(query)
    car = result.scalar_one_or_none()
    if not car:
        raise HTTPException(status_code=404, detail="Không tìm thấy mẫu xe này!")
    return car


@router.post("/", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
async def create_car(
    name: str = Form(...),
    code: str = Form(...),
    category: str = Form(...),
    base_price: int = Form(...),
    battery_buy_price: Optional[int] = Form(None),
    battery_rent_monthly: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    specs_json: Optional[str] = Form("{}"),
    image_url: Optional[str] = Form(None),
    is_available: bool = Form(True),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(require_roles(["admin", "consultant"])),
    db: AsyncSession = Depends(get_db),
):
    # Check code duplicate
    existing = await db.execute(select(Car).where(Car.code == code))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Mã xe (code) này đã tồn tại!")

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

    new_car = Car(
        name=name,
        code=code,
        category=category,
        base_price=base_price,
        battery_buy_price=battery_buy_price,
        battery_rent_monthly=battery_rent_monthly,
        description=description,
        specs=specs,
        image_url=final_image_url,
        is_available=is_available,
    )
    db.add(new_car)
    await db.commit()
    await db.refresh(new_car)
    return new_car


@router.put("/{car_id}", response_model=CarResponse)
async def update_car(
    car_id: uuid.UUID,
    name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    base_price: Optional[int] = Form(None),
    battery_buy_price: Optional[int] = Form(None),
    battery_rent_monthly: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    specs_json: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    is_available: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(require_roles(["admin", "consultant"])),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Car).where(Car.id == car_id))
    car = result.scalar_one_or_none()
    if not car:
        raise HTTPException(status_code=404, detail="Không tìm thấy mẫu xe!")

    if name is not None:
        car.name = name
    if category is not None:
        car.category = category
    if base_price is not None:
        car.base_price = base_price
    if battery_buy_price is not None:
        car.battery_buy_price = battery_buy_price
    if battery_rent_monthly is not None:
        car.battery_rent_monthly = battery_rent_monthly
    if description is not None:
        car.description = description
    if is_available is not None:
        car.is_available = is_available
    if specs_json:
        try:
            car.specs = json.loads(specs_json)
        except Exception:
            pass

    if image and image.filename:
        file_ext = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        contents = await image.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        car.image_url = f"/static/uploads/cars/{filename}"
    elif image_url is not None:
        car.image_url = image_url

    await db.commit()
    await db.refresh(car)
    return car


@router.delete("/{car_id}", status_code=status.HTTP_200_OK)
async def delete_car(
    car_id: uuid.UUID,
    current_user: User = Depends(require_roles(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Car).where(Car.id == car_id))
    car = result.scalar_one_or_none()
    if not car:
        raise HTTPException(status_code=404, detail="Không tìm thấy mẫu xe!")

    await db.delete(car)
    await db.commit()
    return {"message": f"Đã xóa thành công mẫu xe {car.name}"}
