import { useCartStore } from '../stores/cartStore';
import { Product } from '../types';

export function useCart() {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    toggleOpen,
    setOpen,
  } = useCartStore();

  const addToCart = (product: Product, quantity = 1) => {
    addItem(product, quantity);
  };

  const removeFromCart = (productId: string) => {
    removeItem(productId);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const total = getTotal();
  const itemCount = getItemCount();

  return {
    items,
    isOpen,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleOpen,
    setOpen,
  };
}
