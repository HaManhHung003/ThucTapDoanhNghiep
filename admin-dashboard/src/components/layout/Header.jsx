import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, UserRound } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useClickOutside from '@/hooks/useClickOutside';
import { NAV_ITEMS } from '@/constants';
import { getInitials } from '@/utils/format';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

  const currentPage = NAV_ITEMS.find((item) => item.to === pathname)?.label ?? 'Trang quản trị';

  // Sau khi logout, token bị xóa -> ProtectedRoute tự chuyển về /login
  const handleLogout = () => logout();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Mở menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{currentPage}</h1>

      <div className="ml-auto flex items-center gap-1 sm:gap-3">
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Thông báo"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
              {getInitials(user?.name)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm leading-tight font-medium text-slate-900">{user?.name}</span>
              <span className="block text-xs leading-tight text-slate-500">{user?.role}</span>
            </span>
            <ChevronDown
              className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                <UserRound className="h-4 w-4" /> Hồ sơ cá nhân
              </button>
              <button
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
