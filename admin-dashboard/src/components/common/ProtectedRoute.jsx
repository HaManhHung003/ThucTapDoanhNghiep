import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '@/store/authSlice';

/**
 * Chặn truy cập nếu chưa đăng nhập -> chuyển về /login,
 * đồng thời lưu lại trang đang muốn vào để quay lại sau khi đăng nhập.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

