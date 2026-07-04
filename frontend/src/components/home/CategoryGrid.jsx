import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function CategoryGrid({ categories, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((cat) => {
        const Icon = Icons[cat.icon] || Icons.ShoppingBag;
        return (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="card flex flex-col items-center justify-center gap-2 py-6 hover:-translate-y-1 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon size={22} />
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{cat.name}</p>
            <p className="text-xs text-gray-400">{cat.product_count} items</p>
          </Link>
        );
      })}
    </div>
  );
}
