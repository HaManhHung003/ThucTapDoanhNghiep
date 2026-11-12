import { LayoutDashboard, Package, Settings, ShoppingCart, Users } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Sản phẩm / Dịch vụ', icon: Package },
  { to: '/orders', label: 'Đơn hàng', icon: ShoppingCart },
  { to: '/customers', label: 'Khách hàng', icon: Users },
  { to: '/settings', label: 'Cài đặt', icon: Settings },
];

export const PRODUCT_CATEGORIES = [
  { value: 'smartphones', label: 'Điện thoại' },
  { value: 'laptops', label: 'Laptop' },
  { value: 'tablets', label: 'Máy tính bảng' },
  { value: 'mobile-accessories', label: 'Phụ kiện' },
  { value: 'beauty', label: 'Làm đẹp' },
  { value: 'fragrances', label: 'Nước hoa' },
  { value: 'furniture', label: 'Nội thất' },
  { value: 'groceries', label: 'Thực phẩm' },
  { value: 'services', label: 'Dịch vụ' },
];

export const ORDER_STATUS = {
  completed: { label: 'Hoàn thành', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', bar: 'bg-emerald-500' },
  processing: { label: 'Đang xử lý', className: 'bg-amber-50 text-amber-700 ring-amber-600/20', bar: 'bg-amber-500' },
  pending: { label: 'Chờ xác nhận', className: 'bg-sky-50 text-sky-700 ring-sky-600/20', bar: 'bg-sky-500' },
  cancelled: { label: 'Đã hủy', className: 'bg-rose-50 text-rose-700 ring-rose-600/20', bar: 'bg-rose-500' },
};

