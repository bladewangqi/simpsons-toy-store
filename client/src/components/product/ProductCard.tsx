import { Link } from 'wouter';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import { formatMoney } from '../../utils/formatMoney';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ToastNotification } from '../common/ToastNotification';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star" />);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt" />);
    }

    const emptyStars = 5 - Math.ceil(product.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star" />);
    }

    return stars;
  };

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group overflow-hidden cursor-pointer">
          {/* Product Image */}
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
              <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={handleToggleFavorite}
                  className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <i className={cn(
                    isFavorite(product.id) ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-600'
                  )} />
                </button>
                {onQuickView && (
                  <button 
                    onClick={handleQuickView}
                    className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <i className="fas fa-eye text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Product Labels */}
            <div className="absolute top-4 left-4 space-y-1">
              {product.isBestSeller && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Best Seller
                </span>
              )}
              {product.isNew && (
                <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded-full text-xs font-bold">
                  New Arrival
                </span>
              )}
              {product.isLimitedEdition && (
                <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Limited Edition
                </span>
              )}
            </div>
            
            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute bottom-4 left-4">
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6">
            <div className="mb-2">
              <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {product.description}
            </p>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {renderRating()}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                ({product.rating}) • {product.reviewCount} reviews
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatMoney(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    {formatMoney(product.originalPrice)}
                  </span>
                )}
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  'px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
                  product.inStock
                    ? 'bg-blue-900 hover:bg-blue-800 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                <i className="fas fa-cart-plus mr-1" />
                {product.inStock ? 'Add' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </Link>

      <ToastNotification
        message={toastMessage}
        type="success"
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </>
  );
}
