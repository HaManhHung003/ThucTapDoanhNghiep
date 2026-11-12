import axios from 'axios';
import authService from './authService';

/**
 * Axios instance dùng chung cho toàn bộ app.
 * - Tự gắn Bearer token vào header.
 * - Trả thẳng `response.data` để code ở tầng trên gọn hơn.
 * - Chuẩn hóa thông báo lỗi & xử lý 401 (hết phiên đăng nhập).
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Request interceptor =====
axiosClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ===== Response interceptor =====
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Request bị hủy chủ động (AbortController) -> trả nguyên lỗi để nơi gọi bỏ qua
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401) {
      authService.logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Hết thời gian chờ phản hồi từ máy chủ.' : null) ||
      (!error.response ? 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.' : null) ||
      error.message ||
      'Đã có lỗi xảy ra.';

    const normalizedError = new Error(message);
    normalizedError.status = status;
    return Promise.reject(normalizedError);
  },
);

export default axiosClient;

