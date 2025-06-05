import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import { Menu } from "@/pages/Menu";
import Checkout from "@/pages/Checkout";
import Plans from "@/pages/Plans";
import Cart from "@/pages/Cart";

export const App = () => {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </CartProvider>
    </Router>
  );
};
