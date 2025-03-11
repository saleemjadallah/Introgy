
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

type FormState = "PHONE_INPUT" | "OTP_INPUT";

export const PhoneAuthForm = ({ mode }: { mode: "signin" | "signup" }) => {
  const [formState, setFormState] = useState<FormState>("PHONE_INPUT");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  
  const { signInWithOTP, verifyOTP, isLoading } = useAuth();

  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/[^\d+]/g, "");
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

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

  return (
    <div className="space-y-4">
      {formState === "PHONE_INPUT" && (
        <form onSubmit={handlePhoneSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1XXXXXXXXXX"
                value={phone}
                onChange={handlePhoneChange}
                required
                inputMode="tel"
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +1 for US)
              </p>
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </div>
        </form>
      )}

      {formState === "OTP_INPUT" && (
        <form onSubmit={handleOtpSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                required
                inputMode="numeric"
              />
              <p className="text-xs text-muted-foreground">
                Enter the verification code sent to {phone}
              </p>
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-sm"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Resend verification code
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
