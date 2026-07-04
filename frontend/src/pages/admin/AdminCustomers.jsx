import { useState, useEffect } from 'react';
import { Trash2, Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.users({ search: search || undefined }).then((res) => setUsers(res.data.results || res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [search]);

  const handleDelete = async (u) => {
    if (!confirm(`Delete user "${u.username}"?`)) return;
    await adminAPI.deleteUser(u.id);
    toast.success('User deleted.');
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="input-field pl-9 text-sm" />
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr className="text-left text-gray-500">
              <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-t border-gray-50 dark:border-gray-800">
                <td className="p-3 font-medium">{u.first_name} {u.last_name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone || '—'}</td>
                <td className="p-3">{formatDate(u.date_joined)}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(u)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
