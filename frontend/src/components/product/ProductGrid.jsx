import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({ products, loading, columns = 4 }) {
  if (loading) return <ProductGridSkeleton count={8} />;

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <PackageSearch size={48} className="mb-3" />
        <p className="font-medium">No products found</p>
        <p className="text-sm">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const colClass = {
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-3 lg:grid-cols-4',
    5: 'sm:grid-cols-3 lg:grid-cols-5',
  }[columns] || 'sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-2 ${colClass} gap-4`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
