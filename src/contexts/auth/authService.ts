import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// iOS-specific Google sign-in to avoid the 'site url is improperly formatted' error
async function iOSGoogleSignIn() {
  console.log("Using iOS-specific Google sign-in method");
  
  try {
    // Check if we have the native plugin for Google Sign-In
    const GoogleSignIn = window.Capacitor?.Plugins?.GoogleSignIn;
    
    if (GoogleSignIn) {
      console.log("Native GoogleSignIn plugin detected, using native flow");
      try {
        // Try to use the native plugin first - this uses the Google SDK directly
        const result = await GoogleSignIn.signIn();
        console.log("Native Google sign-in successful:", result);
        
        // Mark that we're in the middle of authentication
        localStorage.setItem('auth_in_progress', 'true');
        localStorage.setItem('auth_started_at', Date.now().toString());
        
        return result;
      } catch (nativeError) {
        console.error("Native Google sign-in failed, falling back to web flow:", nativeError);
        // Continue with web flow as fallback
      }
    } else {
      console.log("Native GoogleSignIn plugin not detected, using web OAuth flow");
    }
    
    // Use absolutely minimal options for iOS
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: true, // Critical for iOS
      }
    });
    
    if (error) {
      console.error("iOS Google OAuth error:", error);
      throw error;
    }
    
    if (!data?.url) {
      console.error("No OAuth URL returned from Supabase for iOS");
      throw new Error("Authentication failed: No OAuth URL returned");
    }
    
    // Mark that we're in the middle of authentication
    localStorage.setItem('auth_in_progress', 'true');
    localStorage.setItem('auth_started_at', Date.now().toString());
    
    // Open in system browser without any custom URL schemes
    console.log("Opening OAuth URL in iOS system browser:", data.url);
    window.open(data.url, '_system');
    
    return null; // Auth will complete via deep link callback
  } catch (error) {
    console.error("iOS Google sign-in error:", error);
    throw error;
  }
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

// Import the native Google Sign-In service
import { nativeGoogleSignIn } from '@/services/nativeGoogleAuth';

export const googleSignIn = async (redirectTo?: string) => {
  console.log("Starting Google sign in flow - SIMPLIFIED VERSION");
  
  // Check if we're running in a Capacitor app
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();
  console.log("Current platform:", platform, "isNative:", isNative);
  
  // Store auth start information for debugging
  localStorage.setItem('auth_start_time', new Date().toISOString());
  localStorage.setItem('auth_in_progress', 'true');
  localStorage.setItem('auth_started_at', Date.now().toString());
  localStorage.setItem('auth_platform', platform);
  
  try {
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
    
    // SUPER SIMPLIFIED APPROACH: Use minimal options and NO redirectTo
    console.log("Using simplified OAuth flow for all platforms");
    
    const oauthOptions = {
      provider: 'google' as const,
      options: {
        // On iOS we need to manage the redirect manually
        skipBrowserRedirect: isNative,
        // Keep basic scopes
        scopes: 'email profile',
        // CRITICAL: Do NOT specify a redirectTo at all - let Supabase handle it
        // This avoids the "requested path is invalid" error
        // redirectTo: undefined, <- DO NOT SET THIS
        queryParams: {
          // Request offline access to get refresh tokens
          access_type: 'offline',
          // Force account selection dialog
          prompt: 'select_account',
          // Add timestamp to prevent caching
          '_t': Date.now().toString()
        }
      }
    };
    
    console.log("OAuth options:", JSON.stringify(oauthOptions, null, 2));
    
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

    // For native platforms, open the URL in the system browser
    if (isNative) {
      console.log("Opening OAuth URL in system browser", data.url);
      
      // Mark that we're trying to open the browser - this will help with debugging
      localStorage.setItem('browser_open_attempt', 'true');
      localStorage.setItem('browser_open_time', new Date().toISOString());
      localStorage.setItem('browser_open_url', data.url);
      
      // Show toast so user knows what's happening
      toast.loading("Opening browser for authentication...");
      
      // Use Capacitor's App plugin to properly open the system browser
      try {
        console.log("Using Capacitor's App.openUrl to launch browser");
        await App.openUrl({ url: data.url });
        
        // Mark success
        localStorage.setItem('browser_open_method', 'capacitor_app_plugin');
        toast.success("Browser opened");
      } catch (browserError) {
        console.error("Error opening system browser with App plugin:", browserError);
        
        // Try using Safari's URL scheme directly for iOS
        if (platform === 'ios') {
          try {
            console.log("Attempting to open Safari directly using URL scheme");
            
            // Create a properly encoded safari:// URL
            const encodedUrl = encodeURIComponent(data.url);
            const safariUrl = `safari:${data.url}`;
            
            console.log("Opening Safari with URL:", safariUrl);
            
            // Try the direct Safari URL
            await App.openUrl({ url: safariUrl });
            
            // Mark success
            localStorage.setItem('browser_open_method', 'safari_url_scheme');
            toast.success("Safari opened");
          } catch (safariError) {
            console.error("Failed to open Safari:", safariError);
          }
        }
        
        // Fall back to window.open as a second attempt
        try {
          console.log("Trying window.open as fallback");
          
          // Use a timeout to ensure the previous operation has completed
          setTimeout(() => {
            // Try to open in system browser
            window.open(data.url, '_system');
            
            // Mark which method we used
            localStorage.setItem('browser_open_method', 'window_open_system');
          }, 500);
        } catch (fallbackError) {
          console.error("All browser opening methods failed:", fallbackError);
          
          // As a last resort, try to use location.href
          console.log("Using location.href as last resort (may navigate away from app)");
          
          // Show a warning to the user
          toast.error("Unable to open browser automatically. Please open manually.");
          
          // Set the location after a delay
          setTimeout(() => {
            window.location.href = data.url;
            localStorage.setItem('browser_open_method', 'location_href');
          }, 2000);
        }
      }
    }

    // Return data for handling by the caller
    return data;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    // Clean up auth flags on error
    localStorage.removeItem('auth_in_progress');
    localStorage.removeItem('auth_started_at');
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
