import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [] });

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist({ items: [] });
      return;
    }
    try {
      const { data } = await wishlistAPI.get();
      setWishlist(data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId) => wishlist.items?.some((i) => i.product.id === productId);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to use your wishlist.');
      return;
    }
    const existing = wishlist.items?.find((i) => i.product.id === productId);
    if (existing) {
      const { data } = await wishlistAPI.remove(existing.id);
      setWishlist(data);
      toast.success('Removed from wishlist.');
    } else {
      const { data } = await wishlistAPI.add(productId);
      setWishlist(data);
      toast.success('Added to wishlist!');
    }
  };

  const moveToCart = async (itemId) => {
    const { data } = await wishlistAPI.moveToCart(itemId);
    setWishlist(data.wishlist);
    toast.success('Moved to cart!');
    return data.cart;
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, moveToCart, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
