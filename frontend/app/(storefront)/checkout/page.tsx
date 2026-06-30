'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import { cartApi } from '@/lib/api/cart';
import { ordersApi } from '@/lib/api/orders';
import { useCartStore } from '@/lib/store/cartStore';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

const schema = z.object({
  street: z.string().min(5, 'Enter a street address'),
  city: z.string().min(2, 'Enter a city'),
  country: z.string().min(2, 'Enter a country'),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setItemCount = useCartStore((s) => s.setItemCount);
  const { toast } = useToast();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const checkout = useMutation({
    mutationFn: (shippingAddress: FormValues) =>
      ordersApi.checkout(shippingAddress),
    onSuccess: (order) => {
      setItemCount(0);
      queryClient.removeQueries({ queryKey: ['cart'] });
      router.push(`/orders/${order._id}`);
    },
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
  if (!items.length) {
    router.replace('/cart');
    return null;
  }

  const total = cart?.total ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Form */}
        <form
          onSubmit={handleSubmit((v) => checkout.mutate(v))}
          className="flex-1 bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-4"
        >
          <h2 className="font-semibold text-neutral-900 text-base">Shipping Address</h2>

          <FormField
            label="Street address"
            placeholder="123 Main St"
            error={errors.street?.message}
            {...register('street')}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="City"
              placeholder="London"
              error={errors.city?.message}
              {...register('city')}
            />
            <FormField
              label="Country"
              placeholder="United Kingdom"
              error={errors.country?.message}
              {...register('country')}
            />
          </div>

          <div className="border-t border-neutral-100 pt-4 mt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              This is a test environment — no real payment is processed.
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={checkout.isPending}
            >
              Place Order · {formatCurrency(total)}
            </Button>
          </div>
        </form>

        {/* Summary */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-3">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <div key={item.productId._id} className="flex justify-between text-neutral-600">
                <span className="line-clamp-1 flex-1 mr-2">
                  {item.productId.name} × {item.quantity}
                </span>
                <span className="shrink-0">{formatCurrency(item.productId.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 mt-4 pt-4 flex justify-between font-bold text-neutral-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
