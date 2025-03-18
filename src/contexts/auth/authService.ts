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

import { Capacitor } from '@capacitor/core';

export const googleSignIn = async (redirectTo: string) => {
  console.log("Starting Google sign in flow");
  
  // Check if we're running in a Capacitor app
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();
  console.log("Current platform:", platform);
  
  // For native apps, use the custom URL scheme
  let finalRedirectUrl = redirectTo;
  if (isNative) {
    // Use the custom URL scheme for mobile apps
    finalRedirectUrl = 'introgy://auth/callback';
    console.log("Using native redirect URL:", finalRedirectUrl);
  } else {
    console.log("Using web redirect URL:", finalRedirectUrl);
  }
  
  try {
    // Configure the OAuth provider options
    const oauthOptions = {
      provider: 'google' as const,
      options: {
        redirectTo: finalRedirectUrl,
        skipBrowserRedirect: false, // We'll handle the redirect manually for better control
        queryParams: {
          // Add a timestamp to prevent caching issues
          '_t': Date.now().toString()
        }
      }
    };
    
    console.log("OAuth options:", JSON.stringify(oauthOptions));
    
    // First, check if we already have a session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      console.log("User already has an active session");
      // Try to refresh the session to ensure it's valid
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshError) {
        console.log("Session refreshed successfully");
        return refreshData;
      }
    }
    
    // Proceed with OAuth sign-in
    const { data, error } = await supabase.auth.signInWithOAuth(oauthOptions);

    if (error) {
      console.error("Google OAuth error:", error);
      throw error;
    }

    if (!data?.url) {
      console.error("No OAuth URL returned from Supabase");
      throw new Error("Authentication failed: No OAuth URL returned");
    }
    
    console.log("OAuth URL from Supabase:", data.url);

    // For native platforms, we need to open the URL manually in the system browser
    if (isNative) {
      console.log("Opening OAuth URL in system browser");
      
      // For iOS, we need to use the Capacitor Browser plugin or window.open with _system
      if (platform === 'ios') {
        // Use window.open with _system target to open in Safari
        window.open(data.url, '_system');
        
        // For iOS, we need to manually save that we're in the middle of authentication
        // This will help us recover if the deep link doesn't work properly
        localStorage.setItem('auth_in_progress', 'true');
        localStorage.setItem('auth_started_at', Date.now().toString());
      } else {
        // For Android, regular window.open should work
        window.open(data.url);
      }
      
      // Return early since we're handling the redirect manually
      return data;
    }

    // For web, let the default redirect happen
    console.log("Google OAuth initiated successfully");
    return data;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
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

export const getSession = async () => {
  return await supabase.auth.getSession();
};
