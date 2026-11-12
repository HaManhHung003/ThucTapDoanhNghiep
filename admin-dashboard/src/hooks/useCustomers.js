import { useCallback, useEffect, useState } from 'react';
import customerService from '@/services/customerService';
import useDebounce from './useDebounce';

export default function useCustomers({ pageSize = 10 } = {}) {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebounce(search.trim(), 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    customerService
      .getAll(
        { q: debouncedSearch, limit: pageSize, skip: (page - 1) * pageSize },
        { signal: controller.signal },
      )
      .then((data) => {
        setCustomers(data.users || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message || 'Lỗi tải danh sách khách hàng');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSearch, page, pageSize, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  const addCustomer = useCallback(async (payload) => {
    const created = await customerService.create(payload);
    const newCustomer = {
      ...created,
      id: Date.now(),
      image: created.image || `https://dummyjson.com/icon/${payload.firstName?.toLowerCase() || 'user'}/128`,
      address: {
        address: payload.address || 'Hồ Chí Minh',
        city: payload.city || 'TP. HCM',
      },
      isLocal: true,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setTotal((t) => t + 1);
    return newCustomer;
  }, []);

  const removeCustomer = useCallback(async (customer) => {
    if (!customer.isLocal) {
      await customerService.remove(customer.id);
    }
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    setTotal((t) => Math.max(0, t - 1));
  }, []);

  return {
    customers,
    total,
    page,
    setPage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    search,
    setSearch,
    loading,
    error,
    refetch,
    addCustomer,
    removeCustomer,
  };
}

