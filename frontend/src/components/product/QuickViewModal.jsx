import { X, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useEffect } from 'react';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const price = product.discount_price || product.price;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full grid grid-cols-1 sm:grid-cols-2 overflow-hidden shadow-2xl animate-scaleIn"
      >
        <div className="aspect-square bg-gray-50 dark:bg-gray-800">
          <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-primary">
            <X size={20} />
          </button>
          <p className="text-xs uppercase text-primary font-medium mb-1">{product.category_name}</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
          <StarRating rating={product.rating} />
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(price)}</span>
            {product.discount_price && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className={`mt-2 text-sm font-medium ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
            {product.in_stock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => { addToCart(product.id); onClose(); }}
              disabled={!product.in_stock}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary"
            >
              <Heart size={18} className={isInWishlist(product.id) ? 'fill-primary text-primary' : 'text-gray-500'} />
            </button>
          </div>
          <Link to={`/products/${product.slug}`} onClick={onClose} className="block text-center text-sm text-primary mt-4 hover:underline">
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
