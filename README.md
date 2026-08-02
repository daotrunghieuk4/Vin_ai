# 🚘 VinFast AI Agent & O2O Sales System

Hệ thống ứng dụng thương mại điện tử **VinFast O2O (Online-to-Offline)** kết hợp **AI Agent tư vấn bán hàng thông minh**, được xây dựng với cấu trúc hiện đại:
- **Backend**: FastAPI (Python 3.13), Async SQLAlchemy 2.0, Supabase PostgreSQL Cloud.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.

---

## 📁 Cấu trúc Thư mục Dự án

```text
Vin_ai/
├── frontend/                 # 🌐 Client Web Application (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/       # Các thành phần UI (Header, VehicleCard, CompareModal, AIChatWidget...)
│   │   ├── pages/            # Các trang chức năng (Aftersales, Charging, Energy...)
│   │   ├── lib/              # Client API, Helper format tiền VNĐ, Supabase client
│   │   ├── types/            # TypeScript interfaces (Vehicle, Quote, UserAccount...)
│   │   └── App.tsx           # Luồng điều hướng chính và quản lý State
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # ⚡ RESTful API Server (FastAPI + Async SQLAlchemy)
│   ├── app/
│   │   ├── core/             # Security JWT, Password Hashing, Config
│   │   ├── domain/           # Database ORM Models (User, Car, EScooter, Quote, Booking...)
│   │   ├── infrastructure/   # Database Engine & Async Session getter
│   │   ├── features/         # Modules API (Auth, Cars, EScooters, Quotes, Bookings)
│   │   └── main.py           # Khởi tạo FastAPI App, CORS & Routing
│   ├── seed_cars.py          # Script nạp 31 mẫu xe + Tài khoản thử nghiệm (Tùy chọn)
│   ├── requirements.txt      # Thư viện Python phụ thuộc
│   └── .env.example          # Mẫu cấu hình Supabase Database URL
├── docker-compose.yml        # Tùy chọn chạy PostgreSQL Local bằng Docker
└── README.md                 # Tài liệu hướng dẫn tổng quan dự án
```

---

## ⚡ Hướng dẫn Khởi chạy Hệ thống

### 1. Khởi chạy Backend (FastAPI Server)

```powershell
# Di chuyển tới thư mục backend
cd backend

# Kích hoạt môi trường ảo (.venv)
.\.venv\Scripts\Activate.ps1

# Cài đặt các thư viện (nếu chưa cài)
pip install -r requirements.txt

# Khởi chạy server API (Chạy tại http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```
> 💡 *Lưu ý về Cơ sở dữ liệu*: Dữ liệu 31 mẫu xe và tài khoản mẫu đã có sẵn trên Supabase Cloud. Bạn **không cần** chạy `python seed_cars.py` ngoại trừ trường hợp khởi tạo DB local mới.

---

### 2. Khởi chạy Frontend (Vite App)

Mở một cửa sổ Terminal mới:

```powershell
# Di chuyển tới thư mục frontend
cd frontend

# Khởi chạy Vite Dev Server (Chạy tại http://localhost:5173)
npm run dev
```

---

## 🎯 Các Chức năng Chính Đã Triển khai

1. **Danh mục & Chi tiết Xe VinFast**:
   * Danh mục 31 mẫu xe chuẩn bao gồm 16 Ô tô điện (VF 3 đến VF 9) và 15 Xe máy điện (Theon S, Feliz S, Klara S, Evo200...).
   * Modal chi tiết thông số kỹ thuật chuẩn (Động cơ, Kích thước, Nội thất, Túi khí ADAS).

2. **So Sánh Xe Song Song (Side-by-side Comparison Matrix)**:
   * So sánh song song từ 2 đến 3 mẫu xe bất kỳ.
   * Tự động highlight ưu điểm (Giá rẻ nhất, Quãng đường xa nhất).
   * Cửa sổ chọn xe tùy chỉnh linh hoạt kèm công cụ tìm kiếm.
   * Tương thích nút Back trình duyệt và click Logo VinFast quay về trang chủ.

3. **Yêu cầu Báo Giá (`/api/quotes`) & Đặt Lịch Lái Thử (`/api/bookings`)**:
   * Form yêu cầu báo giá lăn bánh & Đặt lịch hẹn trải nghiệm xe.
   * Cổng thông tin dành cho **Tư vấn viên (Staff / CRM)** & **Quản trị viên (Admin)** để duyệt báo giá và quản lý lịch hẹn.

4. **AI Advisor Agent**:
   * Cửa sổ hội thoại thông minh hỗ trợ khách hàng tìm mẫu xe theo nhu cầu và ngân sách.

---

## 🔐 Tài khoản Đăng nhập Thử nghiệm

- 👑 **Quản trị viên (Admin)**: `admin@vinfast.vn` | Mật khẩu: `admin123`
- 💼 **Tư vấn viên (Staff)**: `staff@vinfast.vn` | Mật khẩu: `staff123`
- 👤 **Khách hàng Demo**: `customer@gmail.com` | Mật khẩu: `123456`
