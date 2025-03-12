
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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    try {
      // Wait for the OTP to be sent successfully
      const success = await signInWithOTP(phone);
      console.log("OTP send result:", success);
      
      if (success) {
        // Only change form state if OTP was sent successfully
        setFormState("OTP_INPUT");
        toast.success("Verification code sent to your phone");
      } else {
        setError("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send verification code. Please try again.");
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
