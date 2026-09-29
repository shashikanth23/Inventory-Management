import { FormEvent, useEffect, useState } from 'react';
import type { Product, ProductFormValues } from '../types/product';

interface ProductFormModalProps {
  open: boolean;
  initial: Product | null;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const emptyForm: ProductFormValues = {
  name: '',
  sku: '',
  category: '',
  quantity: 0,
  price: 0,
  reorderLevel: 5,
};

export default function ProductFormModal({ open, initial, onClose, onSubmit }: ProductFormModalProps) {
  const [values, setValues] = useState<ProductFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setValues({
        name: initial.name,
        sku: initial.sku ?? '',
        category: initial.category ?? '',
        quantity: initial.quantity,
        price: initial.price,
        reorderLevel: initial.reorderLevel,
      });
    } else {
      setValues(emptyForm);
    }
    setError(null);
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err: any) {
      const messages = err?.response?.data?.messages;
      setError(Array.isArray(messages) ? messages.join(', ') : 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {initial ? 'Edit Product' : 'Add Product'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">SKU</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                value={values.sku}
                onChange={(e) => setValues({ ...values, sku: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                value={values.category}
                onChange={(e) => setValues({ ...values, category: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                value={values.quantity}
                onChange={(e) => setValues({ ...values, quantity: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                value={values.price}
                onChange={(e) => setValues({ ...values, price: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Reorder At</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                value={values.reorderLevel}
                onChange={(e) => setValues({ ...values, reorderLevel: Number(e.target.value) })}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
