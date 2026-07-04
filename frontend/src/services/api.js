/**
 * Central Axios instance + API service layer.
 * All backend communication goes through this file so components
 * never call axios directly — keeps the app easy to maintain/test.
 */
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopsphere_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ---------------- AUTH ----------------
export const authAPI = {
  signup: (data) => api.post('/auth/signup/', data),
  login: (data) => api.post('/auth/login/', data),
  profile: () => api.get('/auth/profile/'),
  adminLogin: (data) => api.post('/admin/login/', data),
};

// ---------------- CATEGORIES ----------------
export const categoryAPI = {
  list: () => api.get('/categories/'),
  get: (slug) => api.get(`/categories/${slug}/`),
  create: (data) => api.post('/categories/', data),
  update: (slug, data) => api.put(`/categories/${slug}/`, data),
  delete: (slug) => api.delete(`/categories/${slug}/`),
};

// ---------------- PRODUCTS ----------------
export const productAPI = {
  list: (params) => api.get('/products/', { params }),
  get: (slug) => api.get(`/products/${slug}/`),
  featured: () => api.get('/products/featured/'),
  trending: () => api.get('/products/trending/'),
  flashSale: () => api.get('/products/flash_sale/'),
  bestSellers: () => api.get('/products/best_sellers/'),
  create: (data) => api.post('/products/', data),
  update: (slug, data) => api.put(`/products/${slug}/`, data),
  delete: (slug) => api.delete(`/products/${slug}/`),
  addReview: (slug, data) => api.post(`/products/${slug}/add_review/`, data),
};

// ---------------- CART ----------------
export const cartAPI = {
  get: () => api.get('/cart/'),
  add: (productId, quantity = 1) => api.post('/cart/add/', { product_id: productId, quantity }),
  update: (itemId, quantity) => api.patch(`/cart/update/${itemId}/`, { quantity }),
  remove: (itemId) => api.delete(`/cart/remove/${itemId}/`),
  clear: () => api.delete('/cart/clear/'),
};

// ---------------- WISHLIST ----------------
export const wishlistAPI = {
  get: () => api.get('/wishlist/'),
  add: (productId) => api.post('/wishlist/add/', { product_id: productId }),
  remove: (itemId) => api.delete(`/wishlist/remove/${itemId}/`),
  moveToCart: (itemId) => api.post(`/wishlist/move-to-cart/${itemId}/`),
};

// ---------------- ORDERS ----------------
export const orderAPI = {
  list: () => api.get('/orders/'),
  get: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/update_status/`, { status }),
  delete: (id) => api.delete(`/orders/${id}/`),
};

// ---------------- CONTACT ----------------
export const contactAPI = {
  send: (data) => api.post('/contact/', data),
  list: () => api.get('/contact/'),
};

// ---------------- ADMIN ----------------
export const adminAPI = {
  users: (params) => api.get('/admin/users/', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
  dashboardStats: () => api.get('/dashboard/stats/'),
};

export default api;
