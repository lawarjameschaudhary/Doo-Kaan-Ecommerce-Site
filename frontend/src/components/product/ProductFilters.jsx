import { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import { Star } from 'lucide-react';

export default function ProductFilters({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryAPI.list().then((res) => setCategories(res.data.results || res.data));
  }, []);

  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Category</h3>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="category" checked={!filters.category} onChange={() => update('category', '')} className="accent-primary" />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => update('category', cat.slug)}
                className="accent-primary"
              />
              {cat.name} <span className="text-gray-400">({cat.product_count})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price}
            onChange={(e) => update('min_price', e.target.value)}
            className="input-field !py-1.5 text-sm w-full"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price}
            onChange={(e) => update('max_price', e.target.value)}
            className="input-field !py-1.5 text-sm w-full"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={String(filters.min_rating) === String(r)}
                onChange={() => update('min_rating', r)}
                className="accent-primary"
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: r }).map((_, i) => <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />)}
              </span>
              & up
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="rating" checked={!filters.min_rating} onChange={() => update('min_rating', '')} className="accent-primary" />
            Any Rating
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Availability</h3>
        <div className="space-y-2">
          {[
            { label: 'All', value: '' },
            { label: 'In Stock', value: 'in_stock' },
            { label: 'Out of Stock', value: 'out_of_stock' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === opt.value}
                onChange={() => update('availability', opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => setFilters({ category: '', min_price: '', max_price: '', min_rating: '', availability: '', sort: '', search: filters.search })}
        className="btn-outline w-full text-sm"
      >
        Clear Filters
      </button>
    </aside>
  );
}
