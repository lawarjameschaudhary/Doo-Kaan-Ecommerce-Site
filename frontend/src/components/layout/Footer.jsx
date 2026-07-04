import { Link } from 'react-router-dom';
import { Link2, Camera, MessageCircle, PlaySquare, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Subscribed to ShopSphere newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">D</div>
            <span className="text-xl font-extrabold text-white">Doo-<span className="text-primary">Kaan</span></span>
          </div>
          <p className="text-sm text-gray-400">Everything you need in one place. Quality products, unbeatable prices, delivered fast.</p>
          <div className="flex gap-3 mt-4">
            {[Link2, Camera, MessageCircle, PlaySquare].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link to="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin size={15} /> Bharatpur-18, Bagmati, Nepal</li>
            <li className="flex items-center gap-2"><Phone size={15} /> +977 9817246783</li>
            <li className="flex items-center gap-2"><Mail size={15} /> sudiphero67@gmail.com</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-3">Subscribe for exclusive deals and updates.</p>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              className="flex-1 bg-gray-800 text-sm px-3 py-2 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button type="submit" className="bg-primary hover:bg-primary-700 px-3 rounded-r-xl transition-colors">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Doo-Kaan. All rights reserved. Built By Sugam & Sudeip.
      </div>
    </footer>
  );
}
