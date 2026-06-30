'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { cartApi } from '@/lib/api/cart';
import { useCartStore } from '@/lib/store/cartStore';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [qty, setQty] = useState(1);
  const queryClient = useQueryClient();
  const setItemCount = useCartStore((s) => s.setItemCount);
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
  });

  const addToCart = useMutation({
    mutationFn: () => cartApi.addItem(id, qty),
    onSuccess: (cart) => {
      const count = cart.items.reduce((s, i) => s + i.quantity, 0);
      setItemCount(count);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast(`Added ${qty} × "${product?.name}" to cart`, 'success');
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Product not found.</p>
        <Link href="/products" className="mt-4 inline-block text-primary-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const outOfStock = product.stockQuantity === 0;
  const maxQty = Math.min(product.stockQuantity, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square bg-neutral-50">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col gap-5">
            {product.category && (
              <Badge variant="neutral">{product.category.name}</Badge>
            )}

            <div>
              <h1 className="text-2xl font-bold text-neutral-900 leading-snug">{product.name}</h1>
              <p className="text-3xl font-extrabold text-neutral-900 mt-3">
                {formatCurrency(product.price)}
              </p>
            </div>

            {product.description && (
              <p className="text-neutral-600 text-sm leading-relaxed">{product.description}</p>
            )}

            {/* Stock */}
            <div>
              {outOfStock ? (
                <Badge variant="danger">Out of Stock</Badge>
              ) : product.stockQuantity <= 5 ? (
                <span className="text-sm font-medium text-warning">
                  Only {product.stockQuantity} left in stock
                </span>
              ) : (
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              )}
            </div>

            {/* Quantity */}
            {!outOfStock && (
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                    disabled={qty <= 1}
                    aria-label="Decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-neutral-900">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="w-9 h-9 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                    disabled={qty >= maxQty}
                    aria-label="Increase"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <Button
              size="lg"
              leftIcon={<ShoppingCart className="w-5 h-5" />}
              isLoading={addToCart.isPending}
              disabled={outOfStock}
              onClick={() => addToCart.mutate()}
              className="mt-2"
            >
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
