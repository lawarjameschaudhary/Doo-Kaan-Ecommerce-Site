import { useState, useEffect } from 'react';
import { Trash2, Eye, X } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, statusColor } from '../../utils/format';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setLoading(true);
    orderAPI.list().then((res) => setOrders(res.data.results || res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (order, status) => {
    await orderAPI.updateStatus(order.id, status);
    toast.success(`Order #${order.id} marked as ${status}.`);
    load();
  };

  const handleDelete = async (order) => {
    if (!confirm(`Delete order #${order.id}?`)) return;
    await orderAPI.delete(order.id);
    toast.success('Order deleted.');
    load();
  };

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field max-w-[180px] text-sm">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr className="text-left text-gray-500">
              <th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.map((o) => (
              <tr key={o.id} className="border-t border-gray-50 dark:border-gray-800">
                <td className="p-3 font-medium">#{o.id}</td>
                <td className="p-3">{o.full_name}</td>
                <td className="p-3">{formatPrice(o.total_amount)}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full capitalize border-0 ${statusColor(o.status)}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">{formatDate(o.created_at)}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => setViewOrder(o)} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary"><Eye size={15} /></button>
                  <button onClick={() => handleDelete(o)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
          <div onClick={(e) => e.stopPropagation()} className="card p-6 w-full max-w-md animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Order #{viewOrder.id}</h3>
              <button onClick={() => setViewOrder(null)}><X size={20} /></button>
            </div>
            <p className="text-sm mb-1"><strong>Customer:</strong> {viewOrder.full_name}</p>
            <p className="text-sm mb-1"><strong>Phone:</strong> {viewOrder.phone}</p>
            <p className="text-sm mb-1"><strong>Email:</strong> {viewOrder.email}</p>
            <p className="text-sm mb-3"><strong>Address:</strong> {viewOrder.address}</p>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
              {viewOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
              <span>Total</span><span>{formatPrice(viewOrder.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
