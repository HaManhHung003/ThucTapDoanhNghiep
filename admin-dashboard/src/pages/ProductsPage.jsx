import { useCallback, useState } from 'react';
import { PackageSearch, Plus, RefreshCw, Search, TriangleAlert, X } from 'lucide-react';
import useProducts from '@/hooks/useProducts';
import ProductTable from '@/components/products/ProductTable';
import ProductFormModal from '@/components/products/ProductFormModal';
import Pagination from '@/components/common/Pagination';
import Toast from '@/components/common/Toast';
import { formatNumber } from '@/utils/format';

const PAGE_SIZE = 10;

function TableSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4 sm:px-6">
          <div className="h-11 w-11 rounded-lg bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-slate-200" />
            <div className="h-3 w-1/5 rounded bg-slate-100" />
          </div>
          <div className="hidden h-3.5 w-16 rounded bg-slate-200 sm:block" />
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const {
    products,
    total,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    loading,
    error,
    refetch,
    addProduct,
    removeProduct,
  } = useProducts({ pageSize: PAGE_SIZE });

  const [isFormOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const closeToast = useCallback(() => setToast(null), []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const handleCreate = async (data) => {
    const item = await addProduct(data);
    setToast({ type: 'success', message: `Đã thêm "${item.title}" thành công.` });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${product.title}"?`)) return;

    setDeletingId(product.id);
    try {
      await removeProduct(product);
      setToast({ type: 'success', message: `Đã xóa "${product.title}".` });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Tiêu đề + nút Thêm mới ===== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sản phẩm / Dịch vụ</h2>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh sách {formatNumber(total)} sản phẩm và dịch vụ của cửa hàng.
          </p>
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm mới
        </button>
      </div>

      <div className="card overflow-hidden">
        {/* ===== Thanh công cụ: tìm kiếm ===== */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:px-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên sản phẩm..."
              className="input pr-9 pl-10 [&::-webkit-search-cancel-button]:hidden"
              aria-label="Tìm kiếm sản phẩm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Xóa từ khóa"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="btn btn-secondary sm:ml-auto"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* ===== Nội dung bảng ===== */}
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <TriangleAlert className="h-10 w-10 text-rose-400" />
            <p className="mt-3 font-medium text-slate-900">Không thể tải dữ liệu</p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <button onClick={refetch} className="btn btn-secondary mt-5">
              <RefreshCw className="h-4 w-4" /> Thử lại
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <PackageSearch className="h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-900">Không tìm thấy sản phẩm</p>
            <p className="mt-1 text-sm text-slate-500">
              {search ? `Không có kết quả cho "${search}".` : 'Chưa có sản phẩm nào.'}
            </p>
          </div>
        ) : (
          <ProductTable products={products} onDelete={handleDelete} deletingId={deletingId} />
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

      <ProductFormModal open={isFormOpen} onClose={closeForm} onSubmit={handleCreate} />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

