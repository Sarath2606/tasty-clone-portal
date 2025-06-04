
export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
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
              <li><a href="#" className="text-gray-400 hover:text-green-500">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Menu</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Plans</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-green-500">Tiffins</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Salads</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Beverages</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Drinks</a></li>
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
            © 2024 MorningTiffin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
