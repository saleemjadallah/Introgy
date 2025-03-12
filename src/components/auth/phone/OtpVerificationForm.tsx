
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            placeholder="6-digit code"
            value={otp}
            onChange={onOtpChange}
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
          onClick={onResendOtp}
          disabled={isLoading}
        >
          Resend verification code
        </Button>
      </div>
    </form>
  );
};
