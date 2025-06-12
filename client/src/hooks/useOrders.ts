import { useOrdersStore } from '../stores/ordersStore';
import { useAuthStore } from '../stores/authStore';
import { CartItem, ShippingAddress } from '../types';

export function useOrders() {
  const { user } = useAuthStore();
  const {
    orders,
    addOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
  } = useOrdersStore();

  const createOrder = async (
    items: CartItem[],
    total: number,
    shippingAddress: ShippingAddress,
    paymentMethod: string
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to place an order');
    }
    return addOrder(items, total, shippingAddress, paymentMethod, user.uid);
  };

  const userOrders = user ? getUserOrders(user.uid) : [];

  return {
    orders: userOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
  };
}
