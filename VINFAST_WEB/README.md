# Frontend VinFast

Frontend gọi dữ liệu qua FastAPI. Khi deploy, đặt `VITE_API_URL` trỏ tới domain backend, không trỏ trực tiếp tới PostgreSQL hoặc Supabase database.

Frontend được xây dựng bằng React, TypeScript và Vite.

## Cài đặt và chạy

```powershell
npm install
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

Để kết nối tới backend FastAPI, tạo file `.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

## Các lệnh hữu ích

```powershell
npm run build
npm run lint
npm run typecheck
```
