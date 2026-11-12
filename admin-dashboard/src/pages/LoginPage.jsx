import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BarChart3, CircleAlert, Eye, EyeOff, LoaderCircle, Lock, Mail, ShieldCheck, Store, Zap } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { DEMO_ACCOUNT } from '@/services/authService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FEATURES = [
  { icon: BarChart3, text: 'Theo dõi doanh thu & đơn hàng theo thời gian thực' },
  { icon: Zap, text: 'Quản lý sản phẩm, dịch vụ nhanh chóng' },
  { icon: ShieldCheck, text: 'Phân quyền & bảo mật dữ liệu' },
];

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onTouched', // validate khi rời khỏi ô input, sau đó validate theo từng lần gõ
    defaultValues: { email: '', password: '' },
  });

  // Xóa lỗi đăng nhập cũ khi vào trang
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (values) => {
    try {
      await login(values);
      // Thành công: GuestRoute sẽ tự chuyển hướng vào Dashboard (hoặc trang trước đó)
    } catch {
      // Lỗi đã được lưu trong Redux (state.auth.error) và hiển thị bên dưới
    }
  };

  const fillDemoAccount = () => {
    setValue('email', DEMO_ACCOUNT.email, { shouldValidate: true });
    setValue('password', DEMO_ACCOUNT.password, { shouldValidate: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ===== Cột trái: Giới thiệu (ẩn trên mobile) ===== */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Store className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">SalesHub</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl leading-tight font-bold">Hệ thống quản lý bán hàng & dịch vụ</h2>
          <p className="mt-4 text-indigo-100">
            Một nơi duy nhất để quản lý sản phẩm, đơn hàng và khách hàng của bạn.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-indigo-50">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-indigo-200">© {new Date().getFullYear()} SalesHub. All rights reserved.</p>
      </div>

      {/* ===== Cột phải: Form đăng nhập ===== */}
      <div className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          {/* Logo cho mobile */}
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">SalesHub</span>
          </div>

          <div className="card p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Đăng nhập</h1>
              <p className="mt-1 text-sm text-slate-500">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                    {...register('email', {
                      required: 'Vui lòng nhập email',
                      pattern: { value: EMAIL_PATTERN, message: 'Email không đúng định dạng' },
                    })}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    className={`input px-10 ${errors.password ? 'input-error' : ''}`}
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            {/* Gợi ý tài khoản demo */}
            <div className="mt-6 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 p-3 text-sm">
              <p className="font-medium text-indigo-900">Tài khoản demo</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-indigo-700">
                <span>
                  {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
                </span>
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
                >
                  Điền tự động
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

