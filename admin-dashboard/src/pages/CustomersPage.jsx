import { useState, useCallback } from 'react';
import { Mail, MapPin, Phone, Plus, RefreshCw, Search, Trash2, UserCheck, Users, X } from 'lucide-react';
import useCustomers from '@/hooks/useCustomers';
import CustomerFormModal from '@/components/customers/CustomerFormModal';
import Pagination from '@/components/common/Pagination';
import Toast from '@/components/common/Toast';
import { formatNumber, getInitials } from '@/utils/format';

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const {
    customers,
    total,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    loading,
    error,
    refetch,
    addCustomer,
    removeCustomer,
  } = useCustomers({ pageSize: PAGE_SIZE });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const handleCreate = async (values) => {
    const newCustomer = await addCustomer(values);
    setToast({
      type: 'success',
      message: `Đã thêm khách hàng "${newCustomer.firstName} ${newCustomer.lastName}" thành công.`,
    });
  };

  const handleDelete = async (customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${fullName}"?`)) return;
    try {
      await removeCustomer(customer);
      setToast({ type: 'success', message: `Đã xóa khách hàng ${fullName}.` });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Lỗi khi xóa khách hàng' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút thêm mới */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Khách hàng</h2>
          <p className="mt-1 text-sm text-slate-500">
            Danh bạ lưu trữ thông tin {formatNumber(total)} khách hàng và đối tác dịch vụ.
          </p>
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm khách hàng
        </button>
      </div>

      <div className="card overflow-hidden">
        {/* Search & Refresh */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:px-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên khách hàng..."
              className="input pr-9 pl-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="btn btn-secondary sm:ml-auto"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Nội dung */}
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4 sm:px-6">
                <div className="h-11 w-11 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600">{error}</div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Users className="h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-900">Không tìm thấy khách hàng nào</p>
            <p className="mt-1 text-sm text-slate-500">
              {search ? `Không có kết quả nào cho "${search}".` : 'Chưa có thông tin khách hàng.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {customers.map((c) => {
                const fullName = `${c.firstName} ${c.lastName}`;
                return (
                  <li key={c.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={fullName}
                          className="h-11 w-11 rounded-full bg-slate-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                          {getInitials(fullName)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-slate-900">{fullName}</p>
                          {c.isLocal && (
                            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                              Mới
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-slate-500">{c.email}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(c)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-slate-600 pl-14">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{c.phone || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{c.address?.city || c.address?.address || 'Việt Nam'}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Khách hàng</th>
                    <th className="px-6 py-3">Số điện thoại</th>
                    <th className="px-6 py-3">Địa chỉ / Khu vực</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => {
                    const fullName = `${c.firstName} ${c.lastName}`;
                    return (
                      <tr key={c.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {c.image ? (
                              <img
                                src={c.image}
                                alt={fullName}
                                className="h-10 w-10 shrink-0 rounded-full bg-slate-100 object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                {getInitials(fullName)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">
                                {fullName}
                                {c.isLocal && (
                                  <span className="ml-2 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                                    Mới
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-slate-500 truncate">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                          {c.phone || '—'}
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                          {c.address?.city ? `${c.address.city}, ` : ''}{c.address?.address || 'Việt Nam'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Đang hoạt động
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(c)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Xóa khách hàng"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
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

      <CustomerFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

