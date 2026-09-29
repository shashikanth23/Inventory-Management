import type { Product } from '../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
        No products match your filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Quantity</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Value</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
              <td className="px-4 py-3 text-gray-500">{p.sku || '—'}</td>
              <td className="px-4 py-3 text-gray-500">{p.category || 'Uncategorized'}</td>
              <td className="px-4 py-3 text-right text-gray-700">{p.quantity}</td>
              <td className="px-4 py-3 text-right text-gray-700">{currency.format(p.price)}</td>
              <td className="px-4 py-3 text-right text-gray-700">
                {currency.format(p.price * p.quantity)}
              </td>
              <td className="px-4 py-3">
                {p.lowStock ? (
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                    Low Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    In Stock
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(p)}
                  className="mr-3 text-sm font-medium text-brand-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
