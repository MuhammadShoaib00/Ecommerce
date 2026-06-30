'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Receipt, Clock } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { OrdersByStatusChart, TopProductsTable } from '@/features/admin/AnalyticsCharts';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

function KpiCard({
  title,
  value,
  icon: Icon,
  sub,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5">
      <span className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <div className="flex items-center gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${accent} bg-opacity-10`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</p>
          <p className="mt-0.5 truncate text-2xl font-bold text-neutral-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
        </div>
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

  const statusTotal = Object.values(data.ordersByStatus).reduce((s, v) => s + (v ?? 0), 0);
  const totalOrders = data.totalOrders || statusTotal;
  const avgOrder = totalOrders ? Math.round(data.totalSales / totalOrders) : 0;
  const needsAction = (data.ordersByStatus.pending ?? 0) + (data.ordersByStatus.processing ?? 0);

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1 rounded-2xl bg-gradient-to-r from-primary-700 to-primary-600 p-6 text-white">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-300" />
          <span className="text-xs font-medium uppercase tracking-wide text-primary-100">Live · refreshes every 30s</span>
        </div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-primary-100">An overview of sales, orders, and your best-selling products.</p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Revenue" value={formatCurrency(data.totalSales)} icon={TrendingUp} sub="Excluding cancelled" accent="bg-primary-600" />
        <KpiCard title="Total Orders" value={String(totalOrders)} icon={ShoppingBag} accent="bg-emerald-500" />
        <KpiCard title="Avg Order Value" value={formatCurrency(avgOrder)} icon={Receipt} accent="bg-violet-500" />
        <KpiCard title="Needs Action" value={String(needsAction)} icon={Clock} sub="Pending + processing" accent="bg-amber-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-neutral-800">Orders by Status</h2>
          <p className="mb-4 text-xs text-neutral-400">Distribution across the order lifecycle</p>
          <OrdersByStatusChart data={data} />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-neutral-800">Top Products</h2>
          <p className="mb-4 text-xs text-neutral-400">By revenue</p>
          <TopProductsTable data={data} />
        </div>
      </div>
    </div>
  );
}
