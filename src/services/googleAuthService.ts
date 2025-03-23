import { Capacitor, registerPlugin } from "@capacitor/core";
import { App } from '@capacitor/app';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constants
const IOS_PLATFORM = 'ios';

// Register the GoogleAuth plugin
export interface GoogleAuthPlugin {
  signIn(): Promise<any>;
  signInWithSupabase(): Promise<{ idToken: string; accessToken: string }>;
  signOut(): Promise<{ success: boolean }>;
  refresh(): Promise<{ idToken: string; accessToken: string }>;
  isSignedIn(): Promise<{ isSignedIn: boolean }>;
  getCurrentUser(): Promise<any>;
  disconnect(): Promise<{ success: boolean }>;
}

export let GoogleAuth: GoogleAuthPlugin | null = null;

// Initialize the plugin if available
export const initGoogleAuthPlugin = () => {
  try {
    if (Capacitor.isPluginAvailable('GoogleAuth')) {
      GoogleAuth = (Capacitor as any).Plugins.GoogleAuth;
      console.log("GoogleAuth plugin initialized");
      return true;
    } else {
      console.log("GoogleAuth plugin not available");
      return false;
    }
  } catch (error) {
    console.error("Error initializing GoogleAuth plugin:", error);
    return false;
  }
};

// Check Google Sign-In state (for iOS mainly)
export const checkGoogleSignInState = async () => {
  try {
    if (!GoogleAuth) {
      initGoogleAuthPlugin();
    }
    
    if (!GoogleAuth) {
      return { isSignedIn: false };
    }
    
    const { isSignedIn } = await GoogleAuth.isSignedIn();
    
    if (isSignedIn) {
      // Get current user details
      const userData = await GoogleAuth.getCurrentUser();
      return { isSignedIn, ...userData };
    }
    
    return { isSignedIn };
  } catch (error) {
    console.error("Error checking Google Sign-In state:", error);
    return { isSignedIn: false };
  }
};

// Set up listener for Google Sign-In restoration events (iOS only)
export const setupGoogleSignInListener = (callback: (userData: any) => void) => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== IOS_PLATFORM || !GoogleAuth) {
    return () => {}; // No-op cleanup function
  }
  
  // For iOS, we would set up a listener for sign-in restoration
  const eventName = "signInRestored";
  const handler = (event: any) => {
    if (event.user) {
      callback(event.user);
    }
  };
  
  // Add listener
  const removeListener = (Capacitor as any).Plugins.GoogleAuth.addListener(eventName, handler);
  
  // Return cleanup function
  return () => {
    removeListener.remove();
  };
};

// Sign in with Google
export const googleSignIn = async () => {
  try {
    // Store auth info for debugging
    localStorage.setItem('auth_start_time', new Date().toISOString());
    localStorage.setItem('auth_started_at', Date.now().toString());
    localStorage.setItem('google_auth_initiated', 'true');
    localStorage.setItem('google_auth_timestamp', Date.now().toString());
    
    const platform = Capacitor.getPlatform();
    localStorage.setItem('auth_platform', platform);
    console.log(`Starting Google Sign-In process on ${platform} platform`);
    
    // If on iOS, use native Google Sign-In
    if (platform === IOS_PLATFORM && GoogleAuth) {
      console.log('📱 iOS platform detected, using native GoogleAuth plugin');
      
      try {
        // Use the native plugin to get the tokens
        const { idToken, accessToken } = await GoogleAuth.signInWithSupabase();
        
        if (!idToken) {
          throw new Error('No ID token returned from Google Sign-In');
        }
        
        // Sign in with Supabase using the token
        const result = await signInWithGoogleIdToken(idToken, accessToken);
        
        console.log('Successfully signed in with Google on iOS');
        return result;
      } catch (error) {
        console.error('Error with native iOS Google sign-in:', error);
        toast.error('Sign-in failed');
        throw error;
      }
    }
    
    // For non-iOS platforms, use browser-based flow
    console.log('🌐 Using browser-based OAuth flow');
    return await browserBasedGoogleSignIn();
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    localStorage.setItem('google_auth_error', JSON.stringify(error));
    toast.error('Sign-in failed');
    throw error;
  }
};

// Browser-based Google sign-in flow
const browserBasedGoogleSignIn = async () => {
  try {
    // Get current platform
    const platform = Capacitor.getPlatform();
    console.log(`Setting up browser-based Google sign-in on platform: ${platform}`);
    
    // Always use the Supabase callback URL for OAuth redirects
    const supabaseCallbackUrl = 'https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback';
    const redirectTo = supabaseCallbackUrl;
    
    // Store the platform and environment info for debugging
    localStorage.setItem('auth_redirect_url', redirectTo);
    localStorage.setItem('supabase_callback_url', supabaseCallbackUrl);
    localStorage.setItem('auth_timestamp', new Date().toISOString());
    
    // Generate OAuth URL from Supabase Auth with enhanced options
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: 'email profile',
        queryParams: {
          access_type: 'offline', // Enable refresh tokens
          prompt: 'select_account', // Always show account selection
          include_granted_scopes: 'true', // Include previously granted scopes
          state: `platform=${platform}`, // Include platform in state for better tracking
        }
      }
    });
    
    if (error) {
      console.error("Error starting Google OAuth flow:", error);
      throw error;
    }
    
    if (!data.url) {
      console.error("No OAuth URL returned from Supabase");
      throw new Error("Failed to get authentication URL");
    }
    
    console.log(`Received OAuth URL from Supabase: ${data.url}`);
    localStorage.setItem('oauth_url', data.url);
    
    // Store the provider for later reference
    localStorage.setItem('auth_provider', 'google');
    localStorage.setItem('google_auth_platform', platform);
    localStorage.setItem('auth_attempt_time', new Date().toISOString());
    
    // For web, use window.location directly
    if (typeof window !== 'undefined' && !Capacitor.isNativePlatform()) {
      console.log('Using window.location.href for web platform');
      window.location.href = data.url;
      return { url: data.url }; // Return the URL for reference
    } 
    // For Android, use system browser fallback
    else {
      console.log('Using system browser for mobile platform');
      try {
        // Try using system browser via window.open
        window.open(data.url, '_blank');
        console.log('Window.open call completed successfully');
      } catch (browserError) {
        console.error('Browser opening error:', browserError);
        
        // Ultimate fallback to window.location
        console.log('Falling back to window.location');
        window.location.href = data.url;
      }
      
      return { url: data.url }; // Return the URL for reference
    }
    
  } catch (error) {
    console.error("Google sign-in error:", error);
    localStorage.removeItem('auth_provider');
    throw error;
  }
};

// Function to handle native sign-in with ID token
export const signInWithGoogleIdToken = async (idToken: string, accessToken?: string) => {
  try {
    console.log("Signing in with Google ID token");
    
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
      access_token: accessToken
    });
    
    if (error) {
      console.error("Error signing in with ID token:", error);
      throw error;
    }
    
    console.log("Successfully signed in with Google ID token");
    return data;
  } catch (error) {
    console.error("ID token sign-in error:", error);
    throw error;
  }
};

// Helper to listen for app URLs (for deep linking)
export const listenForDeepLinks = () => {
  App.addListener('appUrlOpen', async ({ url }) => {
    console.log('App opened with URL:', url);
    
    // Handle the authentication callback
    if (url.includes('auth/callback')) {
      console.log('Processing auth callback from deep link');
      // The AuthCallback component will handle the rest
    }
  });
};
