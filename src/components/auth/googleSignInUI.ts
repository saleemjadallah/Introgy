import { registerPlugin } from '@capacitor/core';

export interface GoogleSignInUIPlugin {
  /**
   * Show the native Google Sign-In UI
   * This will present a native iOS UI for Google Sign-In
   */
  showSignInUI(): Promise<void>;
  
  /**
   * Sign out the current Google user
   * This will clear the Google Sign-In state and notify listeners
   */
  signOut(): Promise<{ success: boolean }>;
  
  /**
   * Add a listener for Google Sign-In results
   * @param eventName The name of the event to listen for
   * @param listenerFunc The listener function to call when the event is triggered
   */
  addListener(
    eventName: 'googleSignInResult',
    listenerFunc: (result: GoogleSignInResult) => void
  ): Promise<{ remove: () => Promise<void> }>;
  
  /**
   * Remove all listeners for this plugin
   */
  removeAllListeners(): Promise<void>;
}

export interface GoogleSignInResult {
  userID: string;
  email: string;
  displayName: string;
  idToken: string;
  accessToken?: string;
  isSignedIn: boolean;
  givenName?: string;
  familyName?: string;
}

// Register the plugin with Capacitor
const GoogleSignInUI = registerPlugin<GoogleSignInUIPlugin>('GoogleSignInUI');

export default GoogleSignInUI;
