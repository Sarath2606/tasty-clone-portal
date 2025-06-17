import { useState } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "Perfect for individuals",
    price: 499,
    duration: 1,
    features: [
      "Daily breakfast delivery",
      "Basic menu options",
      "Standard delivery time",
      "Email support"
    ]
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "Best for families",
    price: 999,
    duration: 1,
    features: [
      "Daily breakfast delivery",
      "Extended menu options",
      "Priority delivery",
      "24/7 support",
      "Free delivery",
      "Customizable menu"
    ],
    isPopular: true
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "For large groups",
    price: 1999,
    duration: 1,
    features: [
      "Daily breakfast delivery",
      "Full menu access",
      "Express delivery",
      "Dedicated support",
      "Free delivery",
      "Customizable menu",
      "Bulk ordering",
      "Corporate billing"
    ]
  }
];

export default function Plans() {
  const { profile } = useUserProfile();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!profile) {
      toast.error("Please log in to subscribe");
      return;
    }

    try {
      // Here you would typically integrate with a payment gateway
      toast.success("Subscription successful!");
      setSelectedPlan(planId);
    } catch (error) {
      toast.error("Failed to subscribe");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 text-lg">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.isPopular ? "border-green-500 shadow-lg" : ""
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.isPopular
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
                onClick={() => handleSubscribe(plan.id)}
              >
                Subscribe Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 