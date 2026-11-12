import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-7xl font-extrabold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Không tìm thấy trang</h1>
      <p className="mt-2 text-slate-500">Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.</p>
      <Link to="/" className="btn btn-primary mt-8">
        Quay về trang chủ
      </Link>
    </div>
  );
}

