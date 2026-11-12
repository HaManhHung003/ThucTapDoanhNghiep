import { useState } from 'react';
import { Calendar, CreditCard, Mail, MapPin, Package, Phone, User } from 'lucide-react';
import Modal from '@/components/common/Modal';
import StatusBadge from '@/components/common/StatusBadge';
import { ORDER_STATUS } from '@/constants';
import { formatDate, formatUSD } from '@/utils/format';

export default function OrderDetailModal({ open, onClose, order, onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await onStatusChange(order.id, selectedStatus);
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Chi tiết đơn hàng #${order.id}`}
      description={`Ngày đặt: ${formatDate(order.createdAt)}`}
    >
      <div className="space-y-6">
        {/* Thông tin khách hàng & Giao nhận */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Thông tin giao hàng
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <span className="font-medium text-slate-900">{order.customer?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{order.customer?.phone}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{order.customer?.email}</span>
            </div>
            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>{order.customer?.address}</span>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm trong giỏ */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Package className="h-4 w-4" /> Danh sách sản phẩm ({order.items?.length || 0})
          </h4>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {formatUSD(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 whitespace-nowrap">
                  {formatUSD(item.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thanh toán & Tổng tiền */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-600">
            <CreditCard className="h-4 w-4 text-slate-400" />
            <span>Phương thức:</span>
            <span className="font-medium text-slate-800">{order.paymentMethod}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500">Tổng thanh toán: </span>
            <span className="text-lg font-bold text-indigo-600">
              {formatUSD(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Thay đổi trạng thái đơn hàng */}
        <div className="border-t border-slate-100 pt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cập nhật trạng thái đơn hàng
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {Object.keys(ORDER_STATUS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedStatus(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedStatus === key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ORDER_STATUS[key]?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={updating}>
            Đóng
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={updating || selectedStatus === order.status}
          >
            {updating ? 'Đang cập nhật...' : 'Lưu trạng thái'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

