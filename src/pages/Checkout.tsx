import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { MapPicker } from "@/components/ui/map-picker";
import { MapPin } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Checkout() {
  const { cart, getCartTotal, removeAllItems } = useCart();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Tax rate (5%)
  const TAX_RATE = 0.05;

  // Calculate subtotal from actual cart
  const subtotal = getCartTotal();
  
  // Calculate tax
  const tax = subtotal * TAX_RATE;
  
  // Calculate total with delivery charge (placeholder delivery charge)
  const deliveryCharge = 40;
  const total = subtotal + deliveryCharge + tax;

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setDeliveryAddress(location.address);
    setSelectedLocation({ lat: location.lat, lng: location.lng });
    setShowMap(false);
  };

  const handleCheckout = () => {
    if (!deliveryDate || !deliveryTime || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    // Placeholder for actual checkout logic
    setTimeout(() => {
      removeAllItems();
      navigate('/order-confirmation');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary Section */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold border-b pb-2">Order Summary</h2>
            
            {cart.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span>₹{item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Quantity: {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">₹{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Delivery & Payment Section */}
        <div className="space-y-6">
          {/* Delivery Details */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold border-b pb-2">Delivery Details</h2>
              
              <div className="space-y-4">
                <Input placeholder="Full Name" />
                <Input placeholder="Phone Number" type="tel" />
                
                {/* Saved Addresses */}
                {profile?.addresses && profile.addresses.length > 0 && (
                  <div className="space-y-2">
                    <Label>Saved Addresses</Label>
                    <Select onValueChange={(value) => {
                      const selectedAddr = profile.addresses.find(addr => addr.id === value);
                      if (selectedAddr) {
                        setDeliveryAddress(`${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.state}, ${selectedAddr.zipCode}`);
                        if (selectedAddr.latitude && selectedAddr.longitude) {
                          setSelectedLocation({ lat: selectedAddr.latitude, lng: selectedAddr.longitude });
                        }
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a saved address" />
                      </SelectTrigger>
                      <SelectContent>
                        {profile.addresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            {addr.street}, {addr.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input 
                      placeholder="Delivery Address" 
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  <Dialog open={showMap} onOpenChange={setShowMap}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="shrink-0"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Pick Delivery Location</DialogTitle>
                        <DialogDescription>
                          Search for your location or drop a pin on the map
                        </DialogDescription>
                      </DialogHeader>
                      <MapPicker 
                        onLocationSelect={handleLocationSelect}
                        defaultLocation={selectedLocation || undefined}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Select value={addressType} onValueChange={setAddressType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea placeholder="Delivery Instructions (Optional)" />
                
                {/* Delivery Date Selection */}
                <div className="space-y-3">
                  <Label>Select Delivery Date</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {/* Delivery Date Selection content will be removed as per the new code block */}
                  </div>
                </div>

                {/* Delivery Time Selection */}
                {deliveryDate && (
                  <div className="space-y-3">
                    <Label>Select Delivery Time</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {/* Delivery Time Selection content will be removed as per the new code block */}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold border-b pb-2">Payment Method</h2>
              
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">
                  Pay with UPI / Google Pay
                </Button>
                <Button variant="outline" className="w-full">
                  Credit/Debit Card
                </Button>
                <Button variant="outline" className="w-full">
                  Cash on Delivery
                </Button>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox 
                  id="terms" 
                  checked={agreed} 
                  onCheckedChange={(checked) => setAgreed(checked as boolean)} 
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the Terms & Conditions and Refund Policy
                </Label>
              </div>

              <Button 
                className="w-full mt-4" 
                disabled={!agreed || !deliveryDate || !deliveryTime || isProcessing}
                onClick={handleCheckout}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 