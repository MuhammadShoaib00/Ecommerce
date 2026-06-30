import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api/cart';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/auth/AuthProvider';

export function useCart() {
  const { user } = useAuth();
  const setItemCount = useCartStore((s) => s.setItemCount);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    enabled: !!user,
  });

  // Keep cart badge count in sync
  useEffect(() => {
    if (query.data) {
      const count = query.data.items.reduce((s, i) => s + i.quantity, 0);
      setItemCount(count);
    }
  }, [query.data, setItemCount]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const update = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItem(productId, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart);
      const count = cart.items.reduce((s, i) => s + i.quantity, 0);
      setItemCount(count);
    },
  });

  const remove = useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart);
      const count = cart.items.reduce((s, i) => s + i.quantity, 0);
      setItemCount(count);
    },
  });

  const clear = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      setItemCount(0);
      invalidate();
    },
  });

  return { ...query, update, remove, clear };
}
