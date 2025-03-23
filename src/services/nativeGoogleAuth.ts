
import { supabase } from "@/integrations/supabase/client";
import { Capacitor, registerPlugin } from '@capacitor/core';
import { 
  googleSignIn as initiateGoogleSignIn, 
  signInWithGoogleIdToken, 
  listenForDeepLinks as setupDeepLinkListener,
  GoogleAuthPlugin
} from "./googleAuthService";

// For backward compatibility - export the GoogleAuth plugin that was registered
export const GoogleAuth: GoogleAuthPlugin = registerPlugin<GoogleAuthPlugin>('GoogleAuth');

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
