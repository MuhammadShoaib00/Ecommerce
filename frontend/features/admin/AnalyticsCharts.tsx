'use client';

import {
  BarChart,
  Bar,
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

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function OrdersByStatusChart({ data }: AnalyticsChartsProps) {
  const chartData = Object.entries(data.ordersByStatus).map(([status, count]) => ({
    status: STATUS_LABELS[status] ?? status,
    count: count ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          formatter={(v) => [Number(v ?? 0), 'Orders']}
        />
        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopProductsTable({ data }: AnalyticsChartsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100">
            <th className="text-left py-2 pr-4 font-medium text-neutral-500">Product</th>
            <th className="text-right py-2 pr-4 font-medium text-neutral-500">Qty Sold</th>
            <th className="text-right py-2 font-medium text-neutral-500">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.topProducts.map((p, i) => (
            <tr key={p._id} className="border-b border-neutral-50 hover:bg-neutral-50">
              <td className="py-2.5 pr-4 text-neutral-800 font-medium">
                <span className="text-neutral-400 mr-2 text-xs">{i + 1}.</span>
                {p.name}
              </td>
              <td className="py-2.5 pr-4 text-right text-neutral-600">{p.totalQuantity}</td>
              <td className="py-2.5 text-right font-semibold text-neutral-900">
                {formatCurrency(p.totalRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
