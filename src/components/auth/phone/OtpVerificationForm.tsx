
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

interface OtpVerificationFormProps {
  phone: string;
  otp: string;
  onOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResendOtp: () => Promise<void>;
  error: string;
  isLoading: boolean;
}

export const OtpVerificationForm = ({
  phone,
  otp,
  onOtpChange,
  onSubmit,
  onResendOtp,
  error,
  isLoading
}: OtpVerificationFormProps) => {
  // Check if this is the admin phone number bypass
  const isAdminBypass = localStorage.getItem('admin_bypass_otp') === 'true';
  const adminPhone = localStorage.getItem('admin_phone');
  const isAdminPhone = phone === adminPhone && isAdminBypass;
  
  // Auto-submit for admin phone
  useEffect(() => {
    if (isAdminPhone && !isLoading) {
      console.log("Admin phone detected, auto-submitting verification");
      // Use a fake OTP code for admin - it won't actually be used
      const fakeEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
      onSubmit(fakeEvent);
    }
  }, [isAdminPhone, isLoading, onSubmit]);
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            placeholder="6-digit code"
            value={isAdminPhone ? '123456' : otp}
            onChange={onOtpChange}
            maxLength={6}
            required
            inputMode="numeric"
            autoFocus
            className="text-center text-lg tracking-widest"
            disabled={isAdminPhone}
          />
          <p className="text-xs text-muted-foreground">
            {isAdminPhone ? 
              "Admin phone detected - automatic verification in progress..." : 
              `Enter the 6-digit verification code sent to ${phone}`}
          </p>
        </div>
        
        {error && <p className="text-sm text-destructive">{error}</p>}
        
        <Button type="submit" className="w-full" disabled={isLoading || (!isAdminPhone && otp.length !== 6)}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full text-sm"
          onClick={onResendOtp}
          disabled={isLoading}
        >
          Resend verification code
        </Button>
      </div>
    </form>
  );
};
