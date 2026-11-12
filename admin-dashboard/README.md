# SalesHub – Admin Dashboard (React + Vite + Tailwind CSS)

Hệ thống quản lý Bán hàng & Dịch vụ dạng SPA chuyên nghiệp, đầy đủ tính năng.

## Công nghệ sử dụng
- **React 19 + Vite 6**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router DOM v7** – định tuyến SPA, Protected Route, Guest Route
- **Redux Toolkit** – quản lý trạng thái đăng nhập User (`src/store/authSlice.js`)
- **React Hook Form** – xử lý form đăng nhập, form thêm sản phẩm, thêm khách hàng & đổi mật khẩu
- **Axios** – tích hợp API giả lập [DummyJSON](https://dummyjson.com):
  - Sản phẩm: `/products` & `/products/search`
  - Đơn hàng: `/carts` + enrich thông tin & quản lý trạng thái
  - Khách hàng: `/users` & `/users/search`
- **lucide-react** – bộ icon giao diện hiện đại

## Hướng dẫn chạy dự án
```bash
cd admin-dashboard
npm install
npm run dev
```
Truy cập: [http://localhost:5173](http://localhost:5173)

- Tài khoản demo: **admin@demo.com / 123456** (có nút bấm "Điền tự động" ở màn hình Login).

## Các trang & Tính năng đã hoàn thiện

1. **Trang Đăng nhập (Login)**:
   - Form Email & Password có validation đầy đủ bằng React Hook Form.
   - Báo lỗi đăng nhập trực quan, nút ẩn/hiện mật khẩu, nút tự điền tài khoản mẫu.

2. **Admin Layout chuẩn Responsive**:
   - Sidebar menu bên trái (cố định trên Desktop, trượt ra kèm backdrop trên Mobile).
   - Header sticky có chuông thông báo và Dropdown profile tài khoản (có nút Đăng xuất).

3. **Trang Tổng quan (Dashboard)**:
   - 4 thẻ thống kê: Doanh thu, Tổng đơn hàng, Khách hàng mới, Số lượng sản phẩm (lấy trực tiếp từ API).
   - Biểu đồ cột doanh thu 7 ngày qua (vẽ bằng Tailwind CSS thuần).
   - Bảng phân bổ trạng thái đơn hàng kèm progress bar.
   - Bảng tóm tắt các đơn hàng mới nhất.

4. **Trang Quản lý Sản phẩm / Dịch vụ**:
   - Danh sách sản phẩm từ API có thanh tìm kiếm (Debounced search).
   - Nút "Thêm mới" mở Modal Form có kiểm tra hợp lệ dữ liệu.
   - Nút xóa sản phẩm, phân trang (Pagination), Toast thông báo.

5. **Trang Quản lý Đơn hàng (Orders)**:
   - Bộ lọc trạng thái đơn: Tất cả, Chờ xác nhận, Đang xử lý, Hoàn thành, Đã hủy.
   - Thanh tìm kiếm theo mã đơn (`DH-1001`), tên khách hàng hoặc số điện thoại.
   - Modal xem chi tiết đơn hàng: thông tin người nhận, danh sách sản phẩm mua, tổng tiền, phương thức thanh toán.
   - Thao tác cập nhật trạng thái đơn hàng trực tiếp và lưu vào hệ thống.

6. **Trang Quản lý Khách hàng (Customers)**:
   - Danh bạ khách hàng lấy từ API `/users` (kèm avatar, email, điện thoại, địa chỉ).
   - Thanh tìm kiếm khách hàng theo tên.
   - Modal thêm mới khách hàng với form validation.
   - Xóa khách hàng, phân trang và thông báo Toast.

7. **Trang Cài đặt hệ thống (Settings)**:
   - **Tab Hồ sơ cửa hàng**: Tên cửa hàng, MST, Hotline, Email, Địa chỉ, Tiền tệ mặc định, Múi giờ.
   - **Tab Tài khoản & Bảo mật**: Đổi tên hiển thị, form Đổi mật khẩu (kiểm tra mật khẩu xác nhận).
   - **Tab Thông báo**: Các nút toggle switch bật/tắt nhận email đơn mới, cảnh báo tồn kho thấp, báo cáo cuối ngày.

## Cấu trúc thư mục chuẩn
```
src/
├── components/
│   ├── common/      # ProtectedRoute, GuestRoute, Modal, StatCard, Pagination, Toast, StatusBadge
│   ├── layout/      # Layout, Sidebar, Header
│   ├── dashboard/   # RevenueChart, OrderStatusCard, RecentOrdersTable
│   ├── products/    # ProductTable, ProductFormModal
│   ├── orders/      # OrderDetailModal
│   └── customers/   # CustomerFormModal
├── constants/       # Danh mục sản phẩm, cấu hình trạng thái đơn hàng, menu điều hướng
├── hooks/           # useAuth, useProducts, useOrders, useCustomers, useDebounce, useClickOutside
├── pages/           # LoginPage, DashboardPage, ProductsPage, OrdersPage, CustomersPage, SettingsPage, NotFoundPage
├── services/        # axiosClient, authService, productService, orderService, customerService, settingsService
├── store/           # Redux store + authSlice
├── utils/           # Format tiền tệ (VND/USD), ngày tháng, initials avatar
├── App.jsx          # Cấu hình routes SPA
└── main.jsx         # Entry point (Redux Provider + BrowserRouter)
```
