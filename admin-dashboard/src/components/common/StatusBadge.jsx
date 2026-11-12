import { ORDER_STATUS } from '@/constants';

export default function StatusBadge({ status }) {
  const config = ORDER_STATUS[status] ?? { label: status, className: 'bg-slate-50 text-slate-700 ring-slate-600/20' };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}

