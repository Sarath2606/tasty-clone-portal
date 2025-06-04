
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const FeaturedItems = () => {
  const [activeTab, setActiveTab] = useState("Popular");
  
  const menuItems = [
    {
      name: "Dosa",
      price: "₹60",
      image: "🫓",
      description: "Crispy South Indian crepe with chutneys"
    },
    {
      name: "Idly",
      price: "₹50", 
      image: "⚪",
      description: "Soft steamed rice cakes with sambar"
    },
    {
      name: "Bread Omlet",
      price: "₹70",
      image: "🍳",
      description: "Fluffy omelet with bread and spices"
    }
  ];

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
              <div className="h-48 bg-gradient-to-br from-orange-400 to-yellow-600 flex items-center justify-center">
                <span className="text-6xl">{item.image}</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-xl font-semibold">{item.name}</h3>
                  <span className="text-green-500 text-xl font-bold">{item.price}</span>
                </div>
                <p className="text-gray-400 mb-6">{item.description}</p>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
