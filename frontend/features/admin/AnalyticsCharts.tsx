'use client';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { AnalyticsDashboard } from '@/types';

interface AnalyticsChartsProps {
  data: AnalyticsDashboard;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#f59e0b' },
  processing: { label: 'Processing', color: '#3b82f6' },
  shipped: { label: 'Shipped', color: '#2b8bff' },
  delivered: { label: 'Delivered', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function OrdersByStatusChart({ data }: AnalyticsChartsProps) {
  const chartData = STATUS_ORDER.filter((s) => s in data.ordersByStatus).map((status) => ({
    status: STATUS_META[status]?.label ?? status,
    count: data.ordersByStatus[status as keyof typeof data.ordersByStatus] ?? 0,
    color: STATUS_META[status]?.color ?? '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          formatter={(v) => [Number(v ?? 0), 'Orders']}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopProductsTable({ data }: AnalyticsChartsProps) {
  const top = data.topProducts.slice(0, 8);
  const max = Math.max(1, ...top.map((p) => p.totalRevenue));

  if (!top.length) {
    return <p className="py-8 text-center text-sm text-neutral-400">No sales yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {top.map((p, i) => (
        <li key={p._id} className="flex items-center gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-medium text-neutral-800">{p.name}</p>
              <p className="shrink-0 text-sm font-semibold text-neutral-900">{formatCurrency(p.totalRevenue)}</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-primary-500"
                  style={{ width: `${Math.max(6, (p.totalRevenue / max) * 100)}%` }}
                />
              </div>
              <span className="shrink-0 text-xs text-neutral-400">{p.totalQuantity} sold</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
