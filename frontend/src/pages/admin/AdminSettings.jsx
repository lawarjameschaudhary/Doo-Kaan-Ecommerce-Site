import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { darkMode, toggleTheme } = useTheme();
  const [store, setStore] = useState({ name: 'ShopSphere', email: 'support@shopsphere.com', phone: '+977 61-000000' });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved (demo only — not persisted to backend).');
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="card p-6">
        <h3 className="font-bold mb-4">Store Information</h3>
        <form onSubmit={handleSave} className="space-y-3">
          <input value={store.name} onChange={(e) => setStore((p) => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Store Name" />
          <input value={store.email} onChange={(e) => setStore((p) => ({ ...p, email: e.target.value }))} className="input-field" placeholder="Support Email" />
          <input value={store.phone} onChange={(e) => setStore((p) => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="Support Phone" />
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </div>

      <div className="card p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold">Dark Mode</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Toggle the admin panel's appearance.</p>
        </div>
        <button
          onClick={toggleTheme}
          className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${darkMode ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'}`}
        >
          <span className="w-6 h-6 rounded-full bg-white shadow block" />
        </button>
      </div>
    </div>
  );
}
