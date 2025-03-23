import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@/services/googleAuthService";

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

// Admin phone number that bypasses OTP verification
const ADMIN_PHONE = '+971507493651';
const ADMIN_PASSWORD = 'admin123'; // Simple password for admin account

export const phoneOtpSignIn = async (phone: string) => {
  try {
    // Normalize the phone number for comparison
    const normalizedPhone = phone.replace(/\s+/g, '');
    
    // Check if this is the admin phone number
    if (normalizedPhone === ADMIN_PHONE) {
      console.log("Admin phone detected, bypassing OTP verification completely");
      
      // For admin phone, we'll try to sign in directly with password
      try {
        // First try to sign in with password
        const { data, error } = await supabase.auth.signInWithPassword({
          phone: normalizedPhone,
          password: ADMIN_PASSWORD
        });
        
        if (error) {
          console.log("Admin sign in failed, creating account:", error);
          
          // If sign in fails, try to create the account
          const signUpResponse = await supabase.auth.signUp({
            phone: normalizedPhone,
            password: ADMIN_PASSWORD,
            options: {
              data: {
                display_name: 'Admin User',
                is_admin: true
              }
            }
          });
          
          if (signUpResponse.error) {
            console.error("Failed to create admin account:", signUpResponse.error);
          } else {
            console.log("Admin account created successfully:", signUpResponse.data);
          }
        } else {
          console.log("Admin signed in successfully:", data);
        }
      } catch (signInError) {
        console.error("Error during admin direct sign in:", signInError);
      }
      
      // Set flag for the OTP component to auto-proceed
      localStorage.setItem('admin_bypass_otp', 'true');
      localStorage.setItem('admin_phone', normalizedPhone);
      localStorage.setItem('admin_auto_signin', 'true');
      
      return true;
    }
    
    // Normal flow for non-admin phones
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
    // Check if this is the admin bypass flow
    const isAdminBypass = localStorage.getItem('admin_bypass_otp') === 'true';
    const adminPhone = localStorage.getItem('admin_phone');
    const isAutoSignIn = localStorage.getItem('admin_auto_signin') === 'true';
    
    if (isAdminBypass && phone === adminPhone) {
      console.log("Admin phone verification bypass activated");
      
      // Clear the bypass flags
      localStorage.removeItem('admin_bypass_otp');
      localStorage.removeItem('admin_phone');
      localStorage.removeItem('admin_auto_signin');
      
      // If we've already signed in during the phoneOtpSignIn step, just return success
      if (isAutoSignIn) {
        console.log("Admin already signed in, skipping verification");
        toast.success('Admin signed in successfully');
        return true;
      }
      
      // Otherwise, try to sign in now
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password: ADMIN_PASSWORD
      });
      
      if (error) {
        console.error("Admin sign in error:", error);
        
        // If sign in fails, try to create the account
        const signUpResponse = await supabase.auth.signUp({
          phone,
          password: ADMIN_PASSWORD,
          options: {
            data: {
              display_name: 'Admin User',
              is_admin: true
            }
          }
        });
        
        if (signUpResponse.error) {
          throw signUpResponse.error;
        }
        
        console.log("Admin account created and signed in:", signUpResponse.data);
        toast.success('Admin account created and signed in');
        return true;
      }
      
      console.log("Admin signed in successfully:", data);
      toast.success('Admin signed in successfully');
      return true;
    }
    
    // Normal flow for non-admin phones
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

// Import and re-export the googleSignIn function from googleAuthService
import { googleSignIn as originalGoogleSignIn } from "@/services/googleAuthService";

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
