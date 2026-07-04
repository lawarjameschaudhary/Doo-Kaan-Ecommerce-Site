import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickView, setQuickView] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const price = product.discount_price || product.price;

  return (
    <>
      <div className="card group relative overflow-hidden animate-fadeIn">
        {product.discount_percent > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
            -{product.discount_percent}%
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow hover:scale-110 transition-transform"
        >
          <Heart size={16} className={inWishlist ? 'fill-primary text-primary' : 'text-gray-500'} />
        </button>

        <Link to={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gray-50 dark:bg-gray-800">
            <img
              src={product.thumbnail}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Out of Stock</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => { e.preventDefault(); setQuickView(true); }}
                className="flex items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 text-xs font-medium px-3 py-1.5 rounded-full shadow"
              >
                <Eye size={13} /> Quick View
              </button>
            </div>
          </div>
        </Link>

        <div className="p-3">
          <p className="text-[11px] uppercase tracking-wide text-primary font-medium mb-0.5">{product.category_name}</p>
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1">
            <StarRating rating={product.rating} />
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="font-bold text-gray-900 dark:text-white">{formatPrice(price)}</span>
            {product.discount_price && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product.id)}
            disabled={!product.in_stock}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white text-sm font-medium py-2 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </div>
      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  );
}
