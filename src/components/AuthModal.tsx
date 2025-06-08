import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/auth";

export const AuthModal: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="w-[90vw] max-w-sm rounded-2xl p-7 bg-white border border-gray-200 animate-[dialog-pop_0.3s_ease] flex flex-col items-center"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img src="/try.png" alt="MorningTiffin Logo" className="w-14 h-14 object-contain rounded-full mb-5" />
        <h2 className="text-2xl font-bold text-center mb-1">Unlimited free access to tasty recipes</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Sign up to get delicious food inspiration delivered to your inbox</p>
        {!showEmailForm ? (
          <>
            <Button
              className="w-full bg-black text-white rounded-full py-5 text-base font-semibold mb-3"
              onClick={() => { setShowEmailForm(true); setIsLogin(false); }}
            >
              Continue with email
            </Button>
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full border border-gray-300 rounded-full flex items-center justify-center gap-2 py-5 font-medium mb-6"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>
          </>
        ) : (
          <form className="w-full flex flex-col gap-3 mb-4" onSubmit={handleEmailAuth}>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="bg-white border border-gray-300 rounded-lg px-3 py-2"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-full py-3 text-base font-semibold mt-2"
            >
              {loading ? "Loading..." : isLogin ? "Log in" : "Sign up"}
            </Button>
            {error && <span className="text-red-500 text-sm text-center">{error}</span>}
          </form>
        )}
        <div className="w-full flex flex-col items-center mt-2">
          <p className="text-xs text-gray-400 text-center mb-2">
            By continuing, you agree to the <a href="#" className="underline">Terms of Service</a> and acknowledge you've read our <a href="#" className="underline">Privacy Policy</a>.
          </p>
          {showEmailForm ? (
            <span className="text-xs text-gray-500">
              {isLogin ? "Don't have an account? " : "Already a member? "}
              <button
                className="underline text-black ml-1"
                onClick={() => setIsLogin(l => !l)}
                type="button"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
              <span className="mx-1">|</span>
              <button
                className="underline text-black"
                onClick={() => setShowEmailForm(false)}
                type="button"
              >
                Back
              </button>
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              Already a member?{' '}
              <button
                className="underline text-black"
                onClick={() => { setShowEmailForm(true); setIsLogin(true); }}
                type="button"
              >
                Log in
              </button>
            </span>
          )}
          <img src="/try.png" alt="MorningTiffin Logo" className="w-8 h-8 object-contain rounded-full mt-4" />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 