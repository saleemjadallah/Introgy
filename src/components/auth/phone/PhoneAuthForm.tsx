
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { PhoneInputForm } from "./PhoneInputForm";
import { OtpVerificationForm } from "./OtpVerificationForm";
import { formatPhoneNumber } from "../utils/phoneUtils";
import { toast } from "sonner";

type FormState = "PHONE_INPUT" | "OTP_INPUT";

export const PhoneAuthForm = ({ mode }: { mode: "signin" | "signup" }) => {
  const [formState, setFormState] = useState<FormState>("PHONE_INPUT");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  
  const { signInWithOTP, verifyOTP, isLoading } = useAuth();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  // Admin phone number that bypasses OTP verification
const ADMIN_PHONE = '+971507493651';

const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    // Normalize the phone number for comparison
    const normalizedPhone = phone.replace(/\s+/g, '');
    const isAdminPhone = normalizedPhone === ADMIN_PHONE;
    
    try {
      if (isAdminPhone) {
        console.log("Admin phone detected, attempting direct sign-in");
        // For admin phone, we'll try to sign in directly
        // The actual sign-in happens in the authService.phoneOtpSignIn function
      }
      
      // Wait for the OTP to be sent successfully or admin bypass
      const success = await signInWithOTP(normalizedPhone);
      console.log("Auth process result:", success);
      
      if (success) {
        // Only change form state if the process was successful
        setFormState("OTP_INPUT");
        
        if (isAdminPhone) {
          console.log("Admin phone detected, bypassing OTP notification");
          // For admin, we don't show the toast about verification code
        } else {
          toast.success("Verification code sent to your phone");
        }
      } else {
        setError("Failed to process authentication. Please try again.");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error?.message || "Failed to process authentication. Please try again.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }
    
    try {
      console.log("Verifying OTP:", { phone, otp });
      await verifyOTP(phone, otp);
      // Success is handled by the auth context (redirect, etc.)
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      const success = await signInWithOTP(phone);
      if (success) {
        toast.success("Verification code resent to your phone");
      } else {
        setError("Failed to resend verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend verification code. Please try again.");
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input, maximum 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleBackToPhone = () => {
    setFormState("PHONE_INPUT");
    setOtp("");
    setError("");
  };

  return (
    <div className="space-y-4">
      {formState === "PHONE_INPUT" ? (
        <PhoneInputForm
          phone={phone}
          onPhoneChange={handlePhoneChange}
          onSubmit={handlePhoneSubmit}
          error={error}
          isLoading={isLoading}
        />
      ) : (
        <OtpVerificationForm
          phone={phone}
          otp={otp}
          onOtpChange={handleOtpChange}
          onSubmit={handleOtpSubmit}
          onResendOtp={handleResendOtp}
          error={error}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
