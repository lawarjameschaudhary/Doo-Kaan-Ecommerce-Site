import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { wishlistAPI } from '../services/api';
import { formatPrice } from '../utils/format';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlist, refreshWishlist, moveToCart } = useWishlist();
  const items = wishlist?.items || [];

  const handleRemove = async (id) => {
    await wishlistAPI.remove(id);
    refreshWishlist();
    toast.success('Removed from wishlist.');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Heart size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Save items you love by tapping the heart icon.</p>
        <Link to="/products" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex gap-4 animate-fadeIn">
            <img src={item.product.thumbnail} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <Link to={`/products/${item.product.slug}`} className="font-medium text-sm text-gray-800 dark:text-gray-100 hover:text-primary line-clamp-1">
                {item.product.name}
              </Link>
              <p className="font-bold text-gray-900 dark:text-white mt-1">{formatPrice(item.product.discount_price || item.product.price)}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => moveToCart(item.id)} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                  <ShoppingCart size={13} /> Move to Cart
                </button>
                <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-500 p-1.5">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
