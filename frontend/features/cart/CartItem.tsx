'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { CartItem as CartItemType } from '@/types';
import { useCart } from './hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { update, remove } = useCart();
  const { toast } = useToast();
  const product = item.productId;

  const handleQtyChange = (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    update.mutate(
      { productId: product._id, quantity: newQty },
      { onError: (e: Error) => toast(e.message, 'error') },
    );
  };

  const handleRemove = () => {
    remove.mutate(product._id, {
      onSuccess: () => toast('Item removed from cart', 'info'),
      onError: (e: Error) => toast(e.message, 'error'),
    });
  };

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-100 last:border-0">
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-50 shrink-0 relative">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">{product.name}</p>
        {product.category && (
          <p className="text-xs text-neutral-500">{product.category.name}</p>
        )}
        <p className="text-sm font-bold text-primary-600 mt-1">{formatCurrency(product.price)}</p>
      </div>

      {/* Quantity + Remove */}
      <div className="flex flex-col items-end justify-between gap-2 shrink-0">
        <button
          onClick={handleRemove}
          disabled={remove.isPending}
          className="text-neutral-400 hover:text-danger transition-colors disabled:opacity-50"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
          <button
            onClick={() => handleQtyChange(-1)}
            disabled={item.quantity <= 1 || update.isPending}
            className="p-1.5 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQtyChange(1)}
            disabled={item.quantity >= product.stockQuantity || update.isPending}
            className="p-1.5 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm font-semibold text-neutral-800">
          {formatCurrency(product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
