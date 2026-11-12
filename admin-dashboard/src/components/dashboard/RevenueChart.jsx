export default function RevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card p-5">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">Doanh thu 7 ngày qua</h3>
          <p className="text-sm text-slate-500">Đơn vị: triệu đồng</p>
        </div>
        <p className="text-sm text-slate-500">
          Tổng: <span className="font-semibold text-slate-900">{total} tr</span>
        </p>
      </div>

      {/* Biểu đồ cột đơn giản bằng Tailwind (không cần thư viện chart) */}
      <div className="flex h-56 items-stretch gap-2 sm:gap-4">
        {data.map((d) => (
          <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-slate-600 opacity-0 transition group-hover:opacity-100">
              {d.value}
            </span>
            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className="w-full max-w-12 rounded-t-lg bg-indigo-500/80 transition-all group-hover:bg-indigo-600"
                style={{ height: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

