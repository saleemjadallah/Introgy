
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneInputForm } from "./PhoneInputForm";
import { OtpVerificationForm } from "./OtpVerificationForm";
import { formatPhoneNumber } from "./utils/phoneUtils";

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
      await signInWithOTP(phone);
      // Explicitly set the form state to OTP_INPUT after successfully sending the verification code
      setFormState("OTP_INPUT");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send verification code. Please try again.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!otp || otp.length < 6) {
      setError("Please enter a valid verification code");
      return;
    }
    
    try {
      await verifyOTP(phone, otp);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await signInWithOTP(phone);
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend verification code. Please try again.");
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/\D/g, ""));
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
