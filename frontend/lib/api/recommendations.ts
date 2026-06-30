import { apiClient } from './client';
import type { Product } from '@/types';

export const recommendationsApi = {
  get: () =>
    apiClient.get('/recommendations') as unknown as Promise<Product[]>,
};
