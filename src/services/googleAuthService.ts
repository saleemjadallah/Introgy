
import { Capacitor } from "@capacitor/core";
import { App } from '@capacitor/app';
import { supabase, REDIRECT_URL, SITE_URL, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
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
    const isNative = Capacitor.isNativePlatform();
    console.log(`Setting up browser-based Google sign-in on platform: ${platform}, isNative: ${isNative}`);
    
    // Create a simple ID for this auth attempt for tracking
    const authAttemptId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('auth_timestamp', new Date().toISOString());
    localStorage.setItem('auth_attempt_platform', platform);
    localStorage.setItem('auth_attempt_is_native', String(isNative));
    localStorage.setItem('auth_attempt_id', authAttemptId);
    
    // Use platform-specific redirect URLs
    let redirectTo = REDIRECT_URL; // Default to Supabase URL
    
    if (isNative) {
      if (platform === 'ios') {
        redirectTo = 'com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2:/oauth2redirect';
      } else if (platform === 'android') {
        redirectTo = 'com.introgy.app:/oauth2redirect';
      }
    }
    
    // Log the URL for debugging
    console.log('Using redirect URL:', redirectTo);
    
    // Essential scope for Google Auth
    const scopes = 'email profile';
    
    // Query parameters required for proper Google OAuth flow
    const queryParams: Record<string, string> = {
      // Required for Google to send refresh tokens
      access_type: 'offline',
      // Ensures the consent screen is shown every time
      prompt: 'consent'
    };
    
    // Log the complete OAuth configuration for debugging
    console.log('Complete OAuth configuration:', {
      provider: 'google',
      redirectTo,
      scopes,
      queryParams,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('auth_oauth_config', JSON.stringify({
      redirectTo,
      scopes,
      queryParams,
      timestamp: new Date().toISOString()
    }));
    
    console.log('Calling Supabase OAuth with:', { 
      provider: 'google',
      redirectTo,
      scopes,
      queryParams
    });
    
    // CRITICAL FIX: When using signInWithOAuth, we need to make an important adjustment
    // to prevent the "site url is improperly formatted" error.
    // We must initialize a NEW Supabase client just for this sign-in attempt
    // with the site URL and redirectTo explicitly set to match what's in the Supabase dashboard
    
    // Log the current attempt configuration
    console.log('🔍 Current Auth Attempt Configuration:');
    console.log('  - SITE_URL:', SITE_URL);
    console.log('  - redirectTo:', redirectTo);
    
    // Import the createClient directly to avoid circular dependencies
    const { createClient } = await import('@supabase/supabase-js');
    
    // Log for debugging
    console.log('🔑 Creating temporary Supabase client with EXACT configuration');
    console.log('Using SUPABASE_URL:', SUPABASE_URL);
    
    // Create a temporary client with exact configuration that matches Supabase dashboard
    // We need to use 'as any' for the auth options to bypass TypeScript errors
    // This is necessary because the Supabase types don't expose all the options they actually support
    const tempClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
        // We can't set redirectTo here due to TypeScript errors
        // We'll set it in the signInWithOAuth call instead
      } as any
    });
    
    // Log the client creation
    console.log('Created temporary Supabase client with redirectTo:', redirectTo);
    
    // Generate OAuth URL from the temporary Supabase client
    const authResponse = await tempClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo, // Must match what's set in the client config
        scopes,
        queryParams
      }
    });
    
    if (authResponse.error) {
      console.error("Error starting Google OAuth flow:", authResponse.error);
      // Store error details for debugging
      localStorage.setItem('auth_error', JSON.stringify({
        message: authResponse.error.message,
        name: authResponse.error.name,
        timestamp: new Date().toISOString()
      }));
      throw authResponse.error;
    }
    
    if (!authResponse.data?.url) {
      console.error("No OAuth URL returned from Supabase");
      localStorage.setItem('auth_error', 'No OAuth URL returned');
      throw new Error("Failed to get authentication URL");
    }
    
    console.log(`Received OAuth URL from Supabase: ${authResponse.data.url}`);
    localStorage.setItem('oauth_url', authResponse.data.url);
    
    // Parse and log URL components for debugging
    try {
      const urlObj = new URL(authResponse.data.url);
      console.log(`URL protocol: ${urlObj.protocol}`);
      console.log(`URL host: ${urlObj.host}`);
      console.log(`URL pathname: ${urlObj.pathname}`);
      
      // Log specific parameters
      const searchParams = new URLSearchParams(urlObj.search);
      const redirectUriParam = searchParams.get('redirect_uri');
      console.log(`redirect_uri param: ${redirectUriParam}`);
      
      // Store these for debugging
      localStorage.setItem('auth_generated_url_host', urlObj.host);
      localStorage.setItem('auth_generated_url_path', urlObj.pathname);
      localStorage.setItem('auth_generated_redirect_uri', redirectUriParam || 'not found');
    } catch (e) {
      console.error('Error parsing OAuth URL:', e);
      localStorage.setItem('auth_url_parse_error', e.message);
    }
    
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
 * Function to get the proper redirect URL based on environment and platform
 */
export function getRedirectUrl(): string {
  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();
  
  console.log(`Determining redirect URL for platform: ${platform}, isNative: ${isNative}`);
  
  // Store diagnostic information
  localStorage.setItem('auth_redirect_timestamp', new Date().toISOString());
  
  // Platform-specific redirect URLs
  if (isNative) {
    if (platform === 'ios') {
      // iOS requires the reverse client ID from the GoogleService-Info.plist
      // This MUST match EXACTLY what's in Google OAuth console
      const iosRedirectUrl = 'com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2:/oauth2redirect';
      
      console.log(`Using iOS native redirect URL: ${iosRedirectUrl}`);
      localStorage.setItem('auth_redirect_platform', 'ios_native');
      localStorage.setItem('auth_redirect_url_used', iosRedirectUrl);
      return iosRedirectUrl;
    }
    
    if (platform === 'android') {
      // Android uses the package name in the URL scheme
      const androidRedirectUrl = 'com.introgy.app:/oauth2redirect';
      console.log(`Using Android redirect URL: ${androidRedirectUrl}`);
      localStorage.setItem('auth_redirect_platform', 'android_native');
      localStorage.setItem('auth_redirect_url_used', androidRedirectUrl);
      return androidRedirectUrl;
    }
  }
  
  // For web platforms, ALWAYS use the REDIRECT_URL imported from supabase/client.ts
  // This is critical for Supabase OAuth to work properly
  console.log(`Using Supabase callback URL for web: ${REDIRECT_URL}`);
  localStorage.setItem('auth_redirect_platform', 'web');
  localStorage.setItem('auth_redirect_url_used', REDIRECT_URL);
  localStorage.setItem('supabase_site_url', SITE_URL); // Store for debugging
  
  return REDIRECT_URL;
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
