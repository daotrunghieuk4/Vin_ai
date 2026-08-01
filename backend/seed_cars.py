import asyncio
import os
import sys

from sqlalchemy import select, delete, text

from app.domain.models import Base, Car, EScooter, User
from app.infrastructure.database import SessionLocal, engine
from app.core.security import hash_password


# =========================================================================
# EXACT MAP OF VEHICLE CODE -> STATIC UPLOAD IMAGE PATH
# =========================================================================
CAR_IMAGE_MAP = {
    "vf3": "/static/uploads/cars/VF3_Eco.jpg",
    "vf5-plus": "/static/uploads/cars/VF5.jpg",
    "vf6-eco": "/static/uploads/cars/VF6_Eco.jpg",
    "vf6-plus": "/static/uploads/cars/VF6_Plus.jpg",
    "vf7-eco": "/static/uploads/cars/VF7_Eco.jpg",
    "vf7-plus": "/static/uploads/cars/VF7_Plus_thuong.jpg",
    "vf7-plus-glassroof": "/static/uploads/cars/VF7_Plus_trankinh.jpg",
    "vf8-eco": "/static/uploads/cars/VF8_Eco.jpg",
    "vf8-plus": "/static/uploads/cars/VF8_Plus.jpg",
    "vf9-eco": "/static/uploads/cars/VF9_Eco.jpg",
    "vf9-plus": "/static/uploads/cars/VF9_Plus.jpg",
    "minio-green": "/static/uploads/cars/Minio_green.jpg",
    "herio-green": "/static/uploads/cars/Herio_green.jpg",
    "nerio-green": "/static/uploads/cars/Nerio_green.jpg",
    "limo-green": "/static/uploads/cars/Limo_green.jpg",
    "ec-van": "/static/uploads/cars/EC_Van.jpg",
}

ESCOOTER_IMAGE_MAP = {
    "motio": "/static/uploads/escooters/Kyo.jpg",
    "amio-s2": "/static/uploads/escooters/Amio_S2.jpg",
    "flazz": "/static/uploads/escooters/Flazz.jpg",
    "flazz-max": "/static/uploads/escooters/Flazz_max.jpg",
    "evo-lite": "/static/uploads/escooters/Evo_lite.jpg",
    "evo-lite-neo": "/static/uploads/escooters/Evo_lite_neo.jpg",
    "evo-neo": "/static/uploads/escooters/Evo.jpg",
    "zgoo": "/static/uploads/escooters/ZGoo.jpg",
    "feliz-neo": "/static/uploads/escooters/Feliz_2025.jpg",
    "klara-neo": "/static/uploads/escooters/Feliz_II.jpg",
    "klara-s2": "/static/uploads/escooters/Kinet.jpg",
    "vento-neo": "/static/uploads/escooters/Vero_X.jpg",
    "vento-s": "/static/uploads/escooters/Evo_Grand.jpg",
    "theon-s": "/static/uploads/escooters/VF_DrgnFly_eBike.jpg",
    "viper": "/static/uploads/escooters/Viper.jpg",
}


