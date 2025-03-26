
import { supabase } from "@/integrations/supabase/client";
import { Capacitor, registerPlugin } from '@capacitor/core';
import { 
  googleSignIn as initiateGoogleSignIn, 
  signInWithGoogleIdToken, 
  listenForDeepLinks as setupDeepLinkListener,
  GoogleAuthPlugin
} from "./googleAuthService";

// IMPORTANT: Only register the plugin once to avoid conflicts
// This was causing issues with the native Google Sign-In
const PLUGIN_NAME = 'GoogleAuth';

// Always force register the plugin to ensure it's available
export const GoogleAuth: GoogleAuthPlugin = registerPlugin<GoogleAuthPlugin>(PLUGIN_NAME);

// Store plugin availability in localStorage for debugging
localStorage.setItem('googleauth_plugin_registered', 'true');
localStorage.setItem('googleauth_plugin_registration_time', new Date().toISOString());

// Debug the plugin registration
console.log(`📱 GoogleAuth plugin registration status:`, {
  isAvailable: !!GoogleAuth,
  methods: GoogleAuth ? Object.keys(GoogleAuth) : 'none',
  platform: Capacitor.getPlatform()
});

// Store detailed debug info
localStorage.setItem('googleauth_plugin_available', String(!!GoogleAuth));
localStorage.setItem('googleauth_plugin_methods', GoogleAuth ? JSON.stringify(Object.keys(GoogleAuth)) : 'none');
localStorage.setItem('googleauth_plugin_platform', Capacitor.getPlatform());

// Force initialization of plugin by calling a simple method if available
if (GoogleAuth && typeof GoogleAuth.isSignedIn === 'function') {
  // This will help verify the plugin is working
  GoogleAuth.isSignedIn().then(result => {
    console.log(`📱 GoogleAuth.isSignedIn() result:`, result);
    localStorage.setItem('googleauth_plugin_test_result', JSON.stringify(result));
  }).catch(error => {
    console.error(`📱 GoogleAuth.isSignedIn() error:`, error);
    localStorage.setItem('googleauth_plugin_test_error', JSON.stringify(error));
  });
}

// Use appropriate Google Sign-In method based on platform
export const nativeGoogleSignIn = async () => {
  return initiateGoogleSignIn();
};

// Re-export these functions for backward compatibility
export { 
  signInWithGoogleIdToken,
  listenForDeepLinks as setupDeepLinkListener
};

// For backward compatibility
export const listenForDeepLinks = setupDeepLinkListener;

// For backward compatibility
export const checkGoogleSignInState = async () => {
  try {
    if (!GoogleAuth) {
      return { isSignedIn: false };
    }
    
    const { isSignedIn } = await GoogleAuth.isSignedIn();
    
    if (isSignedIn) {
      const user = await GoogleAuth.getCurrentUser();
      return { isSignedIn, ...user };
    }
    
    return { isSignedIn };
  } catch (error) {
    console.error("Error checking sign-in state:", error);
    return { isSignedIn: false };
  }
};

// For backward compatibility
export const setupGoogleSignInListener = (callback: (userData: any) => void) => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
    return () => {}; // No-op cleanup function
  }
  
  if (!GoogleAuth) {
    console.warn("GoogleAuth plugin not available for listener setup");
    return () => {};
  }
  
  // For iOS, we would set up a listener for sign-in restoration
  const eventName = "signInRestored";
  
  // Try to add listener
  try {
    const removeListener = (Capacitor as any).Plugins.GoogleAuth.addListener(eventName, (event: any) => {
      if (event.user) {
        callback(event.user);
      }
    });
    
    // Return cleanup function
    return () => {
      if (removeListener && typeof removeListener.remove === 'function') {
        removeListener.remove();
      }
    };
  } catch (error) {
    console.error("Error setting up Google Sign-In listener:", error);
    return () => {};
  }
};
