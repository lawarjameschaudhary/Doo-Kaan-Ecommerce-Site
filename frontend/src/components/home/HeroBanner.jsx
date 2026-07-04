import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="animate-slideUp">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            🎉 Mega Sale — Up to 50% Off
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            Everything You Need, <span className="text-primary">In One Place</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md">
            Discover top-quality electronics, fashion, and more — delivered fast, priced right.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary flex items-center gap-2">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/categories" className="btn-outline flex items-center gap-2">
              Explore <Compass size={18} />
            </Link>
          </div>
        </div>
        <div className="relative animate-fadeIn">
          <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img
              src="https://picsum.photos/seed/shopsphere-hero/700/700"
              alt="Featured promotional products"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-3 shadow-xl hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">10,000+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
