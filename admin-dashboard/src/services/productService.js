import axiosClient from './axiosClient';

/**
 * Product Service - gọi API giả lập DummyJSON (https://dummyjson.com/docs/products)
 *
 * Response của danh sách có dạng: { products: [...], total, skip, limit }
 *
 * Lưu ý: DummyJSON là API giả lập => các thao tác POST/PUT/DELETE trả về
 * kết quả "như thật" nhưng KHÔNG lưu vào server.
 */
const SELECT_FIELDS = 'title,brand,category,price,stock,rating,thumbnail';

const productService = {
  getAll({ q = '', limit = 10, skip = 0 } = {}, config = {}) {
    const url = q ? '/products/search' : '/products';
    return axiosClient.get(url, {
      ...config,
      params: { q: q || undefined, limit, skip, select: SELECT_FIELDS },
    });
  },

  getById(id) {
    return axiosClient.get(`/products/${id}`);
  },

  create(data) {
    return axiosClient.post('/products/add', data);
  },

  update(id, data) {
    return axiosClient.put(`/products/${id}`, data);
  },

  remove(id) {
    return axiosClient.delete(`/products/${id}`);
  },
};

export default productService;

