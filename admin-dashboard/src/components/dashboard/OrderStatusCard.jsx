import { ORDER_STATUS } from '@/constants';
import { formatNumber } from '@/utils/format';

export default function OrderStatusCard({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-900">Trạng thái đơn hàng</h3>
      <p className="text-sm text-slate-500">Tháng này</p>

      <ul className="mt-6 space-y-5">
        {data.map((item) => {
          const percent = Math.round((item.count / total) * 100);
          return (
            <li key={item.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-slate-500">
                  {formatNumber(item.count)} <span className="text-slate-400">({percent}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${ORDER_STATUS[item.key]?.bar ?? 'bg-slate-400'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

