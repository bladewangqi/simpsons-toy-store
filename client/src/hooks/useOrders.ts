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
    console.log('Creating order for user:', user.uid);
    const order = await addOrder(items, total, shippingAddress, paymentMethod, user.uid);
    console.log('Order created:', order);
    return order;
  };

  const userOrders = user ? getUserOrders(user.uid) : [];
  console.log('User ID:', user?.uid);
  console.log('User orders:', userOrders);
  console.log('All orders:', orders);

  return {
    orders: userOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
  };
}
