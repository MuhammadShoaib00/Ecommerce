// ---------------------------------------------------------------------------
// Shared TypeScript interfaces mirroring backend Mongoose schemas
// ---------------------------------------------------------------------------

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  /** Price stored in cents (minor units). Use formatCurrency() to display. */
  price: number;
  imageUrl?: string;
  category?: Category;
  stockQuantity: number;
  createdAt?: string;
}

export interface CartItem {
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentRef: string;
  shippingAddress?: { street?: string; city?: string; country?: string };
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
}

export interface TopProduct {
  _id: string;
  name: string;
  totalRevenue: number;
  totalQuantity: number;
}

export interface AnalyticsDashboard {
  totalSales: number;
  totalOrders: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  topProducts: TopProduct[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  page?: number;
  limit?: number;
}
