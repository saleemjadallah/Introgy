import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';

// Define the interface for the Google Sign-In Plugin
interface GoogleSignInPlugin {
  signIn(): Promise<GoogleSignInResult>;
  checkSignInState(): Promise<GoogleSignInState>;
  refresh(): Promise<{ idToken: string; accessToken: string }>;
  addListener(
    eventName: 'signInRestored',
    listenerFunc: (state: { user: GoogleSignInResult }) => void
  ): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

interface PluginListenerHandle {
  remove: () => Promise<void>;
}

// Define the result interface
interface GoogleSignInResult {
  idToken: string;
  accessToken: string;
  displayName?: string;
  email?: string;
  givenName?: string;
  familyName?: string;
  photoUrl?: string;
  photoUrlLarge?: string;
  // We don't actually use nonce in our implementation
}

// Define the sign-in state interface
interface GoogleSignInState {
  isSignedIn: boolean;
  idToken?: string;
  accessToken?: string;
  displayName?: string;
  email?: string;
  givenName?: string;
  familyName?: string;
  photoUrl?: string;
}

// Register the plugin with Capacitor - CRITICAL: Make sure this matches the native plugin name
const GoogleSignIn = registerPlugin<GoogleSignInPlugin>('GoogleSignIn', {
  web: {
    // We'll fallback to the web implementation if not on iOS
    signIn: async () => {
      console.log("Using web fallback for GoogleSignIn plugin");
      // For web, use the existing web-based OAuth flow
      // Use the callback path that matches what's configured in the Supabase dashboard
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Don't specify a custom redirectTo - let Supabase handle it
          // redirectTo: window.location.origin + '/auth/callback',
          scopes: 'email profile',
          queryParams: {
            // Add access_type to ensure refresh tokens are provided
            access_type: 'offline',
            // Force prompt to ensure user can select account
            prompt: 'select_account'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // For web, we'll get a redirect so just return an empty result
      return {} as GoogleSignInResult;
    }
  }
});

/**
 * Uses the native Google Sign-In SDK on iOS, but falls back to web-based OAuth for other platforms
 */
export async function nativeGoogleSignIn() {
  try {
    const platform = Capacitor.getPlatform();
    console.log(`Platform detected: ${platform}, Running native: ${Capacitor.isNativePlatform()}`);
    
    // Check if Capacitor plugins are available
    if (!window.Capacitor || !window.Capacitor.Plugins) {
      console.error('Capacitor plugins not available');
      throw new Error('Capacitor environment not properly initialized');
    }
    
    // Check if the GoogleSignIn plugin is available
    const pluginNames = Object.keys(window.Capacitor.Plugins);
    console.log('Available Capacitor plugins:', pluginNames.join(', '));
    
    // Check specifically for the GoogleSignIn plugin
    if (!pluginNames.includes('GoogleSignIn')) {
      console.warn('GoogleSignIn plugin not found in registered plugins!');
    }
    
    // Mark that we're starting an auth process
    localStorage.setItem('auth_in_progress', 'true');
    localStorage.setItem('auth_started_at', Date.now().toString());
    
    // *** SIMPLIFIED APPROACH: Always use Supabase's OAuth flow ***
    // This is more reliable and handles token exchange on the server side
    console.log('Using Supabase OAuth flow for Google authentication');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Important: On iOS, don't skip the browser redirect
        skipBrowserRedirect: false,
        scopes: 'email profile',
        queryParams: {
          // Request offline access to get refresh tokens
          access_type: 'offline',
          // Force account selection dialog
          prompt: 'select_account'
        }
      }
    });
    
    if (error) {
      console.error('Error initiating OAuth flow:', error);
      throw error;
    }
    
    if (!data?.url) {
      console.error('No OAuth URL returned from Supabase');
      throw new Error('Failed to get authentication URL');
    }
    
    console.log('Opening OAuth URL:', data.url);
    
    // For native platforms, use Capacitor's App plugin to open URLs
    if (Capacitor.isNativePlatform()) {
      console.log("Using App.openUrl to open system browser");
      try {
        // This is the proper, recommended way to open URLs with Capacitor
        await App.openUrl({ url: data.url });
        console.log("Successfully opened URL with App.openUrl");
      } catch (err) {
        console.error("Error opening URL with App.openUrl:", err);
        
        // Fallback to window.open as a backup
        console.log("Falling back to window.open");
        window.open(data.url, '_system');
      }
    } else {
      // On web, let the redirect happen naturally
      console.log("Web platform detected, using location.href");
      window.location.href = data.url;
    }
    
    // Return data for handling by the caller
    return data;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    // Clean up auth progress flags on error
    localStorage.removeItem('auth_in_progress');
    localStorage.removeItem('auth_started_at');
    throw error;
  }
}

/**
 * Checks if the user is already signed in with Google
 * This uses the native GoogleSignIn plugin's checkSignInState method
 */
export async function checkGoogleSignInState(): Promise<GoogleSignInState> {
  try {
    // Only supported on iOS for now
    if (Capacitor.getPlatform() === 'ios') {
      console.log('Checking Google Sign-In state');
      const state = await GoogleSignIn.checkSignInState();
      console.log('Google Sign-In state:', state);
      return state;
    }
    
    // For other platforms, check with Supabase
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      const provider = data.session.user.app_metadata?.provider;
      if (provider === 'google') {
        console.log('Found active Google session in Supabase');
        return {
          isSignedIn: true,
          email: data.session.user.email || undefined,
          displayName: data.session.user.user_metadata?.full_name,
        };
      }
    }
    
    return { isSignedIn: false };
  } catch (error) {
    console.error('Error checking Google Sign-In state:', error);
    return { isSignedIn: false };
  }
}

/**
 * Sets up a listener for Google Sign-In state restoration
 * This is useful for automatically signing in users when the app starts
 */
export function setupGoogleSignInListener(callback: (user: GoogleSignInResult) => void): () => void {
  if (Capacitor.getPlatform() !== 'ios') {
    return () => {}; // No-op for non-iOS platforms
  }
  
  let listener: PluginListenerHandle | null = null;
  
  const setup = async () => {
    try {
      listener = await GoogleSignIn.addListener('signInRestored', (event) => {
        console.log('Google Sign-In restored event received:', event);
        if (event.user) {
          callback(event.user);
        }
      });
    } catch (error) {
      console.error('Error setting up Google Sign-In listener:', error);
    }
  };
  
  setup();
  
  // Return cleanup function
  return () => {
    if (listener) {
      listener.remove().catch(error => {
        console.error('Error removing Google Sign-In listener:', error);
      });
    }
  };
}

export default nativeGoogleSignIn;
