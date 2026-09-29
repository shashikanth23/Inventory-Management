export interface Product {
  id: number;
  name: string;
  sku: string | null;
  category: string | null;
  quantity: number;
  price: number;
  reorderLevel: number;
  lowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  reorderLevel: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalUnits: number;
  totalInventoryValue: number;
  lowStockCount: number;
  categoryCount: number;
  productsByCategory: Record<string, number>;
  lowStockItems: Product[];
}
