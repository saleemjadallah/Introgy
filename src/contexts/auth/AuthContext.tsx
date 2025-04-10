
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthChangeEvent, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthContextProps } from "./types";
import * as authService from "./authService";
import { Capacitor } from "@capacitor/core";
import { Browser } from '@capacitor/browser';
import { checkGoogleSignInState, setupGoogleSignInListener } from "@/services/googleAuthService";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthEvent = (event: CustomEvent) => {
      const { session, user } = event.detail;
      if (session) {
        setSession(session);
        setUser(user || session.user);
        setIsLoading(false);
      }
    };

    const handleAuthError = (event: CustomEvent) => {
      console.error('Auth error:', event.detail);
      setIsLoading(false);
      toast.error('Authentication error. Please try again.');
    };
    
    // Handle Google Sign-In completion event from native code
    const handleGoogleSignInComplete = async (event: Event) => {
      console.log('Received googleSignInComplete event from native code');
      
      // Check for token data in localStorage (fallback method)
      const tokenDataString = localStorage.getItem('native_google_auth_token_data');
      if (tokenDataString) {
        try {
          console.log('Found token data in localStorage, using it to sign in');
          const tokenData = JSON.parse(tokenDataString);
          await handleNativeTokenData(tokenData);
          // Clear the token data from localStorage after using it
          localStorage.removeItem('native_google_auth_token_data');
          return;
        } catch (error) {
          console.error('Error parsing token data from localStorage:', error);
        }
      }
      
      // Check for session after a short delay
      setTimeout(async () => {
        try {
          console.log('Checking for session after Google Sign-In completion');
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            console.log('Session found after Google Sign-In completion');
            setSession(data.session);
            setUser(data.session.user);
            setIsLoading(false);
            toast.success('Signed in successfully');
          } else {
            console.log('No session found after Google Sign-In completion');
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error checking session after Google Sign-In completion:', error);
          setIsLoading(false);
        }
      }, 1000);
    };
    
    // Handle token data received from native code
    const handleGoogleSignInTokenReceived = async (event: CustomEvent) => {
      console.log('Received googleSignInTokenReceived event with token data');
      try {
        const tokenData = event.detail;
        await handleNativeTokenData(tokenData);
      } catch (error) {
        console.error('Error handling token data from native code:', error);
        setIsLoading(false);
      }
    };
    
    // Common function to handle native token data
    const handleNativeTokenData = async (tokenData: any) => {
      if (tokenData && tokenData.idToken) {
        console.log('Using received token to sign in with Supabase');
        
        try {
          // Sign in to Supabase with the ID token
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: tokenData.idToken
          });
          
          if (error) {
            console.error('Error signing in with token:', error);
            toast.error('Authentication failed. Please try again.');
            setIsLoading(false);
          } else if (data.session) {
            console.log('Successfully signed in with token');
            setSession(data.session);
            setUser(data.session.user);
            setIsLoading(false);
            toast.success('Signed in successfully');
          }
        } catch (error) {
          console.error('Error signing in with Supabase:', error);
          setIsLoading(false);
        }
      } else {
        console.error('Invalid token data received:', tokenData);
        setIsLoading(false);
      }
    };
    
    // Handle browser closed event from native code
    const handleBrowserClosed = () => {
      console.log('Received browserClosed event from native code');
      // We'll check for a session in the googleSignInComplete handler
    };

    // Listen for auth events
    window.addEventListener('supabase.auth.signIn' as any, handleAuthEvent);
    window.addEventListener('supabase.auth.error' as any, handleAuthError);
    document.addEventListener('googleSignInComplete', handleGoogleSignInComplete as EventListener);
    document.addEventListener('browserClosed', handleBrowserClosed as EventListener);
    document.addEventListener('googleSignInTokenReceived', handleGoogleSignInTokenReceived as EventListener);

    const setInitialSession = async () => {
      try {
        // Set a timeout to ensure loading state doesn't get stuck indefinitely
        const timeoutId = setTimeout(() => {
          console.log("Auth check timeout - resetting loading state");
          setIsLoading(false);
        }, 5000);
        
        const { data: { session } } = await authService.getSession();
        
        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        if (session) {
          console.log("Found active Supabase session");
          setSession(session);
          setUser(session.user);
          setIsLoading(false);
        } else if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
          console.log("Checking for native Google Sign-In state");
          try {
            const googleState = await checkGoogleSignInState();
            
            if (googleState.isSignedIn && 'idToken' in googleState && googleState.idToken) {
              console.log("Found active Google Sign-In state, signing in with Supabase");
              try {
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: googleState.idToken
                });
                
                if (error) {
                  console.error("Error signing in with Google ID token:", error);
                } else if (data.session) {
                  console.log("Successfully signed in with restored Google session");
                  setSession(data.session);
                  setUser(data.session.user);
                  toast.success("Signed in automatically");
                }
              } catch (tokenError) {
                console.error("Error exchanging Google token with Supabase:", tokenError);
              }
            }
          } catch (googleError) {
            console.error("Error checking Google Sign-In state:", googleError);
          } finally {
            // Always reset loading state when native auth check completes
            setIsLoading(false);
          }
        } else {
          // No session and not on iOS, just reset loading
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setIsLoading(false);
      }
    };

    setInitialSession();
    
    let cleanupGoogleListener = () => {};
    
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      cleanupGoogleListener = setupGoogleSignInListener(async (googleUser) => {
        console.log("Google Sign-In restored, signing in with Supabase");
        
        if (googleUser && 'idToken' in googleUser && googleUser.idToken) {
          try {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: googleUser.idToken
            });
            
            if (error) {
              console.error("Error signing in with restored Google token:", error);
            } else if (data.session) {
              console.log("Successfully signed in with restored Google session");
              setSession(data.session);
              setUser(data.session.user);
              toast.success("Signed in automatically");
            }
          } catch (tokenError) {
            console.error("Error exchanging restored Google token:", tokenError);
          }
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN' && currentSession) {
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out');
        } else if (event === 'USER_UPDATED') {
          toast.success('Profile updated');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      cleanupGoogleListener();
      window.removeEventListener('supabase.auth.signIn' as any, handleAuthEvent);
      window.removeEventListener('supabase.auth.error' as any, handleAuthError);
      document.removeEventListener('googleSignInComplete', handleGoogleSignInComplete as EventListener);
      document.removeEventListener('browserClosed', handleBrowserClosed as EventListener);
    };
  }, []);

  const signInWithOTP = async (phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      return await authService.phoneOtpSignIn(phone);
    } catch (error: any) {
      console.error('OTP error details:', error);
      toast.error(error.message || 'Failed to send verification code');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      setIsLoading(true);
      await authService.verifyPhoneOtp(phone, token);
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code');
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Google sign in flow");
      console.log("Current URL:", window.location.origin);
      
      localStorage.setItem('auth_environment', window.location.hostname);
      localStorage.setItem('auth_is_native', String(Capacitor.isNativePlatform()));
      localStorage.setItem('auth_origin', window.location.origin);
      localStorage.setItem('auth_pathname', window.location.pathname);
      
      localStorage.setItem('google_auth_initiated', 'true');
      localStorage.setItem('google_auth_timestamp', Date.now().toString());
      
      // Set up a listener for when the in-app browser is closed
      if (Capacitor.isNativePlatform()) {
        Browser.addListener('browserFinished', async () => {
          console.log("In-app browser closed, checking auth state");
          try {
            // Check if we have a session after browser closed
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
              console.log("Session found after browser closed");
              setSession(data.session);
              setUser(data.session.user);
              setIsLoading(false);
              toast.success("Signed in successfully");
            } else {
              console.log("No session found after browser closed");
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error checking session after browser closed:", error);
            setIsLoading(false);
          }
        });
      }
      
      const result = await authService.googleSignIn();
      
      // For web platforms, handle the redirect
      if (!Capacitor.isNativePlatform() && result && 'url' in result && result.url) {
        const timeoutId = setTimeout(() => {
          console.log("OAuth redirect didn't happen, resetting loading state");
          setIsLoading(false);
          toast.error("Failed to redirect to Google. Please try again.");
        }, 8000);
        
        localStorage.setItem('auth_timeout_id', timeoutId.toString());
        
        console.log("Redirecting to Google OAuth URL:", result.url);
        
        toast.info("Redirecting to Google for authentication...");
        
        setTimeout(() => {
          window.location.href = result.url;
        }, 500);
      }
      
      // For native platforms using in-app browser, we don't need to do anything else
      // The browserFinished event will handle the session check
      if (Capacitor.isNativePlatform() && result && 'usingInAppBrowser' in result && result.usingInAppBrowser) {
        console.log("Using in-app browser for authentication, waiting for completion");
        // Keep loading state active until browserFinished event
      }
      
      console.log("Google sign-in initiated with result:", result);
      return result;
    } catch (error: any) {
      console.error('Google sign in error details:', error);
      
      const errorMessage = error.message || 'Unknown error';
      const errorStr = String(error);
      
      if (errorStr.includes('site url is improperly formatted') || 
          errorStr.includes('unexpected_failure')) {
        console.error('Site URL formatting error detected:', {
          errorDetails: error,
          message: errorMessage,
          origin: window.location.origin,
          hostname: window.location.hostname,
          protocol: window.location.protocol
        });
        
        toast.error('Authentication configuration error. The team has been notified.');
        
        localStorage.setItem('auth_last_error', 'site_url_formatting');
        localStorage.setItem('auth_error_time', new Date().toISOString());
      } else {
        toast.error(errorMessage || 'Failed to sign in with Google');
      }
      
      setIsLoading(false);
      throw error;
    } finally {
      if (Capacitor.isNativePlatform()) {
        console.log("Native platform detected, giving time for system browser...");
        setTimeout(() => {
          console.log("Resetting loading state after delay");
          setIsLoading(false);
        }, 5000);
      }
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signInWithGoogle,
    signInWithOTP,
    verifyOTP,
    signOut,
    isAuthenticated: !!session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
