import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate, statusColor } from '../utils/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.list().then((res) => setOrders(res.data.results || res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Package size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No orders yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Your placed orders will appear here.</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="section-title mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Order #{order.id}</p>
                <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-3 font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