# ==========================================
# 1. Ô TÔ ĐIỆN VINFAST & XE DỊCH VỤ GREEN (16 mẫu)
# ==========================================
PASSENGER_CARS = [
    {
        "name": "VinFast VF 3",
        "code": "vf3",
        "category": "SUV",
        "base_price": 240000000,
        "battery_buy_price": 322000000,
        "battery_rent_monthly": 900000,
        "description": "Mẫu Mini SUV điện thông minh, thiết kế vuông vức cá tính, tối ưu cho đô thị.",
        "rag_summary": "VF 3 Mini SUV đô thị | Giá thuê pin: 240 triệu | Mua pin: 322 triệu | Thuê pin hàng tháng: 900k | Tầm xa: 210km | Động cơ RWD 43hp | 4 chỗ | Sạc 10-70%: 36 phút | Mâm: 16 inch | Màn hình: 10 inch",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ / Hộp số",
                "items": {
                    "engine_type": "Mô tơ điện đơn (RWD)",
                    "power_hp": "43 hp",
                    "torque_nm": "110 Nm",
                    "drivetrain": "RWD (Cầu sau)",
                    "range_km": 210,
                    "fast_charge_time": "36 phút (10-70%)",
                },
            },
            "dimensions_weight": {
                "title": "Kích thước / Trọng lượng",
                "items": {
                    "seats": 4,
                    "dimensions_mm": "3.190 x 1.679 x 1.622",
                    "ground_clearance_mm": 191,
                    "wheels_rims": "16 inch",
                },
            },
        },
    },
    {
        "name": "VinFast VF 5 Plus",
        "code": "vf5-plus",
        "category": "SUV",
        "base_price": 468000000,
        "battery_buy_price": 548000000,
        "battery_rent_monthly": 1600000,
        "description": "Mẫu SUV hạng A linh hoạt, thiết kế hiện đại năng động.",
        "rag_summary": "VF 5 Plus SUV hạng A | Giá thuê pin: 468 triệu | Mua pin: 548 triệu | Thuê pin hàng tháng: 1.6 triệu | Dung lượng pin: 37.23kWh | Tầm xa: 326km | Công suất: 134hp (FWD) | 5 chỗ | Túi khí: 6",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ / Hộp số",
                "items": {
                    "engine_type": "Mô tơ điện đơn",
                    "power_hp": "134 hp",
                    "torque_nm": "135 Nm",
                    "drivetrain": "FWD (Cầu trước)",
                    "battery_capacity_kwh": 37.23,
                    "range_km": 326,
                    "fast_charge_time": "30 phút (10-70%)",
                },
            },
        },
    },
    {
        "name": "VinFast VF 6 Eco",
        "code": "vf6-eco",
        "category": "SUV",
        "base_price": 675000000,
        "battery_buy_price": 765000000,
        "battery_rent_monthly": 1800000,
        "description": "Mẫu SUV cỡ B điện sang trọng, phong cách Torino Design Ý.",
        "rag_summary": "VF 6 Eco SUV hạng B | Giá thuê pin: 675 triệu | Mua pin: 765 triệu | Thuê pin: 1.8 triệu | Tầm xa: 399km | Công suất: 174hp (FWD) | 5 chỗ | Mâm: 17 inch",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ / Hộp số",
                "items": {
                    "engine_type": "Mô tơ điện đơn",
                    "power_hp": "174 hp",
                    "torque_nm": "250 Nm",
                    "drivetrain": "FWD (Cầu trước)",
                    "range_km": 399,
                },
            },
        },
    },
    {
        "name": "VinFast VF 6 Plus",
        "code": "vf6-plus",
        "category": "SUV",
        "base_price": 765000000,
        "battery_buy_price": 855000000,
        "battery_rent_monthly": 1800000,
        "description": "Phiên bản cao cấp VF 6 Plus công suất vượt trội 201 hp và trợ lái ADAS cấp độ 2.",
        "rag_summary": "VF 6 Plus SUV hạng B | Giá thuê pin: 765 triệu | Mua pin: 855 triệu | Thuê pin: 1.8 triệu | Tầm xa: 381km | Công suất: 201hp (FWD) | ADAS Level 2 | Mâm: 19 inch",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ / Hộp số",
                "items": {
                    "engine_type": "Mô tơ điện đơn cao cấp",
                    "power_hp": "201 hp",
                    "torque_nm": "310 Nm",
                    "range_km": 381,
                },
            },
        },
    },
    {
        "name": "VinFast VF 7 Eco",
        "code": "vf7-eco",
        "category": "SUV",
        "base_price": 850000000,
        "battery_buy_price": 999000000,
        "battery_rent_monthly": 2000000,
        "description": "Mẫu SUV điện cỡ C phong cách phi thuyền cá tính.",
        "rag_summary": "VF 7 Eco SUV hạng C | Giá thuê pin: 850 triệu | Mua pin: 999 triệu | Thuê pin: 2.0 triệu | Tầm xa: 450km | Công suất: 201hp | 5 chỗ",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ",
                "items": { "power_hp": "201 hp", "range_km": 450 },
            },
        },
    },
    {
        "name": "VinFast VF 7 Plus",
        "code": "vf7-plus",
        "category": "SUV",
        "base_price": 999000000,
        "battery_buy_price": 1199000000,
        "battery_rent_monthly": 2000000,
        "description": "Bản 2 cầu AWD mạnh mẽ 349 mã lực tăng tốc 0-100km/h chỉ 5.8s.",
        "rag_summary": "VF 7 Plus SUV hạng C 2 cầu | Giá thuê pin: 999 triệu | Mua pin: 1.199 tỷ | Tầm xa: 431km | Công suất: 349hp (AWD) | Tăng tốc 0-100km/h: 5.8s | Mâm: 20 inch",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ",
                "items": { "power_hp": "349 hp", "drivetrain": "AWD", "range_km": 431 },
            },
        },
    },
    {
        "name": "VinFast VF 7 Plus Trần kính",
        "code": "vf7-plus-glassroof",
        "category": "SUV",
        "base_price": 1024000000,
        "battery_buy_price": 1224000000,
        "battery_rent_monthly": 2000000,
        "description": "Phiên bản cao cấp trang bị cửa sổ trời toàn cảnh Glass Roof sang trọng.",
        "rag_summary": "VF 7 Plus Trần kính | Giá thuê pin: 1.024 tỷ | Mua pin: 1.224 tỷ | Cửa sổ trời toàn cảnh Glass Roof | 349hp (AWD) | Tầm xa: 431km",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ",
                "items": { "power_hp": "349 hp", "drivetrain": "AWD", "range_km": 431 },
            },
        },
    },
    {
        "name": "VinFast VF 8 Eco",
        "code": "vf8-eco",
        "category": "SUV",
        "base_price": 1090000000,
        "battery_buy_price": 1290000000,
        "battery_rent_monthly": 2900000,
        "description": "SUV điện cỡ D đẳng cấp toàn cầu, rộng rãi và an toàn vượt trội.",
        "rag_summary": "VF 8 Eco SUV hạng D | Giá thuê pin: 1.090 tỷ | Mua pin: 1.290 tỷ | Dung lượng pin: 87.7kWh | Tầm xa: 471km | Công suất: 349hp (AWD)",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ",
                "items": { "power_hp": "349 hp", "drivetrain": "AWD", "range_km": 471 },
            },
        },
    },
    {
        "name": "VinFast VF 8 Plus",
        "code": "vf8-plus",
        "category": "SUV",
        "base_price": 1270000000,
        "battery_buy_price": 1470000000,
        "battery_rent_monthly": 2900000,
        "description": "Bản Plus trang bị động cơ kép 402 mã lực, ghế da thật tích hợp thông gió sưởi ấm.",
        "rag_summary": "VF 8 Plus SUV hạng D | Giá thuê pin: 1.270 tỷ | Mua pin: 1.470 tỷ | Công suất: 402hp (AWD) | Tầm xa: 447km | Ghế da thật sưởi thông gió",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ",
                "items": { "power_hp": "402 hp", "drivetrain": "AWD", "range_km": 447 },
            },
        },
    },
    {
        "name": "VinFast VF 9 Eco",
        "code": "vf9-eco",
        "category": "SUV",
        "base_price": 1589000000,
        "battery_buy_price": 1989000000,
        "battery_rent_monthly": 3100000,
        "description": "Full-size SUV điện 7 chỗ cỡ lớn hạng E sang trọng quyền uy.",
        "rag_summary": "VF 9 Eco Full-size SUV hạng E | Giá thuê pin: 1.589 tỷ | Mua pin: 1.989 tỷ | 7 chỗ | Pin: 123kWh | Tầm xa: 626km | Công suất: 402hp (AWD)",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ",
                "items": { "power_hp": "402 hp", "range_km": 626, "seats": 7 },
            },
        },
    },
    {
        "name": "VinFast VF 9 Plus",
        "code": "vf9-plus",
        "category": "SUV",
        "base_price": 1789000000,
        "battery_buy_price": 2189000000,
        "battery_rent_monthly": 3100000,
        "description": "Đỉnh cao SUV chủ tịch với tùy chọn 6 chỗ hàng ghế thương gia Captain Seat.",
        "rag_summary": "VF 9 Plus SUV hạng E Chủ tịch | Giá thuê pin: 1.789 tỷ | Mua pin: 2.189 tỷ | Tùy chọn 6 chỗ ghế Thương gia | Tầm xa: 602km | 402hp AWD",
        "specs": {
            "engine_drivetrain": {
                "title": "Động cơ",
                "items": { "power_hp": "402 hp", "range_km": 602 },
            },
        },
    },
    # XE DỊCH VỤ GREEN SERIES
    {
        "name": "Minio Green",
        "code": "minio-green",
        "category": "Commercial",
        "base_price": 230000000,
        "battery_rent_monthly": 800000,
        "description": "Xe điện dịch vụ đô thị cỡ nhỏ dành cho di chuyển ngắn linh hoạt.",
        "rag_summary": "Minio Green Mini EV Dịch vụ | Giá: 230 triệu | Tầm xa: 200km | Tối ưu chạy taxi đô thị",
        "specs": { "engine_drivetrain": { "items": { "range_km": 200 } } },
    },
    {
        "name": "Herio Green",
        "code": "herio-green",
        "category": "Commercial",
        "base_price": 450000000,
        "battery_rent_monthly": 1500000,
        "description": "SUV điện cỡ A dịch vụ taxi công nghệ năng động, bền bỉ.",
        "rag_summary": "Herio Green SUV cỡ A Dịch vụ | Giá: 450 triệu | 5 chỗ | Tầm xa: 326km",
        "specs": { "engine_drivetrain": { "items": { "range_km": 326 } } },
    },
    {
        "name": "Nerio Green",
        "code": "nerio-green",
        "category": "Commercial",
        "base_price": 650000000,
        "battery_rent_monthly": 1800000,
        "description": "SUV điện cỡ B dịch vụ cao cấp cho chạy đường xa và dịch vụ đưa đón.",
        "rag_summary": "Nerio Green SUV cỡ B Dịch vụ | Giá: 650 triệu | Tầm xa: 399km | Nội thất rộng rãi",
        "specs": { "engine_drivetrain": { "items": { "range_km": 399 } } },
    },
    {
        "name": "Limo Green",
        "code": "limo-green",
        "category": "Commercial",
        "base_price": 890000000,
        "battery_rent_monthly": 2500000,
        "description": "MPV điện 7 chỗ dịch vụ đưa đón sân bay & resort sang trọng.",
        "rag_summary": "Limo Green MPV 7 chỗ Dịch vụ | Giá: 890 triệu | 7 chỗ rộng rãi | Đưa đón khách chuyên nghiệp",
        "specs": { "engine_drivetrain": { "items": { "seats": 7 } } },
    },
    {
        "name": "EC Van",
        "code": "ec-van",
        "category": "Commercial",
        "base_price": 285000000,
        "battery_rent_monthly": 1000000,
        "description": "Xe tải van điện giao hàng đô thị tiết kiệm tối đa chi phí vận hành.",
        "rag_summary": "EC Van Xe tải van điện | Giá: 285 triệu | Tải trọng tối ưu | Chuyên giao vận nội thành 24/7",
        "specs": { "engine_drivetrain": { "items": { "purpose": "Transport" } } },
    },
]


