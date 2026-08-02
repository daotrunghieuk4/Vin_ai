# Backend FastAPI - VinFast AI Agent & Sales System

Hệ thống Backend API bất đồng bộ (Async) phục vụ ứng dụng VinFast AI Agent & Quản lý Showroom, được xây dựng bằng **FastAPI**, **SQLAlchemy 2.0 (Async)** và kết nối cơ sở dữ liệu **Supabase PostgreSQL Cloud**.

---

## 📁 Cấu trúc Thư mục Backend

```text
backend/
├── app/
│   ├── core/               # Cấu hình hệ thống, Security JWT, Hash Password
│   ├── domain/             # ORM Models (User, Car, EScooter, Quote, TestDriveBooking, ChatSession...)
│   ├── infrastructure/     # Async Database Engine & Connection Session
│   ├── features/           # Các module nghiệp vụ theo Domain-Driven Design:
│   │   ├── auth/           # Đăng ký, Đăng nhập, Quản lý tài khoản Admin/Staff
│   │   ├── cars/           # Danh mục & Chi tiết Ô tô điện VinFast
│   │   ├── escooters/      # Danh mục & Chi tiết Xe máy điện VinFast
│   │   ├── quotes/         # Yêu cầu tính giá lăn bánh & Báo giá
│   │   └── bookings/       # Đăng ký lịch hẹn Lái thử
│   └── main.py             # Khởi tạo FastAPI App, CORS Middleware, Static mounts
├── static/                 # Upload hình ảnh sản phẩm tĩnh (cars, escooters)
├── seed_cars.py            # Script tự tạo Bảng & Nạp dữ liệu mẫu (31 mẫu xe + Demo Users)
├── requirements.txt        # Danh sách các thư viện mã nguồn
├── .env.example            # Mẫu file cấu hình biến môi trường (Có sẵn Supabase URL)
└── README.md
```

---

## ⚡ Hướng dẫn Cài đặt & Khởi chạy Local

### 1. Khởi tạo Môi trường ảo (Virtual Environment)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Cài đặt các Thư viện Phụ thuộc
```powershell
pip install -r requirements.txt
```

### 3. Cấu hình File Biến Môi trường `.env`
Sao chép cấu hình mẫu từ `.env.example` (Đã được thiết lập sẵn chuỗi kết nối **Supabase Cloud PostgreSQL**):
```powershell
Copy-Item .env.example .env
```

### 4. Nạp Dữ liệu Mẫu (Seed Data - *Tùy chọn / Optional*)
> 💡 **Lưu ý quan trọng**: 
> - **Nếu bạn đang kết nối Supabase Cloud đã có sẵn dữ liệu**: **BỎ QUA bước này!** Dữ liệu 31 xe và các tài khoản demo đã sẵn sàng trên Cloud.
> - **Khi nào cần chạy**: Chỉ chạy khi khởi tạo một Cơ sở dữ liệu mới tinh (ví dụ: DB SQLite local mới hoặc Project Supabase mới chưa có bảng) hoặc khi muốn reset lại toàn bộ dữ liệu mẫu.

```powershell
python seed_cars.py
```

### 5. Khởi chạy Server FastAPI
```powershell
uvicorn app.main:app --reload --port 8000
```

---

## 🌐 Danh sách API Endpoints Chính

| Phân loại | Endpoint | Phương thức | Mô tả |
| :--- | :--- | :--- | :--- |
| **Hệ thống** | `/health` | `GET` | Kiểm tra trạng thái Server & Database Supabase |
| **Xác thực** | `/api/auth/register` | `POST` | Đăng ký tài khoản Khách hàng mới |
| | `/api/auth/login` | `POST` | Đăng nhập lấy Token Bearer JWT |
| | `/api/auth/me` | `GET` | Lấy thông tin tài khoản đang đăng nhập |
| | `/api/auth/users` | `GET` | [Admin] Xem danh sách toàn bộ người dùng |
| | `/api/auth/create-staff` | `POST` | [Admin] Tạo tài khoản Nhân viên Sales/Consultant |
| **Ô tô điện** | `/api/cars` | `GET` | Danh sách 16 mẫu Ô tô điện VinFast |
| | `/api/cars/{id}` | `GET` | Thông số kỹ thuật chi tiết Ô tô theo ID/Code |
| **Xe máy điện**| `/api/escooters` | `GET` | Danh sách 15 mẫu Xe máy điện VinFast |
| | `/api/escooters/{id}` | `GET` | Thông số kỹ thuật chi tiết Xe máy điện |
| **Báo giá** | `/api/quotes` | `POST` / `GET` | Tạo yêu cầu báo giá / Xem danh sách báo giá |
| **Lái thử** | `/api/bookings` | `POST` / `GET` | Đăng ký lịch lái thử / Quản lý lịch hẹn |

---

## 🔐 Tài khoản Đăng nhập Mặc định (Seed Users)

- 👑 **Quản trị viên (Admin)**: `admin@vinfast.vn` | Pass: `admin123`
- 💼 **Tư vấn viên (Staff)**: `staff@vinfast.vn` | Pass: `staff123`
- 👤 **Khách hàng Demo**: `customer@gmail.com` | Pass: `123456`

---

## 📄 Tài liệu API Tự động (Swagger UI)

Khi server đang chạy, truy cập đường dẫn sau để xem tài liệu API tương tác trực tiếp:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
