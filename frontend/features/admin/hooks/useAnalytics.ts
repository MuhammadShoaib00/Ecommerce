import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: adminApi.getDashboard,
    staleTime: 1000 * 60 * 5,
  });
}
