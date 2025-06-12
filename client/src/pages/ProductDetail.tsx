import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { formatMoney } from '../utils/formatMoney';
import { cn } from '@/lib/utils';
import { Product } from '../types';
import { ToastNotification } from '../components/common/ToastNotification';
import productsData from '../data/products.json';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const products = productsData as Product[];

  useEffect(() => {
    if (params?.id) {
      const foundProduct = products.find(p => p.id === params.id);
      setProduct(foundProduct || null);
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [params?.id, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-6xl text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [product.image];
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setToastMessage(`${quantity} ${product.name} added to cart!`);
    setShowToast(true);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    setToastMessage(
      isFavorite(product.id) 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
    setShowToast(true);
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
    <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <i className="fas fa-chevron-right text-gray-400 mx-2" />
                <Link href="/products" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Products
                </Link>
              </li>
              <li>
                <i className="fas fa-chevron-right text-gray-400 mx-2" />
                <Link 
                  href={`/products?category=${product.category}`}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
              </li>
              <li>
                <i className="fas fa-chevron-right text-gray-400 mx-2" />
                <span className="text-gray-900 dark:text-white">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
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
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Product Header */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              {/* Product Labels */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.isBestSeller && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Best Seller
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                    New Arrival
                  </span>
                )}
                {product.isLimitedEdition && (
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Limited Edition
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {renderRating()}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                  ({product.rating}) • {product.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {formatMoney(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-3xl text-gray-500 dark:text-gray-400 line-through">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-lg font-bold">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                      <i className="fas fa-check text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <label className="text-lg font-medium text-gray-900 dark:text-white">
                    Quantity:
                  </label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <i className="fas fa-minus" />
                    </Button>
                    <span className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[4rem] text-center text-lg">
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
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-4 text-lg"
                >
                  <i className="fas fa-cart-plus mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={cn(
                    'border-2 py-4',
                    isFavorite(product.id)
                      ? 'border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border-gray-300 hover:border-red-300 hover:text-red-500'
                  )}
                >
                  <i className={cn(
                    'text-xl',
                    isFavorite(product.id) ? 'fas fa-heart' : 'far fa-heart'
                  )} />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="space-y-3">
                <div className="flex items-center text-green-600">
                  <i className="fas fa-truck mr-3" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fas fa-undo mr-3" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <i className="fas fa-shield-alt mr-3" />
                  <span>2-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-orange-500 font-bold mt-2">
                        {formatMoney(relatedProduct.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <ToastNotification
        message={toastMessage}
        type="success"
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </div>
  );
}
