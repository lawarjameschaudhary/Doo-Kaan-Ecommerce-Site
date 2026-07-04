import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, ShoppingBag, Users, MessageSquare,
  BarChart3, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Tags },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('shopsphere_admin');
    if (!isAdmin) navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('shopsphere_admin');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold">S</div>
          <div>
            <p className="text-white font-bold leading-none">Doo-Kaan</p>
            <p className="text-[11px] text-gray-500">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${location.pathname === to ? 'bg-primary text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon size={17} /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-red-400 hover:bg-gray-800"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 shadow-soft sticky top-0 z-20">
          <span className="font-bold text-gray-900 dark:text-white">Doo-Kaan Admin</span>
          <button onClick={() => setSidebarOpen((v) => !v)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>
        <main className="p-4 sm:p-6 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
