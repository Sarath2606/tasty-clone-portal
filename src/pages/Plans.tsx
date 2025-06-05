import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Plans = () => {
  const plans = [
    {
      title: "Daily Plan",
      price: "₹199",
      period: "per day",
      description: "Perfect for trying out our service",
      features: [
        "1 meal per day",
        "Fresh ingredients",
        "Free delivery",
        "Basic menu options",
        "24/7 support"
      ],
      popular: false
    },
    {
      title: "Weekly Plan",
      price: "₹1,299",
      period: "per week",
      description: "Most popular choice for regular customers",
      features: [
        "7 meals per week",
        "Priority delivery",
        "Menu customization",
        "Free delivery",
        "Premium menu options",
        "24/7 support",
        "Weekly menu preview"
      ],
      popular: true
    },
    {
      title: "Monthly Plan",
      price: "₹4,999",
      period: "per month",
      description: "Best value for long-term commitment",
      features: [
        "30 meals per month",
        "Priority delivery",
        "Full menu access",
        "Free delivery",
        "Menu customization",
        "24/7 support",
        "Monthly menu preview",
        "Special discounts",
        "Free tiffin box"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select the subscription plan that best fits your needs. All plans include our signature
            morning tiffin service with fresh, healthy meals delivered to your doorstep.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-green-500/20 to-green-500/10 border-2 border-green-500"
                  : "bg-gray-900/50 border border-gray-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                Subscribe Now
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            All plans can be cancelled anytime. Contact our support team for any questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plans; 