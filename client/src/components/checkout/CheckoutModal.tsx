import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { formatMoney, calculateTax, isEligibleForFreeShipping } from '../../utils/formatMoney';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ShippingAddress } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Shipping form state
  const [shippingData, setShippingData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const subtotal = total;
  const tax = calculateTax(subtotal);
  const shipping = isEligibleForFreeShipping(subtotal) ? 0 : 9.99;
  const finalTotal = subtotal + tax + shipping;

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order",
        variant: "destructive",
      });
      return false;
    }

    const requiredShippingFields: (keyof ShippingAddress)[] = [
      'firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'
    ];

    for (const field of requiredShippingFields) {
      if (!shippingData[field].trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
        toast({
          title: "Payment Information Required",
          description: "Please fill in all payment details",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      toast({
        title: "Processing Payment",
        description: "Please wait while we process your order...",
      });

      // Create order (includes 3-second delay simulation)
      const order = await createOrder(
        items,
        finalTotal,
        shippingData,
        paymentMethod === 'card' ? 'Credit Card' : 'PayPal'
      );

      // Clear cart
      clearCart();

      // Close modal
      onClose();

      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.id} has been confirmed. Check your email for details.`,
      });

    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Secure Checkout
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={shippingData.firstName}
                    onChange={(e) => handleShippingChange('firstName', e.target.value)}
                    placeholder="Homer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={shippingData.lastName}
                    onChange={(e) => handleShippingChange('lastName', e.target.value)}
                    placeholder="Simpson"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingData.email}
                  onChange={(e) => handleShippingChange('email', e.target.value)}
                  placeholder="homer@springfield.com"
                  required
                />
              </div>
              
              <div className="mt-4">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={shippingData.address}
                  onChange={(e) => handleShippingChange('address', e.target.value)}
                  placeholder="742 Evergreen Terrace"
                  required
                />
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingData.city}
                    onChange={(e) => handleShippingChange('city', e.target.value)}
                    placeholder="Springfield"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={shippingData.state} onValueChange={(value) => handleShippingChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={shippingData.zipCode}
                    onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Information
              </h3>
              
              {/* Payment Methods */}
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                    <i className="fas fa-credit-card text-gray-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                    <i className="fab fa-paypal text-blue-600" />
                    <span className="font-medium">PayPal</span>
                  </Label>
                </div>
              </RadioGroup>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:pl-8">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatMoney(item.total)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-2 text-sm border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-900 dark:text-white"}>
                    {shipping === 0 ? 'Free' : formatMoney(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-gray-900 dark:text-white">{formatMoney(tax)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">{formatMoney(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="w-full mt-6 bg-blue-900 hover:bg-blue-800 text-white py-4 text-lg font-bold"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock mr-2" />
                    Place Secure Order
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                <i className="fas fa-shield-alt mr-1" />
                Your payment information is encrypted and secure
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
