import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { productAPI } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    min_price: '',
    max_price: '',
    min_rating: '',
    availability: '',
    sort: '',
  });
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const debouncedSearch = useDebounce(filters.search, 400);

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'featured') setFilters((p) => ({ ...p, is_featured: true }));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = {
      page,
      search: debouncedSearch || undefined,
      category__slug: filters.category || undefined,
      min_price: filters.min_price || undefined,
      max_price: filters.max_price || undefined,
      min_rating: filters.min_rating || undefined,
      availability: filters.availability || undefined,
      sort: filters.sort || undefined,
    };
    productAPI.list(params)
      .then((res) => {
        setProducts(res.data.results);
        setCount(res.data.count);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, filters.category, filters.min_price, filters.max_price, filters.min_rating, filters.availability, filters.sort]);

  const totalPages = Math.ceil(count / 12);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="section-title mb-1">All Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{count} products found</p>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          placeholder="Search products..."
          className="input-field max-w-xs text-sm"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
          className="input-field max-w-[180px] text-sm"
        >
          <option value="">Sort: Default</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest First</option>
        </select>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden btn-outline text-sm flex items-center gap-2 ml-auto"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <ProductFilters filters={filters} setFilters={setFilters} />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 p-5 overflow-y-auto animate-slideUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
              </div>
              <ProductFilters filters={filters} setFilters={setFilters} />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <ProductGrid products={products} loading={loading} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
