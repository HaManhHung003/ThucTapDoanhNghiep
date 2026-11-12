import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Check, KeyRound, Lock, Save, ShieldCheck, Store, User } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import settingsService from '@/services/settingsService';
import Toast from '@/components/common/Toast';

const TABS = [
  { id: 'store', label: 'Hồ sơ Cửa hàng', icon: Store },
  { id: 'account', label: 'Tài khoản & Bảo mật', icon: User },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('store');
  const [toast, setToast] = useState(null);

  const initialSettings = settingsService.get();

  // Form Cửa hàng
  const {
    register: registerStore,
    handleSubmit: handleSubmitStore,
    formState: { isSubmitting: isSubmittingStore },
  } = useForm({
    defaultValues: initialSettings.store,
  });

  // Form Tài khoản & Đổi mật khẩu
  const {
    register: registerAccount,
    handleSubmit: handleSubmitAccount,
    reset: resetAccount,
    watch: watchAccount,
    formState: { errors: accountErrors, isSubmitting: isSubmittingAccount },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // State cấu hình thông báo
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Lưu thông tin Cửa hàng
  const onSaveStore = async (data) => {
    settingsService.save({ ...initialSettings, store: data });
    setToast({ type: 'success', message: 'Đã lưu cấu hình thông tin cửa hàng!' });
  };

  // Lưu thông tin Tài khoản & Mật khẩu
  const onSaveAccount = async (data) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      setToast({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    // Cập nhật session user trong localStorage
    const session = JSON.parse(localStorage.getItem('saleshub_auth_session') || '{}');
    if (session.user) {
      session.user.name = data.name;
      localStorage.setItem('saleshub_auth_session', JSON.stringify(session));
    }
    resetAccount({ ...data, currentPassword: '', newPassword: '', confirmPassword: '' });
    setToast({ type: 'success', message: 'Cập nhật thông tin tài khoản thành công!' });
  };

  // Lưu cài đặt thông báo
  const onSaveNotifications = () => {
    setIsSavingNotifications(true);
    setTimeout(() => {
      settingsService.save({ ...initialSettings, notifications });
      setIsSavingNotifications(false);
      setToast({ type: 'success', message: 'Đã cập nhật tùy chọn thông báo!' });
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Cài đặt hệ thống</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tùy chỉnh thông tin cửa hàng, tài khoản quản trị và thông báo vận hành.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <nav className="flex space-x-4 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                activeTab === id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab 1: Cửa hàng */}
      {activeTab === 'store' && (
        <form onSubmit={handleSubmitStore(onSaveStore)} className="card p-6 space-y-6 max-w-4xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-semibold text-slate-900">Thông tin cửa hàng & Doanh nghiệp</h3>
            <p className="text-sm text-slate-500">Thông tin này sẽ được in trên hóa đơn và phiếu giao nhận.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Tên cửa hàng / Dịch vụ</label>
              <input className="input" {...registerStore('name', { required: true })} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Mã số thuế</label>
              <input className="input" {...registerStore('taxCode')} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email hỗ trợ</label>
              <input type="email" className="input" {...registerStore('email')} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Hotline</label>
              <input className="input" {...registerStore('phone')} />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Địa chỉ kinh doanh</label>
              <input className="input" {...registerStore('address')} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Đơn vị tiền tệ chính</label>
              <select className="input" {...registerStore('currency')}>
                <option value="USD">USD ($) - Đô la Mỹ</option>
                <option value="VND">VND (₫) - Việt Nam Đồng</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Múi giờ hệ thống</label>
              <select className="input" {...registerStore('timezone')}>
                <option value="Asia/Ho_Chi_Minh">(GMT+7) Giờ chuẩn Việt Nam</option>
                <option value="UTC">(GMT+0) Giờ Quốc tế</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="btn btn-primary" disabled={isSubmittingStore}>
              <Save className="h-4 w-4" />
              {isSubmittingStore ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Tài khoản & Mật khẩu */}
      {activeTab === 'account' && (
        <form onSubmit={handleSubmitAccount(onSaveAccount)} className="card p-6 space-y-6 max-w-4xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-semibold text-slate-900">Hồ sơ Quản trị viên</h3>
            <p className="text-sm text-slate-500">Cập nhật thông tin định danh và đổi mật khẩu đăng nhập.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ và tên</label>
              <input className="input" {...registerAccount('name', { required: 'Vui lòng nhập họ tên' })} />
              {accountErrors.name && (
                <p className="mt-1 text-xs text-rose-600">{accountErrors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email tài khoản</label>
              <input
                type="email"
                disabled
                className="input bg-slate-50 text-slate-500 cursor-not-allowed"
                {...registerAccount('email')}
              />
              <p className="mt-1 text-xs text-slate-400">Email dùng để đăng nhập, không thể thay đổi.</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
              <KeyRound className="h-4 w-4 text-indigo-600" /> Đổi mật khẩu
            </h4>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  {...registerAccount('currentPassword')}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  {...registerAccount('newPassword')}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  {...registerAccount('confirmPassword')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="btn btn-primary" disabled={isSubmittingAccount}>
              <Save className="h-4 w-4" />
              {isSubmittingAccount ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Cấu hình thông báo */}
      {activeTab === 'notifications' && (
        <div className="card p-6 space-y-6 max-w-4xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-semibold text-slate-900">Kênh thông báo & Cảnh báo</h3>
            <p className="text-sm text-slate-500">Tùy chọn nhận thông báo khi có phát sinh giao dịch mới.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                key: 'emailOnNewOrder',
                title: 'Thông báo đơn hàng mới qua Email',
                desc: 'Gửi thư thông báo ngay lập tức cho quản trị viên khi khách đặt đơn.',
              },
              {
                key: 'emailOnOutOfStock',
                title: 'Cảnh báo hết hàng / Tồn kho thấp',
                desc: 'Gửi email cảnh báo khi số lượng sản phẩm trong kho giảm xuống dưới 10 món.',
              },
              {
                key: 'emailDailyReport',
                title: 'Báo cáo doanh thu cuối ngày',
                desc: 'Tự động gửi tổng kết đơn hàng và số tiền thu được vào lúc 22:00 mỗi ngày.',
              },
              {
                key: 'soundAlert',
                title: 'Phát âm thanh thông báo trên trình duyệt',
                desc: 'Phát chuông ngắn khi có đơn hàng hoặc hoạt động mới phát sinh.',
              },
              {
                key: 'browserPush',
                title: 'Thông báo đẩy (Web Push)',
                desc: 'Hiển thị thông báo góc màn hình ngay cả khi thu nhỏ trình duyệt.',
              },
            ].map(({ key, title, desc }) => (
              <div key={key} className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-sm font-medium text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications[key] ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSaveNotifications}
              disabled={isSavingNotifications}
            >
              <Save className="h-4 w-4" />
              {isSavingNotifications ? 'Đang lưu...' : 'Lưu tùy chọn thông báo'}
            </button>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

