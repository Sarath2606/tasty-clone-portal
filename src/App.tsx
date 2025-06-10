import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Plans from "./pages/Plans";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import { Orders } from "./pages/Orders";
import { Subscriptions } from "./pages/Subscriptions";
import { OrderHistory } from "./pages/OrderHistory";
import { Notifications } from "./pages/Notifications";
import { Support } from "./pages/Support";
import { ProfileTest } from "./components/ProfileTest";
import { CartProvider } from "./contexts/CartContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MessageLimitProvider } from "./contexts/MessageLimitContext";
import { Toaster } from "sonner";

export const App = () => {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <CartProvider>
          <MessageLimitProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/orders" element={<Orders />} />
                <Route path="/profile/order-history" element={<OrderHistory />} />
                <Route path="/profile/subscriptions" element={<Subscriptions />} />
                <Route path="/profile/notifications" element={<Notifications />} />
                <Route path="/profile/support" element={<Support />} />
                <Route path="/profile/test" element={<ProfileTest />} />
              </Route>
            </Routes>
            <Toaster />
          </MessageLimitProvider>
        </CartProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
};
