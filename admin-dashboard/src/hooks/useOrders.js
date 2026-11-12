import { useCallback, useEffect, useState } from 'react';
import orderService from '@/services/orderService';
import useDebounce from './useDebounce';

export default function useOrders({ pageSize = 8 } = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebounce(search.trim(), 400);

  // Reset trang về 1 khi đổi bộ lọc hoặc search
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    orderService
      .getAll({
        status: statusFilter,
        search: debouncedSearch,
        limit: pageSize,
        page,
      })
      .then((data) => {
        if (!ignore) {
          setOrders(data.orders);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Lỗi tải danh sách đơn hàng');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, statusFilter, page, pageSize, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    const updated = await orderService.updateStatus(orderId, newStatus);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    return updated;
  }, []);

  const removeOrder = useCallback(async (orderId) => {
    await orderService.remove(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setTotal((t) => Math.max(0, t - 1));
  }, []);

  return {
    orders,
    total,
    page,
    setPage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    loading,
    error,
    refetch,
    updateOrderStatus,
    removeOrder,
  };
}

