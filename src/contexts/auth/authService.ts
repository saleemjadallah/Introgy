
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const emailSignIn = async (email: string, password: string) => {
  const response = await supabase.auth.signInWithPassword({ email, password: password || "" });
  if (response?.error) {
    throw response.error;
  }
  return response;
};

export const phoneSignIn = async (phone: string, password: string) => {
  const response = await supabase.auth.signInWithPassword({ phone, password });
  if (response?.error) {
    throw response.error;
  }
  return response;
};

export const emailSignUp = async (email: string, password: string, displayName?: string) => {
  const response = await supabase.auth.signUp({
    email,
    password: password || "",
    options: {
      data: {
        display_name: displayName
      }
    }
  });
  
  if (response?.error) {
    throw response.error;
  }
  
  return response;
};

export const phoneSignUp = async (phone: string, password: string, displayName?: string) => {
  const response = await supabase.auth.signUp({
    phone,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });
  
  if (response?.error) {
    throw response.error;
  }
  
  return response;
};

export const googleSignIn = async (redirectTo: string) => {
  console.log("Starting Google sign in flow");
  console.log("Redirect URL:", redirectTo);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo
    }
  });

  if (error) {
    console.error("Google OAuth error:", error);
    throw error;
  }

  console.log("Google OAuth initiated successfully:", data);
  return data;
};

export const phoneOtpSignIn = async (phone: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    console.error("OTP error:", error);
    throw error;
  }
  
  console.log("OTP sent successfully to:", phone);
  toast.success('Verification code sent to your phone');
  return true;
};

export const verifyPhoneOtp = async (phone: string, token: string) => {
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  });

  if (error) {
    throw error;
  }
  
  toast.success('Phone verified successfully');
  return true;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return true;
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};
