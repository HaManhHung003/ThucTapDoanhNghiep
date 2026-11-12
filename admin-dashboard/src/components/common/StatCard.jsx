import { TrendingDown, TrendingUp } from 'lucide-react';

const COLORS = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

export default function StatCard({ title, value, change, icon: Icon, color = 'indigo' }) {
  const hasChange = typeof change === 'number';
  const isUp = change >= 0;

  return (
    <div className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${COLORS[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-sm">
        {hasChange ? (
          <>
            <span
              className={`inline-flex items-center gap-1 font-medium ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isUp ? '+' : ''}
              {change}%
            </span>
            <span className="text-slate-500">so với tháng trước</span>
          </>
        ) : (
          <span className="text-slate-500">Dữ liệu trực tiếp từ API</span>
        )}
      </div>
    </div>
  );
}