# ==========================================
# 2. XE MÁY ĐIỆN VINFAST (15 mẫu)
# ==========================================
E_SCOOTERS = [
    {
        "name": "VinFast Motio",
        "code": "motio",
        "category": "scooter",
        "base_price": 18000000,
        "battery_rent_monthly": 250000,
        "description": "Dòng xe máy điện phổ thông nhỏ gọn cho học sinh, sinh viên.",
        "rag_summary": "Motio Xe máy điện | Giá: 18 triệu | Động cơ In-hub 1200W | Vận tốc max: 45km/h (Không cần bằng lái) | Tầm xa: 90km | Cốp: 18L | Phanh đĩa/CBS | Kháng nước IP67",
        "specs": {
            "engine_type": "Động cơ BLDC In-hub",
            "power_w": "1200 W",
            "top_speed": "45 km/h",
            "range_km": 90,
            "battery_type": "Pin LFP an toàn",
            "trunk_l": 18,
            "brakes": "Phanh đĩa / CBS",
            "smartkey": "Khóa Smartkey & GPS",
            "waterproof": "IP67 chống ngập",
        },
    },
    {
        "name": "VinFast Amio S2",
        "code": "amio-s2",
        "category": "scooter",
        "base_price": 22000000,
        "battery_rent_monthly": 300000,
        "description": "Dòng xe máy điện đô thị thời trang phong cách Ý.",
        "rag_summary": "Amio S2 Xe máy điện | Giá: 22 triệu | Vận tốc: 50km/h | Tầm xa: 100km | Đèn Full LED | Cốp: 20L | Khóa Smartkey & Định vị GPS",
        "specs": {
            "engine_type": "Động cơ In-hub 1500W",
            "power_w": "1500 W",
            "top_speed": "50 km/h",
            "range_km": 100,
            "battery_type": "Pin LFP chống cháy",
            "trunk_l": 20,
            "brakes": "Phanh đĩa trước",
            "smartkey": "Smartkey & eSIM GPS",
            "waterproof": "IP67 ngập nước 0.5m",
        },
    },
    {
        "name": "VinFast Flazz",
        "code": "flazz",
        "category": "scooter",
        "base_price": 26000000,
        "battery_rent_monthly": 350000,
        "description": "Xe máy điện thể thao trẻ trung, động cơ Bosch bền bỉ.",
        "rag_summary": "Flazz Xe máy điện thể thao | Giá: 26 triệu | Động cơ Bosch 1800W | Vận tốc: 60km/h | Tầm xa: 110km | Cốp 22L | Phanh CBS",
        "specs": {
            "engine_type": "Động cơ Bosch Đột phá",
            "power_w": "1800 W",
            "top_speed": "60 km/h",
            "range_km": 110,
            "battery_type": "Pin LFP cao cấp",
            "trunk_l": 22,
            "brakes": "Phanh đĩa CBS",
            "smartkey": "Smartkey & App VinFast",
            "waterproof": "IP67 chống ngập 30 phút",
        },
    },
    {
        "name": "VinFast Flazz Max",
        "code": "flazz-max",
        "category": "scooter",
        "base_price": 29000000,
        "battery_rent_monthly": 350000,
        "description": "Phiên bản Flazz Max công suất nâng cấp và trang bị phanh đĩa kép.",
        "rag_summary": "Flazz Max | Giá: 29 triệu | Động cơ 2500W | Phanh đĩa kép | Tầm xa: 130km | Vận tốc max: 65km/h | Kháng nước IP67",
        "specs": {
            "engine_type": "Động cơ In-hub Cao cấp",
            "power_w": "2500 W",
            "top_speed": "65 km/h",
            "range_km": 130,
            "battery_type": "Pin LFP kép",
            "trunk_l": 22,
            "brakes": "Phanh đĩa kép an toàn",
            "smartkey": "Smartkey & Định vị GPS",
            "waterproof": "IP67 tiêu chuẩn",
        },
    },
    {
        "name": "VinFast Evo Lite",
        "code": "evo-lite",
        "category": "scooter",
        "base_price": 18000000,
        "battery_rent_monthly": 350000,
        "description": "Xe máy điện quốc dân Evo Lite vận tốc tối đa 49 km/h không cần bằng lái.",
        "rag_summary": "Evo Lite | Giá: 18 triệu | Vận tốc: 49km/h (Không cần bằng) | Tầm xa: 205km (Pin LFP) | Cốp siêu rộng: 22L | Đèn Full LED",
        "specs": {
            "engine_type": "Động cơ BLDC In-hub",
            "power_w": "1500 W",
            "top_speed": "49 km/h",
            "range_km": 205,
            "battery_type": "Pin LFP chống cháy nổ",
            "trunk_l": 22,
            "brakes": "Phanh đĩa trước / Trống sau",
            "smartkey": "Smartkey & GPS Chống trộm",
            "waterproof": "IP67 chịu ngập 0.5m",
        },
    },
    {
        "name": "VinFast Evo Lite Neo",
        "code": "evo-lite-neo",
        "category": "scooter",
        "base_price": 19500000,
        "battery_rent_monthly": 350000,
        "description": "Bản cải tiến Evo Lite Neo màu sắc thời trang trẻ trung.",
        "rag_summary": "Evo Lite Neo | Giá: 19.5 triệu | Vận tốc: 49km/h (Không cần bằng) | Tầm xa: 205km | Pin LFP an toàn chống cháy | Cốp 22L",
        "specs": {
            "engine_type": "Động cơ In-hub Tối ưu",
            "power_w": "1500 W",
            "top_speed": "49 km/h",
            "range_km": 205,
            "battery_type": "Pin LFP thế hệ mới",
            "trunk_l": 22,
            "brakes": "Phanh đĩa / CBS",
            "smartkey": "Smartkey & App VinFast",
            "waterproof": "IP67 chống ngập",
        },
    },
    {
        "name": "VinFast Evo Neo",
        "code": "evo-neo",
        "category": "scooter",
        "base_price": 22000000,
        "battery_rent_monthly": 350000,
        "description": "Phiên bản tiêu chuẩn Evo Neo vận tốc 70 km/h mạnh mẽ.",
        "rag_summary": "Evo Neo | Giá: 22 triệu | Động cơ 2500W | Vận tốc: 70km/h | Tầm xa: 203km | Phanh đĩa trước | Đèn Full LED",
        "specs": {
            "engine_type": "Động cơ BLDC In-hub",
            "power_w": "2500 W",
            "top_speed": "70 km/h",
            "range_km": 203,
            "battery_type": "Pin LFP cao cấp",
            "trunk_l": 22,
            "brakes": "Phanh đĩa trước",
            "smartkey": "Smartkey & Định vị GPS",
            "waterproof": "IP67 chống nước",
        },
    },
    {
        "name": "VinFast ZGoo",
        "code": "zgoo",
        "category": "scooter",
        "base_price": 15000000,
        "battery_rent_monthly": 250000,
        "description": "Xe điện siêu nhỏ gọn linh hoạt cho học sinh và đi chợ hàng ngày.",
        "rag_summary": "ZGoo Xe máy điện mini | Giá: 15 triệu | Vận tốc: 35km/h | Tầm xa: 70km | Siêu nhẹ | Cốp 15L",
        "specs": {
            "engine_type": "Động cơ Mini In-hub",
            "power_w": "1000 W",
            "top_speed": "35 km/h",
            "range_km": 70,
            "battery_type": "Pin LFP nhỏ gọn",
            "trunk_l": 15,
            "brakes": "Phanh cơ an toàn",
            "smartkey": "Khóa từ & Định vị",
            "waterproof": "IP67 chống ngập",
        },
    },
    {
        "name": "VinFast Feliz Neo",
        "code": "feliz-neo",
        "category": "scooter",
        "base_price": 27000000,
        "battery_rent_monthly": 350000,
        "description": "Dòng xe thanh lịch Feliz Neo kiểu dáng tay ga sang trọng.",
        "rag_summary": "Feliz Neo | Giá: 27 triệu | Vận tốc: 78km/h | Tầm xa: 198km | Động cơ 3000W | Cốp rộng 25L | Phanh CBS an toàn",
        "specs": {
            "engine_type": "Động cơ In-hub 3000W",
            "power_w": "3000 W",
            "top_speed": "78 km/h",
            "range_km": 198,
            "battery_type": "Pin LFP dung lượng cao",
            "trunk_l": 25,
            "brakes": "Phanh đĩa CBS",
            "smartkey": "Smartkey & Định vị GPS",
            "waterproof": "IP67 tiêu chuẩn",
        },
    },
    {
        "name": "VinFast Klara Neo",
        "code": "klara-neo",
        "category": "scooter",
        "base_price": 35000000,
        "battery_rent_monthly": 350000,
        "description": "Dòng tay ga đẳng cấp Klara Neo thiết kế thời trang Ý chuẩn mực.",
        "rag_summary": "Klara Neo | Giá: 35 triệu | Vận tốc: 78km/h | Tầm xa: 194km | Động cơ In-hub 3000W | Kháng nước IP67 | Cốp 23L",
        "specs": {
            "engine_type": "Động cơ In-hub 3000W",
            "power_w": "3000 W",
            "top_speed": "78 km/h",
            "range_km": 194,
            "battery_type": "Pin LFP thế hệ mới",
            "trunk_l": 23,
            "brakes": "Phanh đĩa 2 bánh",
            "smartkey": "Smartkey & eSIM VinFast",
            "waterproof": "IP67 chống ngập",
        },
    },
    {
        "name": "VinFast Klara S2",
        "code": "klara-s2",
        "category": "scooter",
        "base_price": 36900000,
        "battery_rent_monthly": 350000,
        "description": "Phiên bản Klara S2 dùng pin LFP thế hệ mới, cốp siêu rộng 23 lít.",
        "rag_summary": "Klara S2 | Giá: 36.9 triệu | Vận tốc: 78km/h | Tầm xa: 194km | Động cơ 3000W | Pin LFP thế hệ mới | Cốp 23L | Phanh đĩa đĩa",
        "specs": {
            "engine_type": "Động cơ In-hub Mạnh mẽ",
            "power_w": "3000 W",
            "top_speed": "78 km/h",
            "range_km": 194,
            "battery_type": "Pin LFP thế hệ mới",
            "trunk_l": 23,
            "brakes": "Phanh đĩa đĩa / CBS",
            "smartkey": "Smartkey PAAK & GPS",
            "waterproof": "IP67 chống nước 0.5m",
        },
    },
    {
        "name": "VinFast Vento Neo",
        "code": "vento-neo",
        "category": "scooter",
        "base_price": 48000000,
        "battery_rent_monthly": 350000,
        "description": "Dòng xe máy điện cao cấp Vento Neo tốc độ 80 km/h và công nghệ PAAK smartkey.",
        "rag_summary": "Vento Neo | Giá: 48 triệu | Vận tốc: 80km/h | Tầm xa: 160km | Động cơ Side Motor 4000W | Phanh ABS chống lật",
        "specs": {
            "engine_type": "Động cơ Side Motor đặt bên",
            "power_w": "4000 W",
            "top_speed": "80 km/h",
            "range_km": 160,
            "battery_type": "Pin LFP đôi",
            "trunk_l": 25,
            "brakes": "Phanh đĩa ABS 1 kênh",
            "smartkey": "PAAK Chìa khóa ảo & GPS",
            "waterproof": "IP67 chống nước ngập",
        },
    },
    {
        "name": "VinFast Vento S",
        "code": "vento-s",
        "category": "scooter",
        "base_price": 50000000,
        "battery_rent_monthly": 350000,
        "description": "Siêu phẩm Vento S tốc độ 89 km/h trang bị phanh ABS chống lật an toàn.",
        "rag_summary": "Vento S | Giá: 50 triệu | Vận tốc: 89km/h | Tầm xa: 160km | Động cơ Side Motor 5200W | Phanh ABS an toàn",
        "specs": {
            "engine_type": "Động cơ Side Motor 5200W",
            "power_w": "5200 W",
            "top_speed": "89 km/h",
            "range_km": 160,
            "battery_type": "Pin LFP kép cao cấp",
            "trunk_l": 25,
            "brakes": "Phanh ABS chống bó cứng",
            "smartkey": "Smartkey PAAK & App VinFast",
            "waterproof": "IP67 chịu ngập 0.5m",
        },
    },
    {
        "name": "VinFast Theon S",
        "code": "theon-s",
        "category": "scooter",
        "base_price": 63000000,
        "battery_rent_monthly": 350000,
        "description": "Flagship xe máy điện Theon S công suất khủng 7100W, tăng tốc 0-50km/h chỉ 6s.",
        "rag_summary": "Theon S Flagship | Giá: 63 triệu | Vận tốc: 99km/h | Tầm xa: 150km | Động cơ Center Motor 7100W | Phanh ABS 2 kênh | Khóa PAAK",
        "specs": {
            "engine_type": "Động cơ Center Motor truyền động xích",
            "power_w": "7100 W",
            "top_speed": "99 km/h",
            "range_km": 150,
            "battery_type": "Pin LFP thế hệ mới 3.5kWh",
            "trunk_l": 24,
            "brakes": "Phanh đĩa ABS 2 kênh trước sau",
            "smartkey": "Chìa ảo PAAK & Định vị 4G GPS",
            "waterproof": "IP67 kháng nước tuyệt đối",
        },
    },
    {
        "name": "VinFast Viper",
        "code": "viper",
        "category": "scooter",
        "base_price": 75000000,
        "battery_rent_monthly": 450000,
        "description": "Mẫu xe máy điện thể thao phân khối lớn cá tính bứt phá mọi giới hạn.",
        "rag_summary": "Viper Xe máy điện thể thao | Giá: 75 triệu | Động cơ 8000W | Vận tốc: 105km/h | Tầm xa: 180km | Phanh ABS 2 kênh | Khung sườn thể thao",
        "specs": {
            "engine_type": "Động cơ Center Motor Thể thao",
            "power_w": "8000 W",
            "top_speed": "105 km/h",
            "range_km": 180,
            "battery_type": "Pin LFP kép Thể thao",
            "trunk_l": 20,
            "brakes": "Phanh đĩa ABS 2 kênh thể thao",
            "smartkey": "Smartkey PAAK 4G GPS",
            "waterproof": "IP67 cao cấp",
        },
    },
]


