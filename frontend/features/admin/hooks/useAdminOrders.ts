import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useToast } from '@/components/ui/Toast';
import type { OrderStatus } from '@/types';

export function useAdminOrders(status?: string) {
  return useQuery({
    queryKey: ['admin-orders', status],
    queryFn: () => adminApi.listOrders(status),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast('Order status updated', 'success');
    },
    onError: (e: Error) => toast(e.message, 'error'),
  });
}
