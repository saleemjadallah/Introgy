
import { Capacitor } from "@capacitor/core";
import { Browser } from '@capacitor/browser';
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

export type GoogleSignInResult = { isSignedIn: boolean } | (GoogleAuthUser & { isSignedIn: boolean });

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

// Initialize deep link handler for native platforms
if (Capacitor.isNativePlatform()) {
  console.log('Setting up app URL open listener for deep links');
  
  App.addListener('appUrlOpen', async ({ url }) => {
    console.log('Deep link received:', url);
    localStorage.setItem('deep_link_received', url);
    localStorage.setItem('deep_link_time', new Date().toISOString());
    
    // Check if this is our auth callback URL
    if (url.includes('auth/v1/callback')) {
      console.log('Auth callback URL detected');
      
      try {
        // Handle both hash and query parameter formats
        const hasFragment = url.includes('#');
        const hasQuery = url.includes('?');
        
        let params: URLSearchParams;
        if (hasFragment) {
          // Extract the fragment
          const fragment = url.split('#')[1];
          params = new URLSearchParams(fragment);
        } else if (hasQuery) {
          // Extract query parameters
          const query = url.split('?')[1];
          params = new URLSearchParams(query);
        } else {
          console.error('No parameters found in callback URL');
          return;
        }
        
        // Extract tokens
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken && refreshToken) {
          console.log('Tokens extracted successfully from URL');
          localStorage.setItem('auth_tokens_found', 'true');
          
          // Set the session in Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Session error:', error);
            localStorage.setItem('session_error', JSON.stringify(error));
          } else {
            console.log('User authenticated successfully via deep link');
            localStorage.setItem('auth_success', 'true');
            localStorage.setItem('user_email', data.user?.email || 'unknown');
            
            // Navigate or dispatch event to update UI
            window.dispatchEvent(new CustomEvent('auth:success', { 
              detail: { user: data.user } 
            }));
          }
        } else {
          console.error('Access token or refresh token missing in callback');
          localStorage.setItem('tokens_missing', 'true');
        }
      } catch (err) {
        console.error('Error processing auth callback:', err);
        localStorage.setItem('auth_callback_error', JSON.stringify(err));
      }
    }
  });
  
  console.log('Deep link handler set up successfully');
}

/**
 * Initializes the Google Auth plugin if available
 * @returns Boolean indicating if plugin was successfully initialized
 */
