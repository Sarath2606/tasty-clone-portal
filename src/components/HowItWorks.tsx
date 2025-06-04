
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Clock, Utensils } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      number: "1",
      title: "Browse Menu",
      description: "Explore our delicious menu items and find your favorites."
    },
    {
      icon: ShoppingCart,
      number: "2", 
      title: "Add to Cart",
      description: "Select your desired items and add them to your cart."
    },
    {
      icon: Clock,
      number: "3",
      title: "Checkout", 
      description: "Review your order and proceed to secure payment."
    },
    {
      icon: Utensils,
      number: "4",
      title: "Enjoy Your Meal",
      description: "Get your food delivered hot and fresh to your doorstep."
    }
  ];

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            How It <span className="text-green-500">Works</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Ordering your favorite food is just a few clicks away
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg">
            Order Now
          </Button>
        </div>
      </div>
    </section>
  );
};
