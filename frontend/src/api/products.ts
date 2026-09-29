import client from './client';
import type { DashboardStats, PageResponse, Product, ProductFormValues } from '../types/product';

export interface ProductQuery {
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export async function fetchProducts(query: ProductQuery): Promise<PageResponse<Product>> {
  const { data } = await client.get<PageResponse<Product>>('/products', {
    params: {
      keyword: query.keyword || undefined,
      category: query.category || undefined,
      page: query.page ?? 0,
      size: query.size ?? 10,
      sort: query.sort ?? 'id,desc',
    },
  });
  return data;
}

export async function fetchCategories(): Promise<string[]> {
  const { data } = await client.get<string[]>('/products/categories');
  return data;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await client.get<DashboardStats>('/products/dashboard');
  return data;
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const { data } = await client.post<Product>('/products', values);
  return data;
}

export async function updateProduct(id: number, values: ProductFormValues): Promise<Product> {
  const { data } = await client.put<Product>(`/products/${id}`, values);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await client.delete(`/products/${id}`);
}
