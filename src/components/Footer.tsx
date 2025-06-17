import { Link, useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // Navigate to the path
    navigate(path);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/try.png" alt="MorningTiffin Logo" className="w-12 h-12 object-contain rounded-full" />
              <span className="text-white text-xl font-bold">
                Morning<span className="text-green-500">Tiffin</span>
              </span>
            </div>
            <p className="text-gray-400">
              Fresh, healthy tiffin meals delivered to your doorstep every morning.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleNavigation('/')} className="text-gray-400 hover:text-green-500">Home</button></li>
              <li><button onClick={() => handleNavigation('/menu')} className="text-gray-400 hover:text-green-500">Menu</button></li>
              <li><button onClick={() => handleNavigation('/plans')} className="text-gray-400 hover:text-green-500">Plans</button></li>
              <li><button onClick={() => handleNavigation('/profile/support')} className="text-gray-400 hover:text-green-500">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleNavigation('/menu?category=tiffins')} className="text-gray-400 hover:text-green-500">Tiffins</button></li>
              <li><button onClick={() => handleNavigation('/menu?category=salads')} className="text-gray-400 hover:text-green-500">Salads</button></li>
              <li><button onClick={() => handleNavigation('/menu?category=beverages')} className="text-gray-400 hover:text-green-500">Beverages</button></li>
              <li><button onClick={() => handleNavigation('/menu?category=drinks')} className="text-gray-400 hover:text-green-500">Drinks</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">📞 +91 98765 43210</li>
              <li className="text-gray-400">✉️ info@morningtiffin.com</li>
              <li className="text-gray-400">📍 Your City, India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} MorningTiffin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
