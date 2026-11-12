import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '@/store/authSlice';

/**
 * Dành cho trang Login: nếu đã đăng nhập thì chuyển hướng vào trong
 * (về trang trước đó người dùng muốn vào, mặc định là Dashboard).
 */
export default function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}

