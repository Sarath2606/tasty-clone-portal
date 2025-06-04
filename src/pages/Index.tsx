import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedItems } from "@/components/FeaturedItems";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onLoginClick={() => openAuthModal("login")} />
      <Hero />
      <Categories />
      <FeaturedItems />
      <HowItWorks />
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
