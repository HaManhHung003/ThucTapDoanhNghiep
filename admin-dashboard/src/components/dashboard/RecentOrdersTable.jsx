import { Link } from 'react-router-dom';
import StatusBadge from '@/components/common/StatusBadge';
import { formatDate, formatVND } from '@/utils/format';

export default function RecentOrdersTable({ orders }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Đơn hàng gần đây</h3>
          <p className="text-sm text-slate-500">{orders.length} đơn hàng mới nhất</p>
        </div>
        <Link to="/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Xem tất cả
        </Link>
      </div>

      {/* overflow-x-auto: cho phép vuốt ngang bảng trên màn hình nhỏ */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3">Mã đơn</th>
              <th className="px-5 py-3">Khách hàng</th>
              <th className="px-5 py-3">Sản phẩm / Dịch vụ</th>
              <th className="px-5 py-3 text-right">Giá trị</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3.5 font-medium whitespace-nowrap text-indigo-600">{order.id}</td>
                <td className="px-5 py-3.5 whitespace-nowrap text-slate-900">{order.customer}</td>
                <td className="px-5 py-3.5 text-slate-600">{order.item}</td>
                <td className="px-5 py-3.5 text-right font-medium whitespace-nowrap text-slate-900">
                  {formatVND(order.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{formatDate(order.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

