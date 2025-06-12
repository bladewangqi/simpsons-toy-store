import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CartItem, ShippingAddress } from '../types';
import { generateId } from '../lib/utils';

interface OrdersState {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, shippingAddress: ShippingAddress, paymentMethod: string, userId: string) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: async (items, total, shippingAddress, paymentMethod, userId) => {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const newOrder: Order = {
          id: `order-${generateId()}`,
          userId,
          items: [...items],
          total,
          status: 'processing',
          shippingAddress,
          paymentMethod,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(state => ({
          orders: [...state.orders, newOrder]
        }));
        
        return newOrder;
      },
      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },
      getUserOrders: (userId) => {
        return get().orders.filter(order => order.userId === userId);
      },
      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          )
        }));
      },
    }),
    {
      name: 'simpsons-orders',
    }
  )
);
