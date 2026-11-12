import { useState, useCallback } from 'react';
import { Eye, PackageSearch, RefreshCw, Search, Trash2, X } from 'lucide-react';
import useOrders from '@/hooks/useOrders';
import StatusBadge from '@/components/common/StatusBadge';
import Pagination from '@/components/common/Pagination';
import Toast from '@/components/common/Toast';
import OrderDetailModal from '@/components/orders/OrderDetailModal';
import { ORDER_STATUS } from '@/constants';
import { formatDate, formatNumber, formatUSD } from '@/utils/format';

const PAGE_SIZE = 8;

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export default function OrdersPage() {
  const {
    orders,
    total,
    page,
    setPage,
    totalPages,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    loading,
    error,
    refetch,
    updateOrderStatus,
    removeOrder,
  } = useOrders({ pageSize: PAGE_SIZE });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setToast({
      type: 'success',
      message: `Đã cập nhật trạng thái đơn #${orderId} thành "${ORDER_STATUS[newStatus]?.label}".`,
    });
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${order.id}"?`)) return;
    try {
      await removeOrder(order.id);
      setToast({ type: 'success', message: `Đã xóa đơn hàng ${order.id}.` });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Lỗi khi xóa đơn hàng' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Đơn hàng</h2>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi, cập nhật tiến độ và xử lý {formatNumber(total)} đơn hàng trong hệ thống.
          </p>
        </div>
      </div>

      {/* Tabs lọc trạng thái */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              statusFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {/* Search bar & Refresh */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:px-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã đơn, tên hoặc SĐT..."
              className="input pr-9 pl-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="btn btn-secondary sm:ml-auto"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Nội dung danh sách đơn hàng */}
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4 sm:px-6">
                <div className="h-10 w-24 rounded bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-20 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <PackageSearch className="h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-900">Không có đơn hàng nào</p>
            <p className="mt-1 text-sm text-slate-500">
              {search ? `Không tìm thấy kết quả phù hợp với "${search}".` : 'Chưa có đơn hàng trong mục này.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {orders.map((o) => (
                <li key={o.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-600">{o.id}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{o.customer?.name}</p>
                    <p className="text-xs text-slate-500">{o.customer?.phone}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-slate-500">{o.totalQuantity} món ({o.paymentMethod})</span>
                    <span className="font-bold text-slate-900">{formatUSD(o.totalAmount)}</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="btn btn-secondary px-3 py-1.5 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" /> Chi tiết
                    </button>
                    <button
                      onClick={() => handleDelete(o)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop View */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Mã đơn</th>
                    <th className="px-6 py-3">Khách hàng</th>
                    <th className="px-6 py-3">Số lượng</th>
                    <th className="px-6 py-3 text-right">Tổng tiền</th>
                    <th className="px-6 py-3">Thanh toán</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Ngày đặt</th>
                    <th className="px-6 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-indigo-600 whitespace-nowrap">
                        {o.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{o.customer?.name}</div>
                        <div className="text-xs text-slate-500">{o.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {o.totalQuantity} món
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatUSD(o.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs">
                        {o.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(o)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Xóa đơn"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!error && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            disabled={loading}
          />
        )}
      </div>

      <OrderDetailModal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

