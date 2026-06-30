import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useToast } from '@/components/ui/Toast';
import type { Product } from '@/types';

export function useAdminProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const create = useMutation({
    mutationFn: (data: Partial<Product>) => adminApi.createProduct(data),
    onSuccess: () => { invalidate(); toast('Product created', 'success'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => { invalidate(); toast('Product updated', 'success'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => { invalidate(); toast('Product deleted', 'info'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  return { create, update, remove };
}
