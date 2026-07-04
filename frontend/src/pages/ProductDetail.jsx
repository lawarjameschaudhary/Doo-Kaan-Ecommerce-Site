import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/ui/StarRating';
import ProductGrid from '../components/product/ProductGrid';
import { formatPrice, formatDate } from '../utils/format';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const load = () => {
    setLoading(true);
    productAPI.get(slug)
      .then((res) => { setProduct(res.data); setActiveImage(0); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); window.scrollTo(0, 0); }, [slug]);

  // Recently viewed tracking
  useEffect(() => {
    if (!product) return;
    const stored = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    const filtered = stored.filter((p) => p.id !== product.id);
    filtered.unshift({ id: product.id, name: product.name, slug: product.slug, thumbnail: product.thumbnail, price: product.price });
    localStorage.setItem('recently_viewed', JSON.stringify(filtered.slice(0, 6)));
  }, [product]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">Loading product...</div>;
  }
  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">Product not found.</div>;
  }

  const price = product.discount_price || product.price;
  const gallery = [{ image_url: product.thumbnail }, ...(product.images || [])];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to leave a review.');
    try {
      await productAPI.addReview(slug, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Could not submit review.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/products" className="hover:text-primary">Products</Link> / <span className="text-gray-600 dark:text-gray-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 mb-3">
            <img src={gallery[activeImage]?.image_url} alt={product.name} className="w-full h-full object-cover animate-fadeIn" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 ${activeImage === i ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase text-primary font-semibold mb-1">{product.category_name} • {product.brand}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-gray-400">({product.num_reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(price)}</span>
            {product.discount_price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-lg">-{product.discount_percent}%</span>
              </>
            )}
          </div>
          <p className={`text-sm font-medium mb-6 ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
            {product.in_stock ? `✓ In Stock — ${product.stock} units available` : '✕ Out of Stock'}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3 hover:text-primary"><Minus size={15} /></button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="p-3 hover:text-primary"><Plus size={15} /></button>
            </div>
            <button
              onClick={() => addToCart(product.id, quantity)}
              disabled={!product.in_stock}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ShoppingCart size={17} /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary"
            >
              <Heart size={19} className={isInWishlist(product.id) ? 'fill-primary text-primary' : 'text-gray-500'} />
            </button>
          </div>

          <Link
            to="/checkout"
            onClick={() => addToCart(product.id, quantity)}
            className={`btn-outline w-full block text-center mb-6 ${!product.in_stock ? 'pointer-events-none opacity-40' : ''}`}
          >
            Buy Now
          </Link>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center gap-1"><Truck size={18} className="text-primary" /> Fast Delivery</div>
            <div className="flex flex-col items-center gap-1"><ShieldCheck size={18} className="text-primary" /> Secure Payment</div>
            <div className="flex flex-col items-center gap-1"><RotateCcw size={18} className="text-primary" /> Easy Returns</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-6">
          {['description', 'specifications', 'reviews'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t} {t === 'reviews' && `(${product.num_reviews})`}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">{product.description}</p>
        )}

        {tab === 'specifications' && (
          <div className="max-w-xl divide-y divide-gray-100 dark:divide-gray-800">
            {Object.entries(product.specifications || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{key}</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{val}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div className="max-w-2xl space-y-6">
            <form onSubmit={handleReviewSubmit} className="card p-5">
              <h4 className="font-semibold mb-3">Write a Review</h4>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button type="button" key={r} onClick={() => setReviewForm((p) => ({ ...p, rating: r }))} className="text-2xl leading-none">
                    <span className={r <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                placeholder="Share your thoughts about this product..."
                rows={3}
                className="input-field mb-3"
                required
              />
              <button type="submit" className="btn-primary text-sm">Submit Review</button>
            </form>

            {product.reviews?.length === 0 && <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>}
            {product.reviews?.map((review) => (
              <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{review.user_name || 'Anonymous'}</p>
                  <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                </div>
                <StarRating rating={review.rating} showValue={false} size={13} />
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {product.related_products?.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">Related Products</h2>
          <ProductGrid products={product.related_products} />
        </div>
      )}
    </div>
  );
}
