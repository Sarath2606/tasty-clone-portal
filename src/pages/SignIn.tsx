import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto">
        <SignIn
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
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/profile"
        />
      </div>
    </div>
  );
}; 