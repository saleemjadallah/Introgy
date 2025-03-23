import { supabase } from "@/integrations/supabase/client";
import { Browser } from '@capacitor/browser';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';

// Register the GoogleAuth plugin
interface GoogleAuthPlugin {
  signIn(): Promise<any>;
  signInWithSupabase(): Promise<{ idToken: string; accessToken: string }>;
  signOut(): Promise<{ success: boolean }>;
  refresh(): Promise<{ idToken: string; accessToken: string }>;
  isSignedIn(): Promise<{ isSignedIn: boolean }>;
  getCurrentUser(): Promise<any>;
  disconnect(): Promise<{ success: boolean }>;
}

const GoogleAuth = registerPlugin<GoogleAuthPlugin>('GoogleAuth');

// Use appropriate Google Sign-In method based on platform
export const nativeGoogleSignIn = async () => {
  try {
    // Get current platform
    const platform = Capacitor.getPlatform();
    console.log(`Attempting Google sign-in on platform: ${platform}`);
    
    // CRITICAL: For iOS, always use the native implementation
    if (platform === 'ios') {
      console.log('🔍 iOS platform detected, using fully native implementation');
      console.log('This function should not be called directly on iOS - authService.googleSignIn() handles iOS natively');
      
      // Store debugging information
      localStorage.setItem('auth_platform', platform);
      localStorage.setItem('auth_timestamp', new Date().toISOString());
      localStorage.setItem('google_auth_native_attempt', 'true');
      
      // Return true to indicate we're handling this elsewhere (in authService.googleSignIn)
      return true;
    }
    
    // For non-iOS platforms, use browser-based OAuth flow
    console.log("Starting OAuth flow for Google sign-in on non-iOS platform");
    
    // Always use the Supabase callback URL for OAuth redirects
    const supabaseCallbackUrl = 'https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback';
    const redirectTo = supabaseCallbackUrl;
    
    // Store the platform and environment info for debugging
    localStorage.setItem('auth_platform', platform);
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
      return true; // Return early since the page will reload
    } 
    // For Android, use Capacitor Browser plugin
    else {
      console.log('Using Capacitor Browser plugin for Android platform');
      try {
        await Browser.open({
          url: data.url,
          windowName: '_blank',
          presentationStyle: 'fullscreen'
        });
        console.log('Browser.open call completed successfully');
      } catch (browserError) {
        console.error('Browser plugin error:', browserError);
        
        // Fallback to window.open if Browser plugin fails
        console.log('Trying window.open as fallback');
        window.open(data.url, '_blank');
      }
    }
    
    // Return true to indicate success in starting the flow
    // The actual auth result will be handled by a callback
    return true;
  } catch (error) {
    console.error("Google sign-in error:", error);
    localStorage.removeItem('auth_provider');
    throw error;
  }
};

// Function to handle native sign-in with ID token
// This would be called from the native side in iOS
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