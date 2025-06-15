import { useCart } from '../../hooks/useCart';
import { formatMoney } from '../../utils/formatMoney';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { CheckoutModal } from '../checkout/CheckoutModal';
import { Link } from 'wouter';
import { trackStartedCheckout } from '../../lib/amplitude';
import { Product } from '../../types';
import productsData from '../../data/products.json';
import { useCartStore } from '../../stores/cartStore';

export function CartDrawer() {
  const { items, isOpen, setOpen, removeFromCart, updateCartQuantity, total } = useCart();
  const { cartId } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const products = productsData as Product[];

  // Helper function to get full product data from productId
  const getFullProductData = (productId: string): Product | null => {
    return products.find(p => p.id === productId) || null;
  };

  const handleProceedToCheckout = () => {
    // Track checkout start from cart drawer
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

    setOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleContinueShopping = () => {
    setOpen(false);
  };

  const freeShippingThreshold = 50;
  const isEligibleForFreeShipping = total >= freeShippingThreshold;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - total);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <i className="fas fa-shopping-cart text-6xl text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add some Springfield magic to your cart!
              </p>
              <Link href="/products">
                <Button onClick={handleContinueShopping}>
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-orange-500 font-bold">
                        {formatMoney(item.price)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus text-sm" />
                        </Button>
                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded border min-w-[2rem] text-center">
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
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                {/* Free Shipping Progress */}
                {!isEligibleForFreeShipping && (
                  <div className="text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                      <span>Free shipping progress</span>
                      <span>{formatMoney(amountForFreeShipping)} to go</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(total / freeShippingThreshold) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900 dark:text-white">Subtotal:</span>
                  <span className="font-bold text-orange-500">{formatMoney(total)}</span>
                </div>
                
                {/* Shipping Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <i className="fas fa-truck mr-1" />
                  {isEligibleForFreeShipping 
                    ? 'Free shipping included!'
                    : `Free shipping on orders over ${formatMoney(freeShippingThreshold)}`
                  }
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    <i className="fas fa-credit-card mr-2" />
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleContinueShopping}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
