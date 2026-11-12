import { ImageOff, LoaderCircle, Star, Trash2 } from 'lucide-react';
import { formatUSD } from '@/utils/format';

function Thumbnail({ src, alt }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className="h-11 w-11 shrink-0 rounded-lg bg-slate-100 object-cover" />
  ) : (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
      <ImageOff className="h-5 w-5" />
    </div>
  );
}

function StockBadge({ stock }) {
  const className =
    stock === 0
      ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
      : stock < 10
        ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
        : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  const label = stock === 0 ? 'Hết hàng' : `${stock} sp`;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${className}`}>
      {label}
    </span>
  );
}

function DeleteButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
      aria-label="Xóa"
      title="Xóa"
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}

/**
 * Responsive:
 *  - Mobile (< md): hiển thị dạng danh sách thẻ (card)
 *  - Desktop (>= md): hiển thị dạng bảng
 */
export default function ProductTable({ products, onDelete, deletingId }) {
  return (
    <>
      {/* ===== Mobile: Card list ===== */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-4 py-3">
            <Thumbnail src={p.thumbnail} alt={p.title} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{p.title}</p>
              <p className="truncate text-xs text-slate-500 capitalize">
                {p.category}
                {p.brand ? ` · ${p.brand}` : ''}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{formatUSD(p.price)}</span>
                <StockBadge stock={p.stock} />
              </div>
            </div>
            <DeleteButton onClick={() => onDelete(p)} loading={deletingId === p.id} />
          </li>
        ))}
      </ul>

      {/* ===== Desktop: Table ===== */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3">Sản phẩm</th>
              <th className="px-6 py-3">Danh mục</th>
              <th className="px-6 py-3 text-right">Giá</th>
              <th className="px-6 py-3">Tồn kho</th>
              <th className="px-6 py-3">Đánh giá</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Thumbnail src={p.thumbnail} alt={p.title} />
                    <div className="min-w-0">
                      <p className="max-w-xs truncate font-medium text-slate-900">
                        {p.title}
                        {p.isLocal && (
                          <span className="ml-2 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 uppercase">
                            Mới
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{p.brand || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-slate-600 capitalize">{p.category}</td>
                <td className="px-6 py-3 text-right font-medium whitespace-nowrap text-slate-900">
                  {formatUSD(p.price)}
                </td>
                <td className="px-6 py-3">
                  <StockBadge stock={p.stock} />
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {p.rating ? (
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {p.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <DeleteButton onClick={() => onDelete(p)} loading={deletingId === p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

