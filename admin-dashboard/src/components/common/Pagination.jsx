import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, total, pageSize, onPageChange, disabled }) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:px-6">
      <p className="text-sm text-slate-500">
        Hiển thị <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> trên{' '}
        <span className="font-medium text-slate-700">{total}</span> kết quả
      </p>

      <div className="flex items-center gap-2">
        <button
          className="btn btn-secondary px-3 py-2"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>
        <span className="min-w-20 text-center text-sm text-slate-600">
          {page} / {totalPages}
        </span>
        <button
          className="btn btn-secondary px-3 py-2"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Trang sau"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

