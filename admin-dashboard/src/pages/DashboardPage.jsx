import { useEffect, useState } from 'react';
import { Package, ShoppingCart, UserPlus, Wallet } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import OrderStatusCard from '@/components/dashboard/OrderStatusCard';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import useAuth from '@/hooks/useAuth';
import dashboardService from '@/services/dashboardService';
import { formatNumber, formatVND } from '@/utils/format';

const STAT_CONFIG = [
  { key: 'revenue', title: 'Tổng doanh thu', icon: Wallet, color: 'indigo', format: formatVND },
  { key: 'orders', title: 'Tổng đơn hàng', icon: ShoppingCart, color: 'emerald', format: formatNumber },
  { key: 'customers', title: 'Khách hàng mới', icon: UserPlus, color: 'amber', format: formatNumber },
  { key: 'products', title: 'Sản phẩm / Dịch vụ', icon: Package, color: 'rose', format: formatNumber },
];

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-200/70" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl bg-slate-200/70 lg:col-span-2" />
        <div className="h-80 rounded-2xl bg-slate-200/70" />
      </div>
      <div className="h-72 rounded-2xl bg-slate-200/70" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let ignore = false;
    dashboardService.getSummary().then((data) => {
      if (!ignore) setSummary(data);
    });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Xin chào, {user?.name?.split(' ').pop()} 👋
        </h2>
        <p className="mt-1 text-sm text-slate-500">Đây là tình hình kinh doanh của cửa hàng hôm nay.</p>
      </div>

      {!summary ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Thẻ thống kê: 1 cột (mobile) → 2 cột (tablet) → 4 cột (desktop) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STAT_CONFIG.map(({ key, format, ...rest }) => (
              <StatCard
                key={key}
                {...rest}
                value={format(summary.stats[key].value)}
                change={summary.stats[key].change}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart data={summary.revenueByDay} />
            </div>
            <OrderStatusCard data={summary.orderStatus} />
          </div>

          <RecentOrdersTable orders={summary.recentOrders} />
        </>
      )}
    </div>
  );
}

