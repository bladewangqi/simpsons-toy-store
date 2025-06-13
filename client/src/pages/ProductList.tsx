import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CategoryNavigation } from '../components/common/CategoryNavigation';
import { ProductGrid } from '../components/product/ProductGrid';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Product, FilterOptions } from '../types';
import { searchProducts, filterByCategory, filterByPrice, sortProducts } from '../utils/search';
import productsData from '../data/products.json';

export default function ProductList() {
  const [location] = useLocation();
  const [products] = useState<Product[]>(productsData as Product[]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    sortBy: 'featured',
    search: ''
  });

  const itemsPerPage = 12;

  // Parse URL parameters
  useEffect(() => {
    // More robust URL parameter parsing
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    const newFilters = {
      category: params.get('category') || 'all',
      search: params.get('search') || '',
    };
    
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Reset to first page when URL changes (search/category change)
    setCurrentPage(1);
  }, [location]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search
    if (filters.search) {
      result = searchProducts(result, filters.search);
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      result = filterByCategory(result, filters.category);
    }

    // Apply price filter
    if (filters.priceRange) {
      result = filterByPrice(result, filters.priceRange[0], filters.priceRange[1]);
    }

    // Apply sorting
    if (filters.sortBy) {
      result = sortProducts(result, filters.sortBy);
    }

    return result;
  }, [products, filters]);

  // Paginate results
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(0, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy: sortBy as FilterOptions['sortBy'] }));
    setCurrentPage(1);
  };

  const handlePriceFilterChange = (priceRange: string) => {
    let range: [number, number] | undefined;
    
    switch (priceRange) {
      case '0-25':
        range = [0, 25];
        break;
      case '25-50':
        range = [25, 50];
        break;
      case '50-100':
        range = [50, 100];
        break;
      case '100+':
        range = [100, Infinity];
        break;
      default:
        range = undefined;
    }

    setFilters(prev => ({ ...prev, priceRange: range }));
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {!filters.category || filters.category === 'all' ? 'All Products' : (filters.category?.charAt(0).toUpperCase() + filters.category?.slice(1))}
          </h1>
          {filters.search && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Search results for "{filters.search}"
            </p>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNavigation 
        activeCategory={filters.category || 'all'}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Select onValueChange={handlePriceFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-25">Under $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100+">Over $100</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Best Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredProducts.length} products found
              </span>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-yellow-400 text-blue-900' : ''}
                >
                  <i className="fas fa-th" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-yellow-400 text-blue-900' : ''}
                >
                  <i className="fas fa-list" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={paginatedProducts}
            onQuickView={handleQuickView}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        </div>
      </section>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </div>
  );
}
