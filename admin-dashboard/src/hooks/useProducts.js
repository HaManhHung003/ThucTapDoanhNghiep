import { useCallback, useEffect, useState } from 'react';
import productService from '@/services/productService';
import useDebounce from './useDebounce';

/**
 * Quản lý toàn bộ logic dữ liệu của trang Sản phẩm:
 * tải danh sách, tìm kiếm (debounce), phân trang, thêm & xóa.
 */
export default function useProducts({ pageSize = 10 } = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebounce(search.trim(), 400);

  // Khi từ khóa thay đổi -> quay về trang 1 (điều chỉnh state ngay trong render, tránh gọi API 2 lần)
  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (prevSearch !== debouncedSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    productService
      .getAll(
        { q: debouncedSearch, limit: pageSize, skip: (page - 1) * pageSize },
        { signal: controller.signal },
      )
      .then((data) => {
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Hủy request cũ nếu người dùng đổi trang / từ khóa quá nhanh
    return () => controller.abort();
  }, [debouncedSearch, page, pageSize, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  const addProduct = useCallback(async (payload) => {
    const created = await productService.create(payload);
    // API giả lập luôn trả cùng 1 id => tự tạo id duy nhất ở client
    const newItem = { ...created, id: Date.now(), isLocal: true };
    setProducts((prev) => [newItem, ...prev]);
    setTotal((t) => t + 1);
    return newItem;
  }, []);

  const removeProduct = useCallback(async (product) => {
    // Sản phẩm vừa tạo ở client không tồn tại trên server -> chỉ xóa local
    if (!product.isLocal) {
      await productService.remove(product.id);
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setTotal((t) => Math.max(0, t - 1));
  }, []);

  return {
    products,
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
    addProduct,
    removeProduct,
  };
}

