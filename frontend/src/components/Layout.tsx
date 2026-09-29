import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-white p-4">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-bold text-gray-900">Inventory</h1>
          <p className="text-xs text-gray-500">Management System</p>
        </div>
        <nav className="space-y-1">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
        </nav>
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="px-2 text-xs text-gray-500">Signed in as</p>
          <p className="mb-3 px-2 text-sm font-medium text-gray-800">{user?.username}</p>
          <button
            onClick={logout}
            className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
