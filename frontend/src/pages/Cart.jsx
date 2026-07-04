import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingCart size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4 items-center animate-fadeIn">
              <img src={item.product.thumbnail} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.slug}`} className="font-medium text-gray-800 dark:text-gray-100 hover:text-primary line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-xs text-gray-400">{item.product.category_name}</p>
                <p className="font-bold text-gray-900 dark:text-white mt-1">{formatPrice(item.unit_price)}</p>
              </div>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-primary"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-primary"><Plus size={14} /></button>
              </div>
              <p className="font-bold text-gray-900 dark:text-white w-24 text-right hidden sm:block">{formatPrice(item.subtotal)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <div className="flex justify-between">
            <Link to="/products" className="btn-outline text-sm">Continue Shopping</Link>
            <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
          </div>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal ({cart.total_items} items)</span><span>{formatPrice(cart.total)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-green-600">Free</span></div>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 dark:border-gray-800 pt-3 mb-5">
            <span>Grand Total</span><span>{formatPrice(cart.total)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
