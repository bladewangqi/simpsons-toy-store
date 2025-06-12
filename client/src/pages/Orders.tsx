import { useState } from 'react';
import { Link } from 'wouter';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthModal } from '../components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { formatMoney } from '../utils/formatMoney';
import { cn } from '@/lib/utils';
import { Order } from '../types';

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'processing':
        return 'fas fa-cog fa-spin';
      case 'shipped':
        return 'fas fa-truck';
      case 'delivered':
        return 'fas fa-check-circle';
      case 'cancelled':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <i className="fas fa-box text-8xl text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sign In Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please sign in to view your order history and track your shipments.
            </p>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
            >
              Sign In to View Orders
            </Button>
          </div>
        </div>
        <Footer />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
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
            Order History
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your orders and view your purchase history
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-box-open text-8xl text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No orders yet
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your order history will appear here after you make your first purchase.
            </p>
            <Link href="/products">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 text-lg">
                <i className="fas fa-toys mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on {order.createdAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={cn(getStatusColor(order.status))}>
                        <i className={cn(getStatusIcon(order.status), 'mr-1')} />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatMoney(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Items ({order.items.length})
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <Link href={`/product/${item.productId}`}>
                              <h5 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {item.name}
                              </h5>
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity} • {formatMoney(item.price)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatMoney(item.total)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Payment Method
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="flex items-center">
                          <i className={cn(
                            order.paymentMethod === 'PayPal' ? 'fab fa-paypal' : 'fas fa-credit-card',
                            'mr-2'
                          )} />
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                    {order.status === 'shipped' && (
                      <Button variant="outline" size="sm">
                        <i className="fas fa-truck mr-2" />
                        Track Package
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        <i className="fas fa-undo mr-2" />
                        Return Items
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <i className="fas fa-download mr-2" />
                      Download Invoice
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-headset mr-2" />
                      Get Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
