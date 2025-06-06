import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { App } from "./App";
import "./index.css";

// Replace this with your actual Clerk publishable key
const PUBLISHABLE_KEY = "pk_test_Z29yZ2VvdXMtYnVnLTUyLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: "bg-green-600 hover:bg-green-700",
          footerActionLink: "text-green-600 hover:text-green-700",
          card: "bg-gray-800 border border-gray-700",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-gray-700 text-white hover:bg-gray-600",
          formFieldLabel: "text-gray-300",
          formFieldInput: "bg-gray-700 border-gray-600 text-white",
          formFieldAction: "text-green-500 hover:text-green-400",
          footerAction: "text-gray-400",
          identityPreviewEditButton: "text-green-500 hover:text-green-400",
          otpCodeFieldInput: "bg-gray-700 border-gray-600 text-white",
          formResendCodeLink: "text-green-500 hover:text-green-400",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/profile"
      signUpFallbackRedirectUrl="/profile"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
