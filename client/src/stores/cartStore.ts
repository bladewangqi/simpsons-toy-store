import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { trackRemovedCartProduct, trackViewedCart } from '../lib/amplitude';
import productsData from '../data/products.json';

// Helper function to generate cart ID
const generateCartId = (): string => {
  return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  cartId: string;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      cartId: generateCartId(),
      addItem: (product, quantity = 1) => {
        const existingItem = get().items.find(item => item.productId === product.id);
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
                : item
            )
          }));
        } else {
          const newItem: CartItem = {
            id: `cart-${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            total: product.price * quantity,
          };
          set(state => ({ items: [...state.items, newItem] }));
        }
      },
      removeItem: (productId) => {
        const state = get();
        const itemToRemove = state.items.find(item => item.productId === productId);
        
        if (itemToRemove) {
          // Get full product data for tracking
          const products = productsData as Product[];
          const fullProduct = products.find(p => p.id === productId) || {
            id: itemToRemove.productId,
            name: itemToRemove.name,
            price: itemToRemove.price,
            category: 'toys',
            image: itemToRemove.image,
            description: '',
            rating: 4.5,
            reviewCount: 0,
            inStock: true,
            isBestSeller: false,
            isNew: false,
            isLimitedEdition: false,
          };
          
          // Track removal using consistent cartId
          trackRemovedCartProduct(fullProduct, itemToRemove.quantity, state.cartId);
        }
        
        // Remove the item
        set(state => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity, total: quantity * item.price }
              : item
          )
        }));
      },
      clearCart: () => set({ 
        items: [],
        cartId: generateCartId() // Generate new cartId when cart is cleared
      }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.total, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      toggleOpen: () => {
        const state = get();
        const willBeOpen = !state.isOpen;
        
        // Track cart view when opening the cart drawer
        if (willBeOpen && state.items.length > 0) {
          const products = productsData as Product[];
          const cartItems = state.items.map(item => {
            const fullProduct = products.find(p => p.id === item.productId) || {
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
            return {
              product: fullProduct,
              quantity: item.quantity,
            };
          });
          
          // Use consistent cartId instead of generating new one
          const totalCartValue = state.items.reduce((total, item) => total + item.total, 0);
          trackViewedCart(cartItems, state.cartId, totalCartValue);
        }
        
        set({ isOpen: willBeOpen });
      },
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'simpsons-cart',
      partialize: (state) => ({ items: state.items, cartId: state.cartId }),
    }
  )
);
