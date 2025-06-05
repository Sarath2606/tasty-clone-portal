import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-green-400">Your Cart</h1>
          {cart.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center bg-gray-900 rounded-lg p-4 gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-green-300">{item.name}</div>
                    <div className="text-gray-400 text-sm mb-2">₹{item.price} x {item.quantity}</div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="transition-transform duration-150 active:scale-90">-</Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="transition-transform duration-150 active:scale-110">+</Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-bold text-green-400">₹{item.price * item.quantity}</div>
                    <Button size="sm" variant="destructive" onClick={() => updateQuantity(item.id, 0)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center bg-gray-900 rounded-lg p-4">
                <div className="text-xl font-bold text-green-400">Total</div>
                <div className="text-2xl font-bold">₹{getCartTotal()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-green-500/20 p-4 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Total Amount</span>
              <span className="text-xl font-bold text-green-400">₹{getCartTotal()}</span>
            </div>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-black font-semibold text-lg px-6 py-4 transition-transform duration-200 active:scale-95"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 