import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedItems } from "@/components/FeaturedItems";
import { HowItWorks } from "@/components/HowItWorks";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Hero />
      <Categories />
      <FeaturedItems />
      <HowItWorks />
    </div>
  );
};

export default Index;
