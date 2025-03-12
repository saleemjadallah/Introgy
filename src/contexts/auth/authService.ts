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
  try {
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

export const getSession = async () => {
  return await supabase.auth.getSession();
};