async def seed_data():
    print("=" * 70)
    print("[START] Auto-Config & Seeding Vehicles with exact Named Images in static/...")
    print("=" * 70)

    # Sync tables and migrations
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(text("ALTER TABLE cars ADD COLUMN IF NOT EXISTS rag_summary TEXT;"))

    async with SessionLocal() as db:
        # Clear existing entries
        await db.execute(delete(Car))
        await db.execute(delete(EScooter))
        await db.commit()

        # Seed Cars (16 models) mapped by code
        for car_data in PASSENGER_CARS:
            code = car_data["code"]
            image_url = CAR_IMAGE_MAP.get(code, "/static/uploads/cars/VF5.jpg")

            car = Car(
                name=car_data["name"],
                code=car_data["code"],
                category=car_data["category"],
                base_price=car_data["base_price"],
                battery_buy_price=car_data.get("battery_buy_price"),
                battery_rent_monthly=car_data.get("battery_rent_monthly"),
                description=car_data.get("description"),
                image_url=image_url,
                specs=car_data.get("specs", {}),
                rag_summary=car_data.get("rag_summary"),
                is_available=True,
            )
            db.add(car)

        # Seed E-Scooters (15 models) mapped by code
        for scooter_data in E_SCOOTERS:
            code = scooter_data["code"]
            image_url = ESCOOTER_IMAGE_MAP.get(code, "/static/uploads/escooters/Evo_lite.jpg")

            scooter = EScooter(
                name=scooter_data["name"],
                code=scooter_data["code"],
                category=scooter_data["category"],
                base_price=scooter_data["base_price"],
                battery_buy_price=scooter_data.get("battery_buy_price"),
                battery_rent_monthly=scooter_data.get("battery_rent_monthly"),
                description=scooter_data.get("description"),
                image_url=image_url,
                specs=scooter_data.get("specs", {}),
                rag_summary=scooter_data.get("rag_summary"),
                is_available=True,
            )
            db.add(scooter)

        # Seed Demo Users if not exist
        default_users = [
            {
                "email": "admin@vinfast.vn",
                "password": "admin123",
                "full_name": "Quản trị viên Hệ thống",
                "role": "admin",
                "phone": "0901234567",
            },
            {
                "email": "staff@vinfast.vn",
                "password": "staff123",
                "full_name": "Tư vấn viên VinFast",
                "role": "consultant",
                "phone": "0907654321",
            },
            {
                "email": "customer@gmail.com",
                "password": "123456",
                "full_name": "Nguyễn Văn Khách",
                "role": "customer",
                "phone": "0988888888",
            },
        ]
        for u_info in default_users:
            res = await db.execute(select(User).where(User.email == u_info["email"]))
            if not res.scalar_one_or_none():
                new_u = User(
                    email=u_info["email"],
                    hashed_password=hash_password(u_info["password"]),
                    full_name=u_info["full_name"],
                    role=u_info["role"],
                    phone=u_info["phone"],
                    is_active=True,
                )
                db.add(new_u)

        await db.commit()
        print(f"[SUCCESS] Seeded {len(PASSENGER_CARS)} Cars with exact mapped static images (e.g. VF3_Eco.jpg, VF8_Plus.jpg)!")
        print(f"[SUCCESS] Seeded {len(E_SCOOTERS)} E-Scooters with exact mapped static images (e.g. Evo_lite.jpg, ZGoo.jpg)!")
        print(f"[SUCCESS] Seeded {len(default_users)} Default Users (Admin: admin@vinfast.vn/admin123, Staff: staff@vinfast.vn/staff123)!")
        print("[SUCCESS] Total 31 official VinFast vehicles auto-configured to exact image files in static/uploads!")
        print("=" * 70)


if __name__ == "__main__":
    asyncio.run(seed_data())
