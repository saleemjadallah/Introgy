
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputFormProps {
  phone: string;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  error: string;
  isLoading: boolean;
}

export const PhoneInputForm = ({ 
  phone, 
  onPhoneChange, 
  onSubmit, 
  error, 
  isLoading 
}: PhoneInputFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="+1XXXXXXXXXX"
            value={phone}
            onChange={onPhoneChange}
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
  );
};
