
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

type FormState = "PHONE_INPUT" | "OTP_INPUT" | "PASSWORD_INPUT";

export const PhoneAuthForm = ({ mode }: { mode: "signin" | "signup" }) => {
  const [formState, setFormState] = useState<FormState>("PHONE_INPUT");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  
  const { signInWithOTP, verifyOTP, signUp, isLoading } = useAuth();

  const formatPhoneNumber = (input: string) => {
    // Allow only digits and plus sign for international format
    const cleaned = input.replace(/[^\d+]/g, "");
    
    // Ensure the phone number starts with a plus sign if not already
    const formatted = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
    
    return formatted;
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
    
    if (mode === "signup") {
      setFormState("PASSWORD_INPUT");
    } else {
      try {
        await signInWithOTP(phone);
        setFormState("OTP_INPUT");
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!password) {
      setError("Password is required");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await signUp({ phone, password, displayName });
      setFormState("OTP_INPUT");
    } catch (error) {
      console.error("Error during signup:", error);
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
    }
  };

  const handleResendOtp = async () => {
    try {
      await signInWithOTP(phone);
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  const handleBack = () => {
    if (formState === "OTP_INPUT") {
      setFormState(mode === "signup" ? "PASSWORD_INPUT" : "PHONE_INPUT");
    } else if (formState === "PASSWORD_INPUT") {
      setFormState("PHONE_INPUT");
    }
  };

  return (
    <div className="space-y-4">
      {formState === "PHONE_INPUT" && (
        <form onSubmit={handlePhoneSubmit}>
          <div className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            )}
            
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

      {formState === "PASSWORD_INPUT" && (
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Create Account"}
              </Button>
            </div>
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
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
            
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
