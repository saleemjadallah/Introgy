import { Capacitor, registerPlugin } from '@capacitor/core';

// Define the interface for the Google Sign-In plugin
export interface GoogleSignInPlugin {
  signIn(): Promise<GoogleUser>;
  checkSignInState(): Promise<GoogleSignInState>;
  refresh(): Promise<GoogleTokens>;
  addListener(
    eventName: 'signInRestored', 
    listenerFunc: (state: { user: GoogleUser }) => void
  ): Promise<string>;
  removeListener(listenerId: string): Promise<void>;
}

// Define the user object returned by Google Sign-In
export interface GoogleUser {
  idToken?: string;
  accessToken?: string;
  userID?: string;
  email?: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
  photoUrl?: string;
  isSignedIn: boolean;
  [key: string]: any; // Allow for additional properties
}

// Define the sign-in state object
export interface GoogleSignInState {
  isSignedIn: boolean;
  [key: string]: any; // Other possible state properties
}

// Define the tokens object
export interface GoogleTokens {
  idToken: string;
  accessToken: string;
}

// Register the plugin with Capacitor
const GoogleSignIn = registerPlugin<GoogleSignInPlugin>('GoogleSignIn');

// State variables for Google Sign-In state (to be managed by React components)
let _googleSignInState: GoogleSignInState = { isSignedIn: false };
let _googleUser: GoogleUser | null = null;

// Getter functions
export const getGoogleSignInState = (): GoogleSignInState => _googleSignInState;
export const getGoogleUser = (): GoogleUser | null => _googleUser;

// Initialize the Google Sign-In plugin
export async function initGoogleSignIn() {
  try {
    // Check if we're on a native platform
    if (Capacitor.isNativePlatform()) {
      console.log('Initializing Google Sign-In on native platform');
      
      // Add listener for sign-in restored events
      GoogleSignIn.addListener('signInRestored', (result) => {
        console.log('Google Sign-In restored event received:', result);
        
        if (result.user) {
          // Update our state
          _googleUser = result.user;
          _googleSignInState = { 
            isSignedIn: result.user.isSignedIn || false,
            ...result.user
          };
          
          // If user is signed in, emit an event for the rest of the app
          if (result.user.isSignedIn) {
            const event = new CustomEvent('google-signin-restored', { 
              detail: result.user 
            });
            window.dispatchEvent(event);
          }
        }
      });
      
      // Initial check of sign-in state
      const state = await GoogleSignIn.checkSignInState();
      _googleSignInState = state;
      
      if (state.isSignedIn) {
        _googleUser = state as GoogleUser;
      }
      
      return state;
    } else {
      console.log('Google Sign-In not initialized: not on native platform');
      return { isSignedIn: false };
    }
  } catch (error) {
    console.error('Error initializing Google Sign-In:', error);
    return { isSignedIn: false };
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<GoogleUser> {
  try {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Google Sign-In is only available on native platforms');
    }
    
    console.log('Starting Google Sign-In process');
    
    // Store debugging info
    localStorage.setItem('google_auth_initiated', 'true');
    localStorage.setItem('google_auth_timestamp', Date.now().toString());
    localStorage.setItem('auth_platform', Capacitor.getPlatform());
    localStorage.setItem('auth_is_native', 'true');
    localStorage.setItem('auth_start_time', new Date().toISOString());
    
    // For iOS, we want to use the native GoogleAuth plugin which is registered separately
    // This is handled in the authService.ts file
    if (Capacitor.getPlatform() === 'ios') {
      console.log('iOS platform detected, deferring to authService');
      // Return a placeholder to satisfy the type system
      // The actual sign-in will be handled by authService.googleSignIn()
      return {
        isSignedIn: true,
        // Add placeholder values that will be replaced by the actual implementation
        idToken: 'handled_by_native_plugin',
      };
    }
    
    // For Android and other platforms, call the plugin directly
    console.log('Calling GoogleSignIn.signIn() directly');
    const result = await GoogleSignIn.signIn();
    console.log('Google Sign-In result:', result);
    
    // Update our state
    _googleUser = result;
    _googleSignInState = { 
      isSignedIn: true,
      ...result
    };
    
    return result;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    localStorage.setItem('google_auth_error', JSON.stringify(error));
    throw error;
  }
}

// Refresh Google tokens
export async function refreshGoogleTokens(): Promise<GoogleTokens> {
  try {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Google Sign-In is only available on native platforms');
    }
    
    if (!_googleSignInState.isSignedIn) {
      throw new Error('User is not signed in with Google');
    }
    
    console.log('Refreshing Google tokens');
    const result = await GoogleSignIn.refresh();
    
    // Update our state with new tokens
    if (_googleUser) {
      _googleUser.idToken = result.idToken;
      _googleUser.accessToken = result.accessToken;
    }
    
    return result;
  } catch (error) {
    console.error('Google token refresh error:', error);
    throw error;
  }
}

// Check current Google Sign-In state
export async function checkGoogleSignInState(): Promise<GoogleSignInState> {
  try {
    if (!Capacitor.isNativePlatform()) {
      return { isSignedIn: false };
    }
    
    const state = await GoogleSignIn.checkSignInState();
    _googleSignInState = state;
    
    if (state.isSignedIn) {
      _googleUser = state as GoogleUser;
    }
    
    return state;
  } catch (error) {
    console.error('Error checking Google Sign-In state:', error);
    return { isSignedIn: false };
  }
}

export default {
  initGoogleSignIn,
  signInWithGoogle,
  refreshGoogleTokens,
  checkGoogleSignInState,
  getGoogleSignInState,
  getGoogleUser
};
