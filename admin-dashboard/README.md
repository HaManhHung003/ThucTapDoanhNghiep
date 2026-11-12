# SalesHub – Admin Dashboard (React + Vite + Tailwind CSS)

Hệ thống quản lý Bán hàng & Dịch vụ dạng SPA.

## Công nghệ
- **React 19 + Vite 6**
- **Tailwind CSS v4** (plugin `@tailwindcss/vite`)
- **React Router DOM v7** – định tuyến, Protected Route
- **Redux Toolkit** – quản lý trạng thái đăng nhập (`src/store/authSlice.js`)
- **React Hook Form** – form đăng nhập & form thêm sản phẩm
- **Axios** – gọi API giả lập [DummyJSON](https://dummyjson.com/docs/products)
- **lucide-react** – icon

## Chạy dự án
```bash
npm install
cp .env.example .env   # (tùy chọn) Windows: copy .env.example .env
npm run dev            # http://localhost:5173
```

Tài khoản demo: **admin@demo.com / 123456**

## Cấu trúc thư mục
```
src/
├── components/
│   ├── common/      # ProtectedRoute, GuestRoute, Modal, StatCard, Pagination, Toast, StatusBadge
│   ├── dashboard/   # RevenueChart, OrderStatusCard, RecentOrdersTable
│   ├── layout/      # Layout (Admin Layout), Sidebar, Header
│   └── products/    # ProductTable, ProductFormModal
├── constants/       # Menu, danh mục, cấu hình trạng thái
├── hooks/           # useAuth, useProducts, useDebounce, useClickOutside
├── pages/           # LoginPage, DashboardPage, ProductsPage, ComingSoonPage, NotFoundPage
├── services/        # axiosClient, authService, productService, dashboardService
├── store/           # Redux store + authSlice
├── utils/           # Hàm format tiền tệ, ngày tháng
├── App.jsx          # Khai báo routes
└── main.jsx         # Điểm khởi chạy (Provider + BrowserRouter)
```

## Đổi sang MockAPI.io
1. Tạo project trên https://mockapi.io, tạo resource `products`.
2. Sửa `.env`: `VITE_API_URL=https://<id>.mockapi.io/api/v1`
3. Sửa `src/services/productService.js` cho đúng định dạng MockAPI
   (`GET /products?page=1&limit=10&search=abc`, `POST /products`, `DELETE /products/:id`) –
   MockAPI trả về mảng thay vì `{ products, total }`.

