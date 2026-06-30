'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Package } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { OrdersByStatusChart, TopProductsTable } from '@/features/admin/AnalyticsCharts';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function KpiCard({
  title,
  value,
  icon: Icon,
  sub,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-neutral-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 30_000,
  });

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalOrders = Object.values(data.ordersByStatus).reduce((s, v) => s + (v ?? 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(data.totalSales)}
          icon={TrendingUp}
          sub="Excluding cancelled orders"
        />
        <KpiCard
          title="Total Orders"
          value={String(totalOrders)}
          icon={ShoppingBag}
        />
        <KpiCard
          title="Top Products"
          value={String(data.topProducts.length)}
          icon={Package}
          sub="By revenue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Orders by Status</h2>
          <OrdersByStatusChart data={data} />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Top Products</h2>
          <TopProductsTable data={data} />
        </div>
      </div>
    </div>
  );
}
