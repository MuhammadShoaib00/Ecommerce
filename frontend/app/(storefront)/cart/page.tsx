'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cartApi } from '@/lib/api/cart';
import { useCartStore } from '@/lib/store/cartStore';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { CartItem } from '@/types';

export default function CartPage() {
  const queryClient = useQueryClient();
  const setItemCount = useCartStore((s) => s.setItemCount);
  const { toast } = useToast();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
  });

  const invalidate = (cart: { items: CartItem[] }) => {
    const count = cart.items.reduce((s, i) => s + i.quantity, 0);
    setItemCount(count);
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  const update = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItem(productId, quantity),
    onSuccess: invalidate,
    onError: (err: Error) => toast(err.message, 'error'),
  });

  const remove = useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: invalidate,
    onError: (err: Error) => toast(err.message, 'error'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Add some products to get started."
          action={{ label: 'Browse products', onClick: () => window.location.href = '/products' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Items */}
        <div className="flex-1 bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
          {items.map((item) => {
            const product = item.productId;
            const lineTotal = product.price * item.quantity;

            return (
              <div key={product._id} className="flex gap-4 p-4">
                <div className="relative w-20 h-20 rounded-xl bg-neutral-50 overflow-hidden shrink-0">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <Link href={`/products/${product._id}`} className="text-sm font-semibold text-neutral-900 hover:text-primary-600 line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-sm text-neutral-500">{formatCurrency(product.price)} each</p>

                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => update.mutate({ productId: product._id, quantity: item.quantity - 1 })}
                      disabled={item.quantity <= 1 || update.isPending}
                      className="w-7 h-7 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => update.mutate({ productId: product._id, quantity: item.quantity + 1 })}
                      disabled={item.quantity >= product.stockQuantity || update.isPending}
                      className="w-7 h-7 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => remove.mutate(product._id)}
                      disabled={remove.isPending}
                      className="ml-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-neutral-900">{formatCurrency(lineTotal)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-neutral-900">Order Summary</h2>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="border-t border-neutral-100 pt-4 flex justify-between font-bold text-neutral-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/products" className="text-center text-sm text-primary-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
