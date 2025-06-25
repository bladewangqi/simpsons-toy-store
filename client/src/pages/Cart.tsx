import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CheckoutModal } from '../components/checkout/CheckoutModal';
import { Button } from '@/components/ui/button';
import { useCart } from '../hooks/useCart';
import { formatMoney, isEligibleForFreeShipping } from '../utils/formatMoney';
import { Product } from '../types';
import productsData from '../data/products.json';
import {
  trackViewedCart,
  trackRemovedCartProduct,
  trackStartedCheckout,
} from '../lib/amplitude';
import { useCartStore } from '../stores/cartStore';

export default function Cart() {
  const { items, removeFromCart, updateCartQuantity, total } = useCart();
  const { cartId } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const freeShippingThreshold = 50;
  const isEligibleForFree = isEligibleForFreeShipping(total, freeShippingThreshold);
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - total);
  
  const products = productsData as Product[];

  // Helper function to get full product data from productId
  const getFullProductData = (productId: string): Product | null => {
    return products.find(p => p.id === productId) || null;
  };

  // Track cart view when component mounts and items are present
  useEffect(() => {
    if (items.length > 0) {
      const cartItems = items.map(item => {
        const fullProduct = getFullProductData(item.productId);
        return {
          product: fullProduct || {
            id: item.productId,
            name: item.name,
            price: item.price,
            category: 'toys',
            image: item.image,
            description: '',
            rating: 4.5,
            reviewCount: 0,
            inStock: true,
            isBestSeller: false,
            isNew: false,
            isLimitedEdition: false,
          },
          quantity: item.quantity,
        };
      });
      
      trackViewedCart(cartItems, cartId, total);
    }
  }, [items, total, cartId]);

  const handleRemoveFromCart = (productId: string) => {
    const item = items.find(i => i.productId === productId);
    
    if (item) {
      const fullProduct = getFullProductData(item.productId);
      const product = fullProduct || {
        id: item.productId,
        name: item.name,
        price: item.price,
        category: 'toys',
        image: item.image,
        description: '',
        rating: 4.5,
        reviewCount: 0,
        inStock: true,
        isBestSeller: false,
        isNew: false,
        isLimitedEdition: false,
      };
      
      trackRemovedCartProduct(product, item.quantity, cartId);
    }
    
    removeFromCart(productId);
  };

  const handleStartCheckout = () => {
    if (items.length > 0) {
      const cartItems = items.map(item => {
        const fullProduct = getFullProductData(item.productId);
        return {
          product: fullProduct || {
            id: item.productId,
            name: item.name,
            price: item.price,
            category: 'toys',
            image: item.image,
            description: '',
            rating: 4.5,
            reviewCount: 0,
            inStock: true,
            isBestSeller: false,
            isNew: false,
            isLimitedEdition: false,
          },
          quantity: item.quantity,
        };
      });
      
      trackStartedCheckout(cartItems, cartId, total);
    }
    
    setIsCheckoutOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <i className="fas fa-shopping-cart text-8xl text-yellow-400 mb-6" />
            <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-xl text-blue-800 dark:text-gray-400 mb-8">
              Add some Springfield magic to your cart!
            </p>
            <Link href="/products">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 text-lg font-bold border-2 border-blue-900">
                <i className="fas fa-toys mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cart Items
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-6">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-orange-500 font-bold text-xl mt-1">
                          {formatMoney(item.price)}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 mt-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Quantity:
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <i className="fas fa-minus text-sm" />
                            </Button>
                            <span className="px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            >
                              <i className="fas fa-plus text-sm" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Item Total & Remove */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatMoney(item.total)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            handleRemoveFromCart(item.productId);
                          }}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
                        >
                          <i className="fas fa-trash mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>
              
              {/* Free Shipping Progress */}
              {!isEligibleForFree && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Free shipping progress</span>
                    <span>{formatMoney(amountForFreeShipping)} to go</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (total / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Add {formatMoney(amountForFreeShipping)} more for free shipping!
                  </p>
                </div>
              )}

              {isEligibleForFree && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
                  <div className="flex items-center text-green-700 dark:text-green-300">
                    <i className="fas fa-check-circle mr-2" />
                    <span className="font-medium">You qualify for free shipping!</span>
                  </div>
                </div>
              )}
              
              {/* Order Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatMoney(total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className={isEligibleForFree ? "text-green-600 font-medium" : "text-gray-900 dark:text-white"}>
                    {isEligibleForFree ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-orange-500">{formatMoney(total)}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleStartCheckout}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 text-lg"
                >
                  <i className="fas fa-credit-card mr-2" />
                  Proceed to Checkout
                </Button>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    <i className="fas fa-arrow-left mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <i className="fas fa-shield-alt mr-1" />
                  Secure checkout guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
