import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Plans from "./pages/Plans";
import Cart from "./pages/Cart";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "sonner";

export const App = () => {
  return (
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
      <Toaster />
    </CartProvider>
  );
};
