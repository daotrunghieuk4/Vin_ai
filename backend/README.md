# Backend FastAPI VinFast

Backend được tách riêng khỏi frontend:

- Frontend: `D:\Vin_ai\frontend`
- Backend: `D:\Vin_ai\backend`

## Cấu trúc backend

```text
backend/app/
├── core/             # Cấu hình ứng dụng
├── infrastructure/   # Engine database và dependency session
├── domain/           # Entity SQLAlchemy và thành phần domain dùng chung
├── features/         # Mỗi thư mục tương ứng một nghiệp vụ
│   ├── quotes/       # Router, schema, service báo giá
│   └── bookings/     # Router, schema, service đặt lịch
└── main.py           # Khởi tạo app, middleware và đăng ký router
```

## Cài đặt local

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

Đặt chuỗi kết nối PostgreSQL vào `DATABASE_URL` trong `.env`. Khi khởi động ở môi trường local, API sẽ tự tạo hai bảng `quotes` và `test_drive_bookings`.

- Swagger: `http://localhost:8000/docs`
- Kiểm tra kết nối: `http://localhost:8000/health`
- Báo giá: `http://localhost:8000/api/quotes`
- Đặt lịch lái thử: `http://localhost:8000/api/bookings`

Với frontend Vite, tạo file `D:\Vin_ai\frontend\.env.local` và thêm:

```env
VITE_API_URL=http://localhost:8000
```

