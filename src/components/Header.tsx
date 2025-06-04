
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header = ({ onLoginClick }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-white text-xl font-bold">
            Morning<span className="text-green-500">Tiffin</span>
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-white hover:text-green-500 transition-colors">Home</a>
          <a href="#" className="text-white hover:text-green-500 transition-colors">Menu</a>
          <a href="#" className="text-white hover:text-green-500 transition-colors">Plans</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-green-500">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-green-500 relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white px-6"
            onClick={onLoginClick}
          >
            View Plans
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
            Order Now
          </Button>
        </div>
      </div>
    </header>
  );
};
