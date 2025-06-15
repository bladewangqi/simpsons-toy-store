import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onQuickView?: (product: Product) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  pageSource?: string; // For tracking where clicks come from
}

export function ProductGrid({ products, loading, onQuickView, onLoadMore, hasMore, pageSource = 'catalog' }: ProductGridProps) {
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-64 bg-gray-300 dark:bg-gray-600" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <i className="fas fa-search text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            rank={pageSource === 'search' ? index + 1 : undefined}
            pageSource={pageSource}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button 
            onClick={onLoadMore}
            disabled={loading}
            className="bg-white dark:bg-slate-800 border-2 border-yellow-400 text-blue-900 dark:text-yellow-400 px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-yellow-400 hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-plus'} mr-2`} />
            {loading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
}
