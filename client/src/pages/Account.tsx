import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthModal } from '../components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useOrders } from '../hooks/useOrders';
import { logOut } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import productsData from '../data/products.json';
import { Product, Order } from '../types';
import { formatMoney } from '../utils/formatMoney';
import { Badge } from '@/components/ui/badge';

export default function Account() {
  const { user, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const { orders } = useOrders();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const products = productsData as Product[];
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

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

  const handleSignOut = async () => {
    try {
      await logOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      console.error('Account: Sign out error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-yellow-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <i className="fas fa-user-circle text-8xl text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sign In Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please sign in to access your account and manage your profile.
            </p>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
            >
              Sign In to Your Account
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
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'User')}&background=ffd90f&color=1e3a8a&size=80`}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.displayName || 'My Account'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={user?.displayName || ''}
                      disabled={!isEditing}
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50 dark:bg-slate-700"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  {isEditing ? (
                    <>
                      <Button onClick={() => setIsEditing(false)}>
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <i className="fas fa-edit mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Your Favorites</CardTitle>
                <CardDescription>
                  {favoriteProducts.length === 0 
                    ? "You haven't added any favorites yet"
                    : `${favoriteProducts.length} items in your favorites`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-heart text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start browsing and save your favorite Simpsons toys!
                    </p>
                    <Link href="/products">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`}>
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-orange-500 font-bold">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your past orders and track their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-box text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Your order history will appear here after you make your first purchase.
                    </p>
                    <Link href="/products">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-yellow-50 dark:bg-slate-800 rounded-lg p-6 border border-yellow-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Order #{order.id}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatMoney(order.total)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-yellow-200 dark:border-slate-600 pt-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            Items ({order.items.length})
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg bg-white"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </h5>
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive updates about your orders and new products
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Privacy Settings
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Control how your data is used and shared
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Change Password
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Update your account password
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Actions that affect your account permanently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                  >
                    <i className="fas fa-sign-out-alt mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
