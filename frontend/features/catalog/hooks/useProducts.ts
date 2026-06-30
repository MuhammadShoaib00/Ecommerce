import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import type { ProductQueryParams } from '@/types';

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.list(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}
