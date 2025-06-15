import * as amplitude from '@amplitude/unified';
import { Product } from '../types';

// Initialize Amplitude
const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

if (AMPLITUDE_API_KEY) {
  amplitude.initAll(AMPLITUDE_API_KEY);
}
console.log('What is the amplitude api key: ', AMPLITUDE_API_KEY)
// Helper function to format product for tracking
const formatProductForTracking = (product: Product, quantity: number = 1): any => ({
  product_id: product.id,
  sku: product.id, // Using ID as SKU since there's no separate SKU field
  name: product.name,
  price: product.price,
  category: product.category,
  quantity,
  revenue: product.price * quantity,
});

// Helper function to format multiple products
const formatProductsForTracking = (items: Array<{ product: Product; quantity: number }>): any[] => {
  return items.map(item => formatProductForTracking(item.product, item.quantity));
};

// Helper function to generate cart ID (you might want to use a proper UUID library)
const generateCartId = (): string => {
  return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Authentication Events
export const trackSignedIn = (accountType: 'google' | 'email') => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Signed in', {
    'account type': accountType,
  });
};

export const trackStartedSignup = () => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Started Signup');
};

export const trackCreatedAccount = (accountType: 'google' | 'email') => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Created Account', {
    'account type': accountType,
  });
};

// Search Events
export const trackCompletedSearch = (keywords: string, numberOfResults: number) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Completed Search', {
    'number of search results': numberOfResults,
    keywords,
  });
};

export const trackClickedSearchResult = (product: Product, rank: number) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Clicked Search Result', {
    rank,
    products: [formatProductForTracking(product)],
  });
};

// Product Events
export const trackViewedProductDetails = (product: Product, pageSource: string = 'direct') => {
  console.log('Viewed Product Details, the amplitude api key is', AMPLITUDE_API_KEY);
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Viewed Product Details', {
    products: [formatProductForTracking(product)],
    'page source': pageSource,
  });
};

export const trackFavoritedProduct = (product: Product) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Favorited Product', {
    products: [formatProductForTracking(product)],
  });
};

export const trackRemovedFavorites = (product: Product) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Removed Favorites', {
    products: [formatProductForTracking(product)],
  });
};

export const trackViewedFavorites = (
  favoriteProducts: Product[],
  totalFavoritedProducts: number
) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Viewed Favorites', {
    products: favoriteProducts.map(product => formatProductForTracking(product)),
    'total favorited products': totalFavoritedProducts,
  });
};

// Cart Events
export const trackAddedToCart = (product: Product, quantity: number, cartId?: string) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Added to Cart', {
    products: [formatProductForTracking(product, quantity)],
    'cart id': cartId || generateCartId(),
  });
};

export const trackViewedCart = (
  cartItems: Array<{ product: Product; quantity: number }>,
  cartId: string,
  totalCartValue: number,
  discountCode?: string,
  totalDiscounts?: number
) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Viewed Cart', {
    products: formatProductsForTracking(cartItems),
    'cart id': cartId,
    'total cart size': cartItems.reduce((sum, item) => sum + item.quantity, 0),
    'total cart value': totalCartValue,
    ...(discountCode && { 'discount code': discountCode }),
    ...(totalDiscounts && { 'total discounts': totalDiscounts }),
  });
};

export const trackRemovedCartProduct = (
  product: Product,
  quantity: number,
  cartId: string
) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Removed Cart Product', {
    'cart id': cartId,
    products: [formatProductForTracking(product, quantity)],
  });
};

// Checkout Events
export const trackStartedCheckout = (
  cartItems: Array<{ product: Product; quantity: number }>,
  cartId: string,
  totalCartValue: number,
  totalDiscounts?: number
) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Started Checkout', {
    products: formatProductsForTracking(cartItems),
    'cart id': cartId,
    'total cart size': cartItems.reduce((sum, item) => sum + item.quantity, 0),
    'total cart value': totalCartValue,
    ...(totalDiscounts && { 'total discounts': totalDiscounts }),
  });
};

export const trackSubmittedOrder = (
  cartItems: Array<{ product: Product; quantity: number }>,
  cartId: string,
  totalCartValue: number,
  orderTotal: number,
  paymentMethod: string
) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Submitted Order', {
    products: formatProductsForTracking(cartItems),
    'cart id': cartId,
    'total cart value': totalCartValue,
    'total cart size': cartItems.reduce((sum, item) => sum + item.quantity, 0),
    'order total': orderTotal,
    'payment method': paymentMethod,
  });
};

export const trackCompletedOrder = (
  cartItems: Array<{ product: Product; quantity: number }>,
  cartId: string,
  orderDetails: {
    totalCartValue: number;
    orderTotal: number;
    paymentMethod: string;
    orderId: string | number;
    revenue: number;
  }
) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Completed Order', {
    products: formatProductsForTracking(cartItems),
    'cart id': cartId,
    'total cart value': orderDetails.totalCartValue,
    'total cart size': cartItems.reduce((sum, item) => sum + item.quantity, 0),
    'order total': orderDetails.orderTotal,
    'payment method': orderDetails.paymentMethod,
    'order id': orderDetails.orderId,
    '$revenue': orderDetails.revenue,
  });
};

// Error Events
export const trackEncounteredError = (
  errorType: string,
  errorName: string,
  errorCode?: string | number
) => {
  if (!AMPLITUDE_API_KEY) return;
  
  amplitude.track('Encountered Error', {
    'error type': errorType,
    'error name': errorName,
    ...(errorCode && { 'error code': errorCode }),
  });
};

// Set user ID for tracking
export const setUserId = (userId: string) => {
  if (!AMPLITUDE_API_KEY) return;
  amplitude.setUserId(userId);
};

// Set user properties - temporarily disabled due to API incompatibility
// export const setUserProperties = (properties: Record<string, any>) => {
//   if (!AMPLITUDE_API_KEY) return;
//   amplitude.identify(properties);
// };

export default amplitude; 
