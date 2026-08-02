# 🌐 Frontend VinFast - O2O Web Application

Ứng dụng Giao diện Thương mại điện tử & AI Tư vấn Bán hàng VinFast O2O, xây dựng bằng **React 18**, **TypeScript**, **Vite** và **Tailwind CSS**.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```powershell
cd frontend
npm install
```

### 2. Cấu hình biến môi trường `.env.local` (Tùy chọn)
Tạo file `.env.local` ở thư mục root của `frontend` nếu muốn thay đổi URL Backend:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Khởi chạy Development Server
```powershell
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: **`http://localhost:5173`**

---

## 🛠️ Cấu trúc Thư mục Frontend

```text
frontend/src/
├── assets/                   # Hình ảnh & tài nguyên tĩnh
├── components/               # Các Component giao diện dùng chung
│   ├── Header.tsx            # Thanh điều hướng chính (Logo, Danh mục, Auth)
│   ├── Hero.tsx              # Banner Hero chính
│   ├── VehicleShowcase.tsx   # Danh sách thẻ xe & bộ lọc dòng xe
│   ├── VehicleCard.tsx       # Thẻ hiển thị thông tin từng mẫu xe
│   ├── VehicleDetailModal.tsx# Modal xem chi tiết thông số kỹ thuật
│   ├── CompareModal.tsx      # Bảng so sánh 2-3 mẫu xe song song
│   ├── CompareBar.tsx        # Thanh nổi kích hoạt so sánh ở đáy màn hình
│   ├── AIChatWidget.tsx      # Khung hội thoại AI Advisor
│   ├── StaffDrawer.tsx       # CRM Dashboard cho Tư vấn viên duyệt báo giá & lịch hẹn
│   ├── AdminDashboardModal.tsx # Trang quản trị Admin
│   ├── AuthModal.tsx         # Modal Đăng nhập / Đăng ký
│   └── UserProfileModal.tsx  # Trang hồ sơ tài khoản cá nhân
├── pages/                    # Các trang tĩnh mở rộng
│   ├── AftersalesPage.tsx    # Dịch vụ hậu mãi & bảo hành
│   ├── ChargingPage.tsx      # Hạ tầng pin & trạm sạc
│   └── EnergyPage.tsx        # Giải pháp lưu trữ năng lượng
├── lib/                      # Hàm tiện ích & Client gọi API (api.ts, supabase.ts)
├── types/                    # Khai báo kiểu TypeScript (Vehicle, Quote, Role...)
└── App.tsx                   # Luồng điều hướng chính và quản lý State toàn ứng dụng
```

---

## ⚙️ Các Lệnh Thao tác Hữu ích

```powershell
# Kiểm tra lỗi TypeScript không emit file
npm run typecheck

# Luyện kiểm tra Linting mã nguồn
npm run lint

# Đóng gói sản phẩm Production (dist)
npm run build
```
