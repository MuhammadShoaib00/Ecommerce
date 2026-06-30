import { apiClient } from './client';
import type { Order } from '@/types';

export const ordersApi = {
  checkout: (shippingAddress?: { street?: string; city?: string; country?: string }) =>
    apiClient.post('/orders/checkout', shippingAddress ?? {}) as unknown as Promise<Order>,

  list: () =>
    apiClient.get('/orders') as unknown as Promise<Order[]>,

  getById: (id: string) =>
    apiClient.get(`/orders/${id}`) as unknown as Promise<Order>,
};
