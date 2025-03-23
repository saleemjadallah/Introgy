
import { Capacitor } from "@capacitor/core";
import { App } from '@capacitor/app';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constants
const IOS_PLATFORM = 'ios';
const PLUGIN_NAME = 'GoogleAuth';

// Types
export interface GoogleAuthUser {
  idToken: string;
  accessToken: string;
  email?: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
  photoUrl?: string;
  photoUrlLarge?: string;
  userId?: string;
}

export interface GoogleAuthPlugin {
  signIn(): Promise<GoogleAuthUser>;
  signInWithSupabase(): Promise<GoogleAuthUser>;
  signOut(): Promise<{ success: boolean }>;
  refresh(): Promise<Pick<GoogleAuthUser, 'idToken' | 'accessToken'>>;
  isSignedIn(): Promise<{ isSignedIn: boolean }>;
  getCurrentUser(): Promise<GoogleAuthUser & { isSignedIn: boolean }>;
  disconnect(): Promise<{ success: boolean }>;
}

// Plugin instance
export let GoogleAuth: GoogleAuthPlugin | null = null;

/**
 * Initializes the Google Auth plugin if available
 * @returns Boolean indicating if plugin was successfully initialized
 */
export const initGoogleAuthPlugin = (): boolean => {
  try {
    if (Capacitor.isPluginAvailable(PLUGIN_NAME)) {
      GoogleAuth = (Capacitor as any).Plugins[PLUGIN_NAME];
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

/**
 * Checks the current Google Sign-In state
 * @returns Object containing sign-in state and user info if signed in
 */
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

/**
 * Sets up a listener for Google Sign-In restoration events (iOS only)
 * @param callback Function to call when sign-in is restored
 * @returns Function to remove the listener
 */
export const setupGoogleSignInListener = (callback: (userData: GoogleAuthUser) => void) => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== IOS_PLATFORM || !GoogleAuth) {
    return () => {}; // No-op cleanup function
  }
  
  // For iOS, set up a listener for sign-in restoration
  const eventName = "signInRestored";
  const handler = (event: { user: GoogleAuthUser }) => {
    if (event.user) {
      callback(event.user);
    }
  };
  
  // Add listener
  const removeListener = (Capacitor as any).Plugins[PLUGIN_NAME].addListener(eventName, handler);
  
  // Return cleanup function
  return () => {
    removeListener.remove();
  };
};

/**
 * Main function to sign in with Google
 * Uses native flow on iOS, browser-based flow elsewhere
 */
export const googleSignIn = async () => {
  try {
    // Store auth info for debugging
    storeAuthDebugInfo();
    
    const platform = Capacitor.getPlatform();
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

/**
 * Store debug information for Google Auth
 */
const storeAuthDebugInfo = () => {
  localStorage.setItem('auth_start_time', new Date().toISOString());
  localStorage.setItem('auth_started_at', Date.now().toString());
  localStorage.setItem('google_auth_initiated', 'true');
  localStorage.setItem('google_auth_timestamp', Date.now().toString());
  localStorage.setItem('auth_platform', Capacitor.getPlatform());
};

/**
 * Browser-based Google sign-in flow
 */
const browserBasedGoogleSignIn = async () => {
  try {
    // Get current platform
    const platform = Capacitor.getPlatform();
    console.log(`Setting up browser-based Google sign-in on platform: ${platform}`);
    
    // Determine proper redirect URL
    const redirectTo = getRedirectUrl();
    console.log("Using redirect URL:", redirectTo);
    
    // Store debug info
    localStorage.setItem('auth_redirect_url', redirectTo);
    localStorage.setItem('auth_timestamp', new Date().toISOString());
    
    // Generate OAuth URL from Supabase Auth
    const authResponse = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: 'email profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
          include_granted_scopes: 'true',
          state: `platform=${platform}`,
        }
      }
    });
    
    if (authResponse.error) {
      console.error("Error starting Google OAuth flow:", authResponse.error);
      throw authResponse.error;
    }
    
    if (!authResponse.data?.url) {
      console.error("No OAuth URL returned from Supabase");
      throw new Error("Failed to get authentication URL");
    }
    
    console.log(`Received OAuth URL from Supabase: ${authResponse.data.url}`);
    localStorage.setItem('oauth_url', authResponse.data.url);
    
    // Store auth provider info
    localStorage.setItem('auth_provider', 'google');
    localStorage.setItem('google_auth_platform', platform);
    
    // Handle navigation to the OAuth URL
    handleOAuthNavigation(authResponse.data.url);
    
    return { url: authResponse.data.url };
  } catch (error) {
    console.error("Google sign-in error:", error);
    localStorage.removeItem('auth_provider');
    throw error;
  }
};

/**
 * Handle navigation to the OAuth URL based on platform
 */
const handleOAuthNavigation = (url: string) => {
  // For web, use window.location directly
  if (!Capacitor.isNativePlatform()) {
    console.log('Using window.location.href for web platform');
    
    // Add small delay to ensure localStorage is written
    setTimeout(() => {
      window.location.href = url;
    }, 50);
    return;
  } 
  
  // For mobile platforms, try system browser
  console.log('Using system browser for mobile platform');
  try {
    window.open(url, '_blank');
    console.log('Window.open call completed successfully');
  } catch (browserError) {
    console.error('Browser opening error:', browserError);
    
    // Ultimate fallback to window.location
    console.log('Falling back to window.location');
    window.location.href = url;
  }
};

/**
 * Function to get the proper redirect URL based on environment
 */
export function getRedirectUrl(): string {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  console.log(`Determining redirect URL for hostname: ${hostname}`);
  
  // Use the full URL including protocol, not just the domain
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return `${protocol}//${hostname}${port}/auth`;
  }
  
  if (hostname.includes('lovableproject.com')) {
    return `${protocol}//${hostname}/auth`;
  }
  
  if (hostname.includes('introgy')) {
    return `${protocol}//${hostname}/auth`;
  }
  
  // Fallback to current origin with auth path
  return `${protocol}//${hostname}${port}/auth`;
}

/**
 * Function to handle native sign-in with ID token
 */
export const signInWithGoogleIdToken = async (idToken: string, accessToken?: string) => {
  try {
    console.log("Signing in with Google ID token");
    
    const signInResponse = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
      access_token: accessToken
    });
    
    if (signInResponse.error) {
      console.error("Error signing in with ID token:", signInResponse.error);
      throw signInResponse.error;
    }
    
    console.log("Successfully signed in with Google ID token");
    return signInResponse.data;
  } catch (error) {
    console.error("ID token sign-in error:", error);
    throw error;
  }
};

/**
 * Helper to listen for app URLs (for deep linking)
 */
export const listenForDeepLinks = () => {
  console.log('Setting up deeplink listener');
  
  App.addListener('appUrlOpen', async ({ url }) => {
    console.log('App opened with URL:', url);
    
    // Handle the authentication callback
    if (url.includes('auth/callback')) {
      console.log('Processing auth callback from deep link');
      // The AuthCallback component will handle the rest
    }
  });
};

// Initialize the plugin on module load
initGoogleAuthPlugin();
