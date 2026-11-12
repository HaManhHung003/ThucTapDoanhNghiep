import productService from './productService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Dashboard Service
 * - Số liệu doanh thu / đơn hàng: dữ liệu MOCK (giả lập).
 * - Tổng số sản phẩm: lấy THẬT từ API sản phẩm.
 */
const dashboardService = {
  async getSummary() {
    const [productRes] = await Promise.allSettled([
      productService.getAll({ limit: 1 }),
      delay(500),
    ]);

    const totalProducts = productRes.status === 'fulfilled' ? productRes.value.total : 0;

    return {
      stats: {
        revenue: { value: 845_600_000, change: 12.5 },
        orders: { value: 1_284, change: 8.2 },
        customers: { value: 342, change: -3.1 },
        products: { value: totalProducts, change: null },
      },
      revenueByDay: [
        { label: 'T2', value: 98 },
        { label: 'T3', value: 125 },
        { label: 'T4', value: 87 },
        { label: 'T5', value: 142 },
        { label: 'T6', value: 168 },
        { label: 'T7', value: 196 },
        { label: 'CN', value: 129 },
      ],
      orderStatus: [
        { key: 'completed', label: 'Hoàn thành', count: 856 },
        { key: 'processing', label: 'Đang xử lý', count: 214 },
        { key: 'pending', label: 'Chờ xác nhận', count: 152 },
        { key: 'cancelled', label: 'Đã hủy', count: 62 },
      ],
      recentOrders: [
        { id: 'DH-1024', customer: 'Trần Thị Mai', item: 'iPhone 15 Pro Max', amount: 32_990_000, status: 'completed', date: '2026-11-10' },
        { id: 'DH-1023', customer: 'Lê Văn Hùng', item: 'Gói bảo trì máy lạnh', amount: 850_000, status: 'processing', date: '2026-11-10' },
        { id: 'DH-1022', customer: 'Phạm Minh Tuấn', item: 'MacBook Air M3', amount: 27_490_000, status: 'pending', date: '2026-11-09' },
        { id: 'DH-1021', customer: 'Hoàng Thu Trang', item: 'Dịch vụ vệ sinh sofa', amount: 1_200_000, status: 'completed', date: '2026-11-09' },
        { id: 'DH-1020', customer: 'Võ Quốc Bảo', item: 'Tai nghe AirPods Pro 2', amount: 5_990_000, status: 'cancelled', date: '2026-11-08' },
        { id: 'DH-1019', customer: 'Đặng Ngọc Anh', item: 'Samsung Galaxy S24', amount: 19_990_000, status: 'completed', date: '2026-11-08' },
      ],
    };
  },
};

export default dashboardService;

