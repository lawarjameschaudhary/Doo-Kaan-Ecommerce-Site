import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Wallet, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/format';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: Truck },
  { value: 'esewa', label: 'eSewa', icon: Wallet },
  { value: 'khalti', label: 'Khalti', icon: Smartphone },
  { value: 'card', label: 'Credit Card', icon: CreditCard },
];

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    address: user?.address || '',
    phone: user?.phone || '',
    email: user?.email || '',
    payment_method: 'cod',
  });
  const [placed, setPlaced] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const items = cart?.items || [];

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty.');
    setSubmitting(true);
    try {
      const { data } = await orderAPI.create(form);
      setPlaced(data);
      refreshCart();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center animate-scaleIn">
        <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-1">Order #{placed.id} — {formatPrice(placed.total_amount)}</p>
        <p className="text-gray-500 dark:text-gray-400 mb-6">We'll deliver to {placed.address}. Thank you for shopping with ShopSphere!</p>
        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/products" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">Your cart is empty. Add items before checking out.</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-6 space-y-4">
          <h3 className="font-bold text-lg mb-2">Billing Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="input-field" />
            <input required name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="input-field" />
          </div>
          <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="input-field" />
          <textarea required name="address" value={form.address} onChange={handleChange} placeholder="Full Delivery Address" rows={3} className="input-field" />

          <h3 className="font-bold text-lg pt-3">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                className={`flex items-center gap-2 border-2 rounded-xl p-3 cursor-pointer transition-colors ${
                  form.payment_method === value ? 'border-primary bg-primary-50 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={value}
                  checked={form.payment_method === value}
                  onChange={handleChange}
                  className="accent-primary"
                />
                <Icon size={17} /> <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-4">
            {submitting ? 'Placing Order...' : `Place Order — ${formatPrice(cart.total)}`}
          </button>
        </form>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <img src={item.product.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 font-medium">{item.product.name}</p>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 dark:border-gray-800 pt-3">
            <span>Total</span><span>{formatPrice(cart.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
