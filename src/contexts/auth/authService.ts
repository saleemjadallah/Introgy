import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { googleSignIn as originalGoogleSignIn } from "@/services/googleAuthService";

// Type definition for GoogleAuth plugin
interface GoogleAuthPluginInterface {
  signIn(): Promise<any>;
  signInWithSupabase(): Promise<{ idToken: string; accessToken: string }>;
  signOut(): Promise<{ success: boolean }>;
  refresh(): Promise<{ idToken: string; accessToken: string }>;
  isSignedIn(): Promise<{ isSignedIn: boolean }>;
  getCurrentUser(): Promise<any>;
  disconnect(): Promise<{ success: boolean }>;
}

export const phoneOtpSignIn = async (phone: string) => {
  try {
    // Normal flow for all phones
    console.log("Sending OTP to:", phone);
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      console.error("OTP error:", error);
      throw error;
    }
    
    console.log("OTP sent successfully to:", phone);
    return true;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

export const verifyPhoneOtp = async (phone: string, token: string) => {
  try {
    // Normal flow for all phones
    console.log("Verifying OTP:", { phone, token });
    const { error, data } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });

    if (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
    
    console.log("OTP verification successful:", data);
    toast.success('Phone verified successfully');
    return true;
  } catch (error) {
    console.error("OTP verification failed:", error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return true;
};

// Re-export the googleSignIn function from googleAuthService
export const googleSignIn = async () => {
  try {
    return await originalGoogleSignIn();
  } catch (error) {
    console.error("Error during Google sign-in from authService:", error);
    toast.error('Sign-in failed');
    throw error;
  }
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};
