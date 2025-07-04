import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CategoryNavigation } from '../components/common/CategoryNavigation';
import { ProductGrid } from '../components/product/ProductGrid';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Button } from '@/components/ui/button';
import { Product } from '../types';
import productsData from '../data/products.json';

export default function Home() {
  const [products] = useState<Product[]>(productsData as Product[]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Get featured products (best sellers and new arrivals)
  const featuredProducts = products.filter(p => p.isBestSeller || p.isNew).slice(0, 8);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const scrollToProducts = () => {
    const element = document.getElementById('featured-products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-400 via-sky-300 to-blue-400 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-yellow-400 mb-6 drop-shadow-lg stroke-2 stroke-blue-900" style={{textShadow: '3px 3px 0px #1e3a8a, -1px -1px 0px #1e3a8a, 1px -1px 0px #1e3a8a, -1px 1px 0px #1e3a8a, 1px 1px 0px #1e3a8a'}}>
                D'oh! Amazing
                <span className="block text-yellow-400">Simpsons Toys</span>
              </h1>
              <p className="text-xl text-blue-900 font-semibold mb-8 drop-shadow bg-white/80 rounded-lg p-4">
                Premium collectibles, plush toys, and action figures from Springfield's finest family. 
                Don't have a cow, man – shop now!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={scrollToProducts}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-blue-900"
                >
                  <i className="fas fa-toys mr-2" />
                  Shop Collection
                </Button>
                <Link href="/products?new=true">
                  <Button
                    variant="outline"
                    className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-blue-900 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <i className="fas fa-sparkles mr-2" />
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative mx-auto max-w-md">
                <div className="bg-yellow-400/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-yellow-400">
                  <img
                    src={featuredProducts[0]?.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
                    alt="Featured Product"
                    className="w-full h-80 object-cover rounded-2xl shadow-lg border-2 border-blue-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNavigation 
        activeCategory="all"
        onCategoryChange={(category) => {
          window.location.href = `/products?category=${category}`;
        }}
      />

      {/* Featured Products Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900" id="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Springfield's Finest Collection
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From the Nuclear Plant to Moe's Tavern, discover premium toys featuring everyone's favorite family
            </p>
          </div>

          <ProductGrid
            products={featuredProducts}
            onQuickView={handleQuickView}
          />

          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 text-lg">
                <i className="fas fa-eye mr-2" />
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-truck text-2xl text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Free shipping on all orders over $50. Get your Springfield favorites delivered fast!
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authentic Products
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Only official Simpsons merchandise. Every item is guaranteed authentic and high-quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-undo text-2xl text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                30-day return policy on all items. Not satisfied? Return it, no questions asked!
              </p>
            </div>
          </div>
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
