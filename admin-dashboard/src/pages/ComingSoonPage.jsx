import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

export default function ComingSoonPage({ title }) {
  return (
    <div className="card flex flex-col items-center px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
        <Construction className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Chức năng này đang được phát triển và sẽ sớm ra mắt.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Về trang tổng quan
      </Link>
    </div>
  );
}

