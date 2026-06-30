import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api/orders';
import { useCartStore } from '@/lib/store/cartStore';
import { useToast } from '@/components/ui/Toast';

export function useCheckout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setItemCount = useCartStore((s) => s.setItemCount);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (address: { street?: string; city?: string; country?: string }) =>
      ordersApi.checkout(address),
    onSuccess: (order) => {
      setItemCount(0);
      queryClient.removeQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.push(`/orders/${order._id}?success=1`);
    },
    onError: (err: Error) => {
      toast(err.message, 'error');
    },
  });
}
