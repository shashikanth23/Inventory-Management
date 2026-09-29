import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../api/products';
import type { DashboardStats } from '../types/product';
import StatCard from '../components/StatCard';
import CategoryChart from '../components/CategoryChart';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch {
      setError('Could not load dashboard stats.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading dashboard…</p>;
  }

  if (error || !stats) {
    return <p className="text-sm text-red-600">{error ?? 'No data available.'}</p>;
  }

  const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">A snapshot of your current inventory.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={stats.totalProducts.toString()} />
        <StatCard label="Total Units in Stock" value={stats.totalUnits.toString()} />
        <StatCard label="Inventory Value" value={currency.format(stats.totalInventoryValue)} />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStockCount.toString()}
          accent={stats.lowStockCount > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">Products by Category</h3>
          <CategoryChart data={stats.productsByCategory} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">Low Stock Alerts</h3>
          {stats.lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing is low on stock right now.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.lowStockItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category || 'Uncategorized'}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                    {item.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
