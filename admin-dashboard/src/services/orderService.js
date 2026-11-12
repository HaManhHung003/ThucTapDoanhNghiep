import axiosClient from './axiosClient';

const STORAGE_ORDERS_KEY = 'saleshub_custom_orders';

// Danh sách trạng thái đơn hàng ngẫu nhiên để mô phỏng thực tế
const MOCK_STATUSES = ['completed', 'processing', 'pending', 'cancelled'];
const PAYMENT_METHODS = ['COD', 'Chuyển khoản QR', 'Thẻ tín dụng (Visa/Master)', 'Ví MoMo'];

function getLocalOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
}

const orderService = {
  /**
   * Lấy danh sách đơn hàng
   * - Nếu chưa có trong localStorage thì gọi /carts từ DummyJSON, sau đó làm giàu thông tin và lưu lại.
   */
  async getAll({ status = '', search = '', limit = 10, page = 1 } = {}) {
    let orders = getLocalOrders();

    if (!orders) {
      try {
        const response = await axiosClient.get('/carts', { params: { limit: 50 } });
        const carts = response.carts || [];

        // Làm giàu thông tin đơn hàng
        orders = carts.map((cart, index) => {
          const date = new Date(Date.now() - (index * 86400000 * 1.5 + Math.random() * 43200000));
          return {
            id: `DH-${1000 + cart.id}`,
            cartId: cart.id,
            customer: {
              name: `Khách hàng #${cart.userId}`,
              email: `user${cart.userId}@example.com`,
              phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
              address: 'Số ' + (index + 12) + ' Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
            },
            items: cart.products.map((p) => ({
              id: p.id,
              title: p.title,
              price: p.price,
              quantity: p.quantity,
              total: p.total,
              thumbnail: p.thumbnail,
            })),
            totalQuantity: cart.totalQuantity,
            totalAmount: cart.discountedTotal || cart.total,
            status: MOCK_STATUSES[index % MOCK_STATUSES.length],
            paymentMethod: PAYMENT_METHODS[index % PAYMENT_METHODS.length],
            createdAt: date.toISOString(),
          };
        });

        saveLocalOrders(orders);
      } catch (err) {
        orders = [];
      }
    }

    // Lọc theo search
    let filtered = [...orders];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q),
      );
    }

    // Lọc theo trạng thái
    if (status && status !== 'all') {
      filtered = filtered.filter((o) => o.status === status);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filtered.slice(startIndex, startIndex + limit);

    return {
      orders: paginatedOrders,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  /**
   * Cập nhật trạng thái đơn hàng (Ví dụ: pending -> processing -> completed)
   */
  async updateStatus(orderId, newStatus) {
    const orders = getLocalOrders() || [];
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveLocalOrders(updated);
    return updated.find((o) => o.id === orderId);
  },

  /**
   * Xóa đơn hàng
   */
  async remove(orderId) {
    const orders = getLocalOrders() || [];
    const filtered = orders.filter((o) => o.id !== orderId);
    saveLocalOrders(filtered);
    return true;
  },
};

export default orderService;

