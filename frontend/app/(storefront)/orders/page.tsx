'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.list,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          title="No orders yet"
          description="Once you place an order, it will appear here."
          action={{ label: 'Start shopping', onClick: () => window.location.href = '/products' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Orders</h1>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-center gap-4 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <OrderStatusBadge status={order.status} />
                <span className="text-xs text-neutral-400">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                <span className="font-semibold text-neutral-900">{formatCurrency(order.totalAmount)}</span>
              </p>
              {order.createdAt && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
