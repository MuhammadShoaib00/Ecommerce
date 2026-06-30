import { apiClient } from './client';
import type { Category } from '@/types';

export const categoriesApi = {
  list: () =>
    apiClient.get('/categories') as unknown as Promise<Category[]>,
};
