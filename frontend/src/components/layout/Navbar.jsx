import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Heart, ShoppingCart, User, Menu, X, Sun, Moon,
  LogOut, Package, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass shadow-soft">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">D</div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block">
              Doo-<span className="text-primary">Kaan</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="btn-ghost text-sm">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search products, categories..."
              className="input-field pr-10 !py-2 text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
              <Search size={17} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={toggleTheme} className="btn-ghost !p-2" title="Toggle theme">
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link to="/wishlist" className="btn-ghost !p-2 relative" title="Wishlist">
              <Heart size={19} />
              {wishlist?.items?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="btn-ghost !p-2 relative" title="Cart">
              <ShoppingCart size={19} />
              {cart?.total_items > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.total_items}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-1 btn-ghost !p-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown size={14} className="hidden sm:block" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 card p-2 animate-fadeIn">
                    <p className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800">
                      {user?.first_name || user?.username}
                    </p>
                    <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800">
                      <Package size={15} /> My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-left text-red-500"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm !px-4 !py-2">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen((v) => !v)} className="lg:hidden btn-ghost !p-2">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-1 animate-slideUp">
          <form onSubmit={handleSearch} className="relative mb-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input-field pr-10 text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </button>
          </form>
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-sm font-medium">
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-sm flex-1 text-center">Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
