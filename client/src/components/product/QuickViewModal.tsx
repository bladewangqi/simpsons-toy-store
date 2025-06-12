import { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import { formatMoney } from '../../utils/formatMoney';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  const images = product.images || [product.image];

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Product Quick View</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main product image */}
            <div className="relative aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              />
            </div>
            
            {/* Thumbnail carousel */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index
                        ? 'border-yellow-400'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} angle ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="mb-2">
                <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {renderRating()}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  ({product.rating}) • {product.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatMoney(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900 dark:text-white">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus" />
                  </Button>
                  <span className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="fas fa-plus" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-blue-900 hover:bg-blue-800 text-white"
                >
                  <i className="fas fa-cart-plus mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={cn(
                    'border-2',
                    isFavorite(product.id)
                      ? 'border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border-gray-300 hover:border-red-300 hover:text-red-500'
                  )}
                >
                  <i className={cn(
                    isFavorite(product.id) ? 'fas fa-heart' : 'far fa-heart'
                  )} />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-600">
                  <i className="fas fa-truck mr-2" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fas fa-undo mr-2" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fas fa-shield-alt mr-2" />
                  <span>2-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
