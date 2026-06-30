'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () => adminApi.listOrders(statusFilter || undefined),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast('Order status updated', 'success');
    },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
        <div className="w-44">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : !orders?.length ? (
        <EmptyState title="No orders" description="No orders match the selected filter." />
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-500">Items</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-500">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-neutral-50 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-600">{order.items.length}</td>
                    <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus.mutate({ id: order._id, status: e.target.value as OrderStatus })
                        }
                        className="text-xs py-1 min-w-[120px]"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
