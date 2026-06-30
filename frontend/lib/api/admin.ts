import { apiClient } from './client';
import type { AnalyticsDashboard, Order, OrderStatus, Product } from '@/types';

export const adminApi = {
  // Products
  createProduct: (data: Partial<Product>) =>
    apiClient.post('/admin/products', data) as unknown as Promise<Product>,

  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.patch(`/admin/products/${id}`, data) as unknown as Promise<Product>,

  deleteProduct: (id: string) =>
    apiClient.delete(`/admin/products/${id}`) as unknown as Promise<void>,

  // Orders
  listOrders: (status?: string) =>
    apiClient.get('/admin/orders', { params: status ? { status } : {} }) as unknown as Promise<Order[]>,

  updateOrderStatus: (id: string, status: OrderStatus) =>
    apiClient.patch(`/admin/orders/${id}/status`, { status }) as unknown as Promise<Order>,

  // Analytics
  getDashboard: () =>
    apiClient.get('/admin/analytics') as unknown as Promise<AnalyticsDashboard>,
};
