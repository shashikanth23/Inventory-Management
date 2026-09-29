import { FormEvent, useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateProduct,
} from '../api/products';
import type { PageResponse, Product, ProductFormValues } from '../types/product';
import ProductTable from '../components/ProductTable';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [page, setPage] = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, category]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({ keyword, category, page: pageNumber, size: PAGE_SIZE });
      setPage(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPageNumber(0);
    load();
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, values);
    } else {
      await createProduct(values);
    }
    await load();
    fetchCategories().then(setCategories).catch(() => {});
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Search, filter, and manage your stock.</p>
        </div>
        <button
          onClick={openAddForm}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add Product
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name or SKU…"
          className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPageNumber(0);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">Loading products…</p>
      ) : (
        <>
          <ProductTable
            products={page?.content ?? []}
            onEdit={openEditForm}
            onDelete={(p) => setDeletingProduct(p)}
          />

          {page && page.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Page {page.number + 1} of {page.totalPages} · {page.totalElements} total products
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page.number === 0}
                  onClick={() => setPageNumber((n) => Math.max(0, n - 1))}
                  className="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page.number + 1 >= page.totalPages}
                  onClick={() => setPageNumber((n) => n + 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ProductFormModal
        open={formOpen}
        initial={editingProduct}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deletingProduct}
        title="Delete product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
}
