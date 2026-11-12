import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login, logout, selectAuth } from '@/store/authSlice';

/**
 * Hook bọc Redux auth để component không phụ thuộc trực tiếp vào store.
 */
export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector(selectAuth);

  return {
    user,
    isAuthenticated: Boolean(token),
    loading: status === 'loading',
    error,
    // unwrap() -> ném lỗi nếu thunk bị reject, tiện cho try/catch
    login: useCallback((credentials) => dispatch(login(credentials)).unwrap(), [dispatch]),
    logout: useCallback(() => dispatch(logout()).unwrap(), [dispatch]),
    clearError: useCallback(() => dispatch(clearAuthError()), [dispatch]),
  };
}

