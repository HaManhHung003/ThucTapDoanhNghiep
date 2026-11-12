import { useEffect } from 'react';
import { CircleAlert, CircleCheck, X } from 'lucide-react';

/** Thông báo nhỏ góc màn hình, tự ẩn sau `duration` ms */
export default function Toast({ toast, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const Icon = isError ? CircleAlert : CircleCheck;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96">
      <div
        role="status"
        className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg ${
          isError ? 'border-rose-200' : 'border-emerald-200'
        }`}
      >
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${isError ? 'text-rose-500' : 'text-emerald-500'}`} />
        <p className="flex-1 text-sm text-slate-700">{toast.message}</p>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Đóng">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

