import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export const FeaturedItems = () => {
  const [activeTab, setActiveTab] = useState("Popular");
  const { addToCart, cart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showQty, setShowQty] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  
  const menuItems = [
    {
      id: "dosa",
      name: "Dosa",
      price: 60,
      image: "https://ik.imagekit.io/miht812xe/240_F_397466683_4U8hMaUgWdFPNc8KMKUQ4aH2qR1yG0sA.jpg?updatedAt=1748076573585",
      description: "Crispy South Indian crepe with chutneys"
    },
    {
      id: "idly",
      name: "Idly",
      price: 50,
      image: "https://ik.imagekit.io/miht812xe/Idly%20photo.jpg?updatedAt=1748076573316",
      description: "Soft steamed rice cakes with sambar"
    },
    {
      id: "bread-omlet",
      name: "Bread Omlet",
      price: 70,
      image: "https://ik.imagekit.io/miht812xe/bread.jpeg?updatedAt=1748435903011",
      description: "Fluffy omelet with bread and spices"
    }
  ];

  useEffect(() => {
    // Sync local quantities with cart
    const q: Record<string, number> = {};
    const s: Record<string, boolean> = {};
    cart.forEach((item) => {
      q[item.id] = item.quantity;
      if (item.quantity > 0) s[item.id] = true;
    });
    setQuantities(q);
    setShowQty(s);
  }, [cart]);

  const handleAddToCart = (item: typeof menuItems[0]) => {
    // Pass the item directly to addToCart, just like in the Menu page
    addToCart(item, 1);
    setShowQty((prev) => ({ ...prev, [item.id]: true }));
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 600);
    toast.success(`${item.name} added to cart!`);
  };

  const handleQuantityChange = (id: string, change: number, item: typeof menuItems[0]) => {
    const newQuantity = (quantities[id] || 0) + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      updateQuantity(id, 0);
      setShowQty((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured <span className="text-green-500">Menu Items</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Handpicked favorites that our customers love the most
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-full p-1 flex">
            {["Popular", "Regular"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full transition-all ${
                  activeTab === tab 
                    ? "bg-green-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <div className="h-48 relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/try.png';
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-xl font-semibold">{item.name}</h3>
                  <span className="text-green-500 text-xl font-bold">₹{item.price}</span>
                </div>
                <p className="text-gray-400 mb-6">{item.description}</p>
                {!showQty[item.id] ? (
                  <Button 
                    className={`w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-200 active:scale-95 ${added[item.id] ? "scale-105 bg-green-400" : ""}`}
                    onClick={() => handleAddToCart(item)}
                  >
                    {added[item.id] ? "Added!" : "Add to Cart"}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center w-full gap-3 animate-fade-in">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={() => handleQuantityChange(item.id, -1, item)} 
                      className="transition-transform duration-150 active:scale-90"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-lg font-semibold text-white">
                      {quantities[item.id] || 0}
                    </span>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={() => handleQuantityChange(item.id, 1, item)} 
                      className="transition-transform duration-150 active:scale-110"
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
