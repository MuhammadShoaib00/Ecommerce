import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import { useAuth } from '@/lib/auth/AuthProvider';

export function useOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.list,
    enabled: !!user,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}
