import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const MENU_DATA = [
  {
    section: "Tiffin",
    items: [
      {
        id: "dosa",
        name: "Dosa",
        image: "https://ik.imagekit.io/miht812xe/240_F_397466683_4U8hMaUgWdFPNc8KMKUQ4aH2qR1yG0sA.jpg?updatedAt=1748076573585",
        price: 60,
      },
      {
        id: "idly",
        name: "Idly",
        image: "https://ik.imagekit.io/miht812xe/Idly%20photo.jpg?updatedAt=1748076573316",
        price: 50,
      },
      {
        id: "bread-omlet",
        name: "Bread Omlet",
        image: "https://ik.imagekit.io/miht812xe/bread.jpeg?updatedAt=1748435903011",
        price: 70,
      },
    ],
  },
  {
    section: "Salads",
    items: [
      {
        id: "salatrus-salad",
        name: "Salatrus Salad",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        price: 80,
      },
    ],
  },
  {
    section: "Beverages",
    items: [
      {
        id: "tea",
        name: "Tea",
        image: "https://ik.imagekit.io/miht812xe/download.jpeg?updatedAt=1748077178388",
        price: 20,
      },
      {
        id: "coffee",
        name: "Coffee",
        image: "https://ik.imagekit.io/miht812xe/images%20(1).jpeg?updatedAt=1748077124214",
        price: 30,
      },
    ],
  },
  {
    section: "Drinks",
    items: [
      {
        id: "coco-cola",
        name: "Coco Cola",
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        price: 40,
      },
    ],
  },
];

const Menu = () => {
  const { cart, addToCart, updateQuantity, getCartTotal } = useCart();
  const [quantities, setQuantities] = useState({});
  const [showQty, setShowQty] = useState({});
  const [added, setAdded] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemRefs = useRef({});
  const sectionRefs = useRef({});
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Sync local quantities with cart
    const q = {};
    const s = {};
    cart.forEach((item) => {
      q[item.id] = item.quantity;
      if (item.quantity > 0) s[item.id] = true;
    });
    setQuantities(q);
    setShowQty(s);
  }, [cart]);

  // Set page as loaded after initial render
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Handle search state and scroll to item or section
  useEffect(() => {
    if (!isPageLoaded) return;

    const searchId = location.state?.search;
    const category = searchParams.get('category');
    
    if (searchId && itemRefs.current[searchId]) {
      setTimeout(() => {
        itemRefs.current[searchId].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        const element = itemRefs.current[searchId];
        element.classList.add('highlight-item');
        setTimeout(() => {
          element.classList.remove('highlight-item');
        }, 2000);
      }, 100);
    } else if (category) {
      // Wait for the page to be fully rendered
      setTimeout(() => {
        // Normalize the category name to match section names
        const normalizedCategory = category.toLowerCase();
        
        // Find the matching section
        const matchingSection = MENU_DATA.find(
          section => section.section.toLowerCase() === normalizedCategory
        )?.section;

        if (matchingSection && sectionRefs.current[matchingSection]) {
          const sectionElement = sectionRefs.current[matchingSection];
          
          // Ensure the element is in the DOM and scroll to it
          if (sectionElement) {
            // Calculate the offset to account for the header
            const headerOffset = 100;
            const elementPosition = sectionElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // Add highlight effect to the section
            sectionElement.classList.add('highlight-section');
            setTimeout(() => {
              sectionElement.classList.remove('highlight-section');
            }, 2000);
          }
        }
      }, 500); // Increased timeout to ensure DOM is ready
    }
  }, [location.state, searchParams, isPageLoaded]);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    setShowQty((prev) => ({ ...prev, [item.id]: true }));
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 600);
  };

  const handleQuantityChange = (id, delta, item) => {
    const newQty = Math.max(0, (quantities[id] || 0) + delta);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
    if (newQty > 0) {
      updateQuantity(id, newQty);
    } else {
      updateQuantity(id, 0);
      setTimeout(() => setShowQty((prev) => ({ ...prev, [id]: false })), 200);
    }
  };

  const handleCheckout = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>
        {`
          .highlight-section {
            animation: highlight 2s ease-in-out;
          }
          
          @keyframes highlight {
            0%, 100% {
              background-color: transparent;
            }
            50% {
              background-color: rgba(34, 197, 94, 0.2);
            }
          }
        `}
      </style>
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-green-400">Menu</h1>
          {MENU_DATA.map((section) => (
            <div key={section.section} className="mb-10">
              <h2
                ref={el => sectionRefs.current[section.section] = el}
                className="text-2xl font-semibold mb-4 text-green-300 transition-all duration-300"
              >
                {section.section}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <Card 
                    key={item.id} 
                    ref={el => itemRefs.current[item.id] = el}
                    className="bg-white border-green-500/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <CardHeader>
                      <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-md mb-2" />
                      <CardTitle className="text-lg font-semibold mb-1 text-black">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    </CardContent>
                    <CardFooter>
                      {!showQty[item.id] ? (
                        <Button
                          className={`w-full bg-green-500 hover:bg-green-600 text-black font-semibold transition-all duration-200 active:scale-95 ${added[item.id] ? "scale-105 bg-green-400" : ""}`}
                          onClick={() => handleAddToCart(item)}
                        >
                          {added[item.id] ? "Added!" : "Add to Cart"}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center w-full gap-3 animate-fade-in">
                          <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.id, -1, item)} className="transition-transform duration-150 active:scale-90">-</Button>
                          <span className="w-8 text-center text-lg font-semibold text-black">{quantities[item.id] || 0}</span>
                          <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.id, 1, item)} className="transition-transform duration-150 active:scale-110">+</Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Checkout Button */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-green-500/20 p-4 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Total Amount</span>
              <span className="text-xl font-bold text-green-400">₹{getCartTotal()}</span>
            </div>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-black font-semibold text-lg px-6 py-4 transition-transform duration-200 active:scale-95"
              onClick={handleCheckout}
            >
              Proceed to Cart
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .highlight-item {
          animation: highlight 2s ease;
        }
        @keyframes highlight {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(34, 197, 94, 0.3); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .highlight-section {
          animation: highlightSection 2s ease;
        }
        @keyframes highlightSection {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(34, 197, 94, 0.3); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </div>
  );
};

export default Menu; 