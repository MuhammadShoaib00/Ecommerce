'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Order not found.</p>
        <Link href="/orders" className="mt-3 inline-block text-primary-600 hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All orders
      </Link>

      {/* Confirmation banner */}
      {order.status === 'pending' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3 mb-6">
          <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Order placed successfully!</p>
            <p className="text-sm text-green-700 mt-0.5">
              We&apos;re preparing your order. You&apos;ll receive updates as it progresses.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            {order.createdAt && (
              <p className="text-xs text-neutral-400">
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Items */}
        <div className="divide-y divide-neutral-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center px-5 py-4 text-sm">
              <div>
                <p className="font-medium text-neutral-900">{item.name}</p>
                <p className="text-neutral-400 text-xs mt-0.5">{formatCurrency(item.price)} × {item.quantity}</p>
              </div>
              <p className="font-semibold text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-100 flex flex-col gap-3">
          {order.shippingAddress?.street && (
            <div className="text-sm">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Ship to</p>
              <p className="text-neutral-700">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          )}
          <div className="flex justify-between font-bold text-neutral-900">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/products" className="text-sm text-primary-600 hover:underline">
          Continue shopping →
        </Link>
      </div>
    </div>
  );
}
