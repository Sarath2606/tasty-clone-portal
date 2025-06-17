import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { CartProvider } from "./contexts/CartContext";
import { MessageLimitProvider } from "./contexts/MessageLimitContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import { Orders } from "./pages/Orders";
import { OrderHistory } from "./pages/OrderHistory";
import { Subscriptions } from "./pages/Subscriptions";
import { Notifications } from "./pages/Notifications";
import { Support } from "./pages/Support";
import ProfileTest from "./pages/ProfileTest";
import Payments from "./pages/Payments";
import Cart from "./pages/Cart";
import Menu from "./pages/Menu";
import Plans from "./pages/Plans";
import Address from "./pages/Address";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <CartProvider>
          <MessageLimitProvider>
            <Toaster position="top-center" />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="menu" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="plans" element={<Plans />} />
                <Route path="profile" element={<Profile />}>
                  <Route path="orders" element={<Orders />} />
                  <Route path="order-history" element={<OrderHistory />} />
                  <Route path="subscriptions" element={<Subscriptions />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="support" element={<Support />} />
                  <Route path="test" element={<ProfileTest />} />
                  <Route path="address" element={<Address />} />
                </Route>
              </Route>
            </Routes>
          </MessageLimitProvider>
        </CartProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;
