import { Capacitor, registerPlugin } from '@capacitor/core';

// Define the interface for the native Google Sign-In UI plugin
export interface GoogleSignInUIPlugin {
  /**
   * Show the native Google Sign-In button
   * This displays the official Google-branded sign-in button
   */
  showSignInButton(): Promise<void>;
}

// Register the plugin with Capacitor - make sure to use the exact name registered in Objective-C
export const GoogleSignInUI = registerPlugin<GoogleSignInUIPlugin>('GoogleAuth');

/**
 * Shows the native Google Sign-In button on iOS devices
 * This uses the official GIDSignInButton from Google SDK
 */
export const showNativeGoogleSignInButton = async (): Promise<void> => {
  try {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      console.log('📱 Showing native Google Sign-In button');
      
      // Add timestamp for debugging
      localStorage.setItem('google_button_requested', Date.now().toString());
      
      // Attempt to show the button
      await GoogleSignInUI.showSignInButton();
      
      // Confirm button was shown
      localStorage.setItem('google_button_shown', 'true');
      
      // If button doesn't appear immediately, try again after a short delay
      setTimeout(async () => {
        console.log('📱 Ensuring Google Sign-In button is visible');
        try {
          await GoogleSignInUI.showSignInButton();
        } catch (retryError) {
          console.warn('⚠️ Button retry failed:', retryError);
        }
      }, 500);
    } else {
      console.log('⚠️ Native Google Sign-In button only supported on iOS');
    }
  } catch (error) {
    console.error('❌ Error showing native Google Sign-In button:', error);
    
    // Try once more after a longer delay if initial attempt failed
    setTimeout(async () => {
      try {
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
          console.log('📱 Retrying Google Sign-In button display');
          await GoogleSignInUI.showSignInButton();
        }
      } catch (retryError) {
        console.error('❌ Final attempt failed:', retryError);
      }
    }, 1000);
  }
};

/**
 * Check if the device supports showing native Google Sign-In UI
 */
export const supportsNativeGoogleSignInUI = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
};
