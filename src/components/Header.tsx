import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="container mx-auto px-2 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <img src="/try.png" alt="MorningTiffin Logo" className="w-8 h-8 object-contain" />
          <span className="text-white text-xl font-bold">
            Morning<span className="text-green-500">Tiffin</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-white hover:text-green-500 transition-colors">Home</Link>
          <Link to="/menu" className="text-white hover:text-green-500 transition-colors">Menu</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-green-500">
            <User className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-green-500 relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-6 hidden md:flex"
            onClick={() => navigate('/menu')}
          >
            Order Now
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <nav className="container mx-auto px-2 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-white hover:text-green-500 transition-colors">Home</Link>
            <Link to="/menu" className="text-white hover:text-green-500 transition-colors">Menu</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

