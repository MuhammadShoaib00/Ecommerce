import { apiClient } from './client';
import type { Cart } from '@/types';

export const cartApi = {
  get: () =>
    apiClient.get('/cart') as unknown as Promise<Cart>,

  addItem: (productId: string, quantity: number) =>
    apiClient.post('/cart/items', { productId, quantity }) as unknown as Promise<Cart>,

  updateItem: (productId: string, quantity: number) =>
    apiClient.patch(`/cart/items/${productId}`, { quantity }) as unknown as Promise<Cart>,

  removeItem: (productId: string) =>
    apiClient.delete(`/cart/items/${productId}`) as unknown as Promise<Cart>,

  clear: () =>
    apiClient.delete('/cart') as unknown as Promise<Cart>,
};
