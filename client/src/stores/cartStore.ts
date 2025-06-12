import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
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
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.total, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'simpsons-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
