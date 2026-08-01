# Ứng dụng VinFast

Repository được chia theo trách nhiệm chạy ứng dụng:

```text
D:\Vin_ai\
├── frontend                # Frontend React/Vite
│   ├── src/components/     # Thành phần giao diện dùng lại
│   ├── src/pages/          # Các màn hình cấp trang
│   ├── src/data/           # Dữ liệu tĩnh về xe/danh mục
│   ├── src/lib/            # Client dùng chung và tiện ích
│   └── src/types/          # Kiểu dữ liệu TypeScript
├── backend                 # Backend FastAPI
│   └── app/
│       ├── core/           # Cấu hình dùng chung
│       ├── infrastructure/ # Kết nối PostgreSQL và session
│       ├── domain/         # Entity của database
│       └── features/       # Các module nghiệp vụ của API
├── docker-compose.yml      # PostgreSQL local, tùy chọn
└── .gitignore
```

## Thứ tự khởi động

1. Khởi động PostgreSQL local, hoặc chạy `docker compose up -d postgres` từ `D:\Vin_ai`.
2. Khởi động FastAPI từ `D:\Vin_ai\backend`.
3. Khởi động Vite từ `D:\Vin_ai\frontend`.

Frontend gọi FastAPI thông qua `src/lib/api.ts`. React không truy cập PostgreSQL trực tiếp; toàn bộ việc truy cập database nằm trong backend.