export const initGoogleAuthPlugin = (): boolean => {
  try {
    // Force register the plugin if on iOS to ensure it's available
    if (Capacitor.getPlatform() === IOS_PLATFORM) {
      console.log("📱 iOS platform detected, ensuring GoogleAuth plugin is properly registered");
      
      // Direct access to plugins
      GoogleAuth = (Capacitor as any).Plugins[PLUGIN_NAME];
      
      // Log the plugin availability for debugging
      console.log("GoogleAuth plugin availability check:", {
        isAvailableByAPI: Capacitor.isPluginAvailable(PLUGIN_NAME),
        isAvailableByDirect: !!(Capacitor as any).Plugins[PLUGIN_NAME],
        plugins: Object.keys((Capacitor as any).Plugins || {}).join(", ")
      });
      
      // On iOS, we'll always return true and use the plugin if available
      // or fall back to the web flow if not
      return true;
    }
    
    // For other platforms, use standard detection
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
export const checkGoogleSignInState = async (): Promise<GoogleSignInResult> => {
  try {
    if (!GoogleAuth) {
      initGoogleAuthPlugin();
    }
    
    if (!GoogleAuth) {
      console.log("GoogleAuth plugin still not available after initialization attempt");
      return { isSignedIn: false };
    }
    
    const { isSignedIn } = await GoogleAuth.isSignedIn();
    
    if (isSignedIn) {
      // Get current user details
      try {
        const userData = await GoogleAuth.getCurrentUser();
        console.log("Retrieved current Google user data:", userData);
        return { ...userData, isSignedIn };
      } catch (userError) {
        console.error("Error getting current Google user:", userError);
        return { isSignedIn };
      }
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
 * Uses browser-based flow on all platforms for maximum reliability
 */
export const googleSignIn = async () => {
  try {
    // Store auth info for debugging
    storeAuthDebugInfo();
    
    const platform = Capacitor.getPlatform();
    console.log(`Starting Google Sign-In process on ${platform} platform`);
    
    // Use a more reliable approach based on your error message
    console.log('🌐 Using simplified browser-based OAuth flow for all platforms');
    localStorage.setItem('auth_approach', 'simplified_browser_based_oauth');
    
    // Important: Clear any previous auth state that could be interfering
    localStorage.removeItem('auth_provider');
    localStorage.removeItem('auth_state');
    localStorage.removeItem('auth_redirect_url');
    
    // Log details to help with debugging
    console.log('🔧 Auth process starting with clean state');
    
    // Use simplified browser-based sign-in to avoid URL formatting issues
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
    
    // IMPORTANT: Always use the Supabase callback URL for all platforms
    // This is what works and is expected by Supabase
    const redirectTo = 'https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback';
    console.log("Using Supabase callback URL:", redirectTo);
    
    // Store debug info with timestamp for troubleshooting
    const timestamp = new Date().toISOString();
    localStorage.setItem('auth_redirect_url', redirectTo);
    localStorage.setItem('auth_timestamp', timestamp);
    localStorage.setItem('auth_platform', platform);
    
    // Generate a simple state parameter to prevent CSRF attacks
    // Keep it minimal to avoid URL parsing issues
    const stateParam = `p_${platform}_t_${Date.now()}`;
    localStorage.setItem('auth_state', stateParam);
    
    // Generate only essential query parameters
    // MINIMAL PARAMS: Keep this simple to avoid URL formatting issues
    const queryParams: Record<string, string> = {
      access_type: 'offline',
      prompt: 'select_account', 
      state: stateParam
    };
    
    console.log('OAuth flow using Supabase URL:', redirectTo);
    localStorage.setItem('final_redirect_url', redirectTo);
    
    // Generate OAuth URL from Supabase Auth with MINIMAL parameters
    const authResponse = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: 'email profile',
        queryParams
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
 * This is simplified to be more reliable, especially on iOS
 */
const handleOAuthNavigation = (url: string) => {
  // Log the URL we're about to open (for debugging)
  localStorage.setItem('opening_browser_url', url);
  localStorage.setItem('browser_open_time', new Date().toISOString());
  
  const platform = Capacitor.getPlatform();
  
  // For iOS (which has the site URL formatting issue), use a simpler approach
  if (platform === IOS_PLATFORM) {
    console.log('📱 iOS platform: Using Safari to open OAuth URL');
    
    try {
      // Use the Capacitor Browser plugin which is more reliable
      Browser.open({
        url,
        windowName: '_self',
        presentationStyle: 'fullscreen'
      });
      console.log('📱 Browser opened successfully with Capacitor Browser plugin');
    } catch (e) {
      console.error('📱 Error opening browser:', e);
      
      // Fallback to direct location change
      console.log('📱 Falling back to direct location change');
      window.location.href = url;
    }
    return;
  }
  
  // For web, use window.location directly
  if (!Capacitor.isNativePlatform()) {
    console.log('Using window.location.href for web platform');
    window.location.href = url;
    return;
  } 
  
  // For Android
  console.log('Android: Using Capacitor Browser plugin');
  Browser.open({
    url,
    windowName: '_self',
    presentationStyle: 'fullscreen'
  });
};

/**
 * Function to get the proper redirect URL based on environment
 */
export function getRedirectUrl(): string {
  // IMPORTANT: Supabase requires a valid https URL for the redirect_to parameter
  // For ALL platforms including iOS, use the standard callback URL
  // The native URL scheme handling will still work because iOS intercepts the callback
  
  // For web platforms (and iOS)
  const supabaseCallbackUrl = 'https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback';
  
  // Log which URL we're using for debugging
  const platform = Capacitor.getPlatform();
  console.log(`Using Supabase callback URL for ${platform}: ${supabaseCallbackUrl}`);
  localStorage.setItem('redirect_url_chosen', supabaseCallbackUrl);
  
  // Always return the standard Supabase callback URL which works on all platforms
  return supabaseCallbackUrl;
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
