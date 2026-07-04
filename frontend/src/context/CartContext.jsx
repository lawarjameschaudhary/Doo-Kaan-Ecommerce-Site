import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, total_items: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0, total_items: 0 });
      return;
    }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart.');
      return false;
    }
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data);
      toast.success('Added to cart!');
      return true;
    } catch (err) {
      toast.error('Could not add item to cart.');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await cartAPI.update(itemId, quantity);
    setCart(data);
  };

  const removeFromCart = async (itemId) => {
    const { data } = await cartAPI.remove(itemId);
    setCart(data);
    toast.success('Item removed from cart.');
  };

  const clearCart = async () => {
    const { data } = await cartAPI.clear();
    setCart(data);
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
