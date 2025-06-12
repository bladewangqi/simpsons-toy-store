import { Link, useLocation } from 'wouter';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../common/ThemeProvider';
import { SearchBar } from '../common/SearchBar';
import { useState } from 'react';
import { AuthModal } from '../auth/AuthModal';
import { CartDrawer } from '../cart/CartDrawer';

export function Navbar() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { itemCount, toggleOpen } = useCart();
  const { favoriteCount } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (query: string) => {
    setLocation(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-800 shadow-lg sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-900">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Simpsons Toy Store</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium Collectibles</p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar onSearch={handleSearch} className="w-full" />
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <i className="fas fa-sun text-yellow-500" />
                ) : (
                  <i className="fas fa-moon text-gray-600" />
                )}
              </button>

              {/* Favorites */}
              <Link href="/favorites" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <i className="fas fa-heart text-gray-600 dark:text-gray-300" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={toggleOpen}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <i className="fas fa-shopping-cart text-gray-600 dark:text-gray-300" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=ffd90f&color=1e3a8a`} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
                      {user.displayName || user.email}
                    </span>
                    <i className="fas fa-chevron-down text-xs text-gray-500" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                )}

                {/* User Dropdown */}
                {showUserMenu && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link 
                      href="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <i className="fas fa-user mr-2" />
                      My Account
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <i className="fas fa-box mr-2" />
                      Order History
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button 
                      onClick={() => {/* Add logout logic */}}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <i className="fas fa-sign-out-alt mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </nav>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <CartDrawer />
    </>
  );
}
