import { useState, useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import { formatPrice, formatDate, statusColor } from '../../utils/format';

const COLORS = ['#DC2626', '#F87171', '#FCA5A5', '#FECACA', '#991B1B', '#7F1D1D'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.dashboardStats().then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <div className="text-center text-gray-400 py-16">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.total_products} color="primary" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total_orders} color="blue" />
        <StatCard icon={DollarSign} label="Total Revenue" value={formatPrice(stats.total_revenue)} color="green" />
        <StatCard icon={Users} label="Total Users" value={stats.total_users} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold mb-4">Sales — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.sales_by_day}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => formatPrice(v)} />
              <Line type="monotone" dataKey="total" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.top_categories} dataKey="count" nameKey="name" outerRadius={90} label>
                {stats.top_categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-2">Order</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-2">#{o.id}</td>
                    <td className="py-2">{o.full_name}</td>
                    <td className="py-2">{formatPrice(o.total_amount)}</td>
                    <td className="py-2"><span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColor(o.status)}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4">Recent Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-2">Name</th><th className="pb-2">Email</th><th className="pb-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-2">{u.first_name} {u.last_name}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{formatDate(u.date_joined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
