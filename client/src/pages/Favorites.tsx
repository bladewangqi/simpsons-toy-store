import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthModal } from '../components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { Link } from 'wouter';
import productsData from '../data/products.json';
import { Product } from '../types';

export default function Favorites() {
  const { user, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const products = productsData as Product[];
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <i className="fas fa-heart text-8xl text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in to view favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Create an account or sign in to save your favorite Simpsons toys and access them anytime.
            </p>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteProducts.length === 0 
              ? "You haven't added any favorites yet"
              : `${favoriteProducts.length} items in your favorites`
            }
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-heart text-8xl text-gray-400 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start browsing and save your favorite Simpsons toys! Click the heart icon on any product to add it to your favorites.
            </p>
            <Link href="/products">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        BESTSELLER
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.discount && (
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star text-sm ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}