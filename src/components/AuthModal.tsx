
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Phone, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onSwitchMode: (mode: "login" | "signup") => void;
}

export const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const countryCodes = [
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+86", country: "CN" },
    { code: "+33", country: "FR" },
    { code: "+49", country: "DE" },
    { code: "+81", country: "JP" },
    { code: "+82", country: "KR" },
    { code: "+61", country: "AU" },
    { code: "+55", country: "BR" }
  ];

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
    }
  };

  const sendOtp = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setIsOtpSent(true);
      
      toast({
        title: "OTP Sent",
        description: "Verification code has been sent to your phone",
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { PhoneAuthProvider, signInWithCredential } = await import("firebase/auth");
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      
      toast({
        title: "Success",
        description: "Phone number verified successfully! Welcome to MorningTiffin!",
      });
      
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      let errorMessage = "Invalid OTP. Please try again.";
      
      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "Invalid verification code";
      } else if (error.code === "auth/code-expired") {
        errorMessage = "Verification code has expired. Please request a new one.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber("");
    setCountryCode("+1");
    setOtp("");
    setVerificationId("");
    setIsOtpSent(false);
  };

  const handleBackToPhone = () => {
    setIsOtpSent(false);
    setOtp("");
    setVerificationId("");
  };

  return (
    <>
      <div id="recaptcha-container"></div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md mx-4 rounded-2xl shadow-2xl">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isOtpSent ? "Verify OTP" : "Phone Verification"}
            </DialogTitle>
            <p className="text-gray-600 text-sm">
              {isOtpSent 
                ? `Enter the 6-digit code sent to ${countryCode}${phoneNumber}` 
                : "Enter your phone number to get started"
              }
            </p>
          </DialogHeader>
          
          {!isOtpSent ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                <div className="flex space-x-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-20 h-12 border border-gray-300 rounded-lg px-2 text-sm focus:border-green-500 focus:ring-green-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      required
                      className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                      placeholder="Enter phone number"
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={sendOtp}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-700 font-medium">Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={verifyOtp}
                  className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleBackToPhone}
                    variant="outline"
                    className="flex-1 h-10"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={sendOtp}
                    variant="outline"
                    className="flex-1 h-10"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
