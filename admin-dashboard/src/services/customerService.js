import axiosClient from './axiosClient';

/**
 * Customer Service - sử dụng API DummyJSON (/users)
 */
const customerService = {
  getAll({ q = '', limit = 10, skip = 0 } = {}, config = {}) {
    const url = q ? '/users/search' : '/users';
    return axiosClient.get(url, {
      ...config,
      params: { q: q || undefined, limit, skip },
    });
  },

  getById(id) {
    return axiosClient.get(`/users/${id}`);
  },

  create(data) {
    return axiosClient.post('/users/add', data);
  },

  update(id, data) {
    return axiosClient.put(`/users/${id}`, data);
  },

  remove(id) {
    return axiosClient.delete(`/users/${id}`);
  },
};

export default customerService;

