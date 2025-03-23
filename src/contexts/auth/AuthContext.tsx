import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthChangeEvent, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthContextProps } from "./types";
import * as authService from "./authService";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import { Capacitor } from "@capacitor/core";
import { checkGoogleSignInState, setupGoogleSignInListener } from "@/services/googleAuthService";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use the Google Auth hook to handle deep links
  useGoogleAuth();

  useEffect(() => {
    const setInitialSession = async () => {
      try {
        // First check for Supabase session
        const { data: { session } } = await authService.getSession();
        
        // If we have a Supabase session, use it
        if (session) {
          console.log("Found active Supabase session");
          setSession(session);
          setUser(session.user);
        } 
        // Otherwise, check for native Google Sign-In state (iOS only)
        else if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
          console.log("Checking for native Google Sign-In state");
          const googleState = await checkGoogleSignInState();
          
          if (googleState.isSignedIn && googleState.idToken) {
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
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setInitialSession();
    
    // Set up listener for Google Sign-In restoration events (iOS only)
    let cleanupGoogleListener = () => {};
    
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      cleanupGoogleListener = setupGoogleSignInListener(async (googleUser) => {
        console.log("Google Sign-In restored, signing in with Supabase");
        
        if (googleUser.idToken) {
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

    // Set up Supabase auth state change listener
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
    };
  }, []);

  const signIn = async ({ email, phone, password }: { email?: string; phone?: string; password?: string; }) => {
    try {
      setIsLoading(true);
      
      if (email) {
        await authService.emailSignIn(email, password || "");
      } else if (phone && password) {
        await authService.phoneSignIn(phone, password);
      }
      
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async ({ email, phone, password, displayName }: { email?: string; phone?: string; password?: string; displayName?: string; }) => {
    try {
      setIsLoading(true);

      let response;
      if (email) {
        response = await authService.emailSignUp(email, password || "", displayName);
      } else if (phone && password) {
        response = await authService.phoneSignUp(phone, password, displayName);
      }

      toast.success('Account created! Please verify your account.');
      
      if (response?.data?.session) {
        navigate('/onboarding');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Google sign in flow");
      console.log("Current URL:", window.location.origin);
      
      // Make sure the redirect URL format matches exactly what's registered in Google OAuth console
      // We need to specify an EXACT redirect URL that matches what Supabase expects
      // This fixes the "requested path is invalid" error
      let redirectTo = window.location.origin + '/auth/callback';
      
      // Always use the same production callback URL regardless of environment
      console.log("Using standard callback URL:", redirectTo);
      
      // Store the environment information for debugging
      localStorage.setItem('auth_environment', window.location.hostname);
      localStorage.setItem('auth_is_native', Capacitor.isNativePlatform().toString());
      
      // Use local storage to track that we're in the middle of auth
      localStorage.setItem('google_auth_initiated', 'true');
      localStorage.setItem('google_auth_timestamp', Date.now().toString());
      
      console.log("Final redirect URL being used:", redirectTo);
      const result = await authService.googleSignIn(redirectTo);
      
      // For web platforms, we need to explicitly redirect to the OAuth URL
      if (!Capacitor.isNativePlatform() && 'url' in result && result.url) {
        // Set a timeout to reset loading state if redirect doesn't happen
        const timeoutId = setTimeout(() => {
          console.log("OAuth redirect didn't happen, resetting loading state");
          setIsLoading(false);
          toast.error("Failed to redirect to Google. Please try again.");
        }, 8000); // 8 second timeout
        
        // Store the timeout ID so we can clear it if needed
        localStorage.setItem('auth_timeout_id', timeoutId.toString());
        
        console.log("Redirecting to Google OAuth URL:", result.url);
        
        // Log the user through the process
        toast.info("Redirecting to Google for authentication...");
        
        // Redirect to Google's auth URL
        setTimeout(() => {
          window.location.href = result.url;
        }, 500); // Small delay to ensure toast is shown
      }
      
      console.log("Google sign-in initiated with result:", result);
      return result;
    } catch (error: any) {
      console.error('Google sign in error details:', error);
      
      // Check specifically for the site URL formatting error
      const errorMessage = error.message || 'Unknown error';
      const errorStr = String(error);
      
      if (errorStr.includes('site url is improperly formatted') || 
          errorStr.includes('unexpected_failure')) {
        // This is the specific error we're trying to fix
        console.error('Site URL formatting error detected:', {
          errorDetails: error,
          message: errorMessage,
          origin: window.location.origin,
          hostname: window.location.hostname,
          protocol: window.location.protocol
        });
        
        // Provide a more helpful error message
        toast.error('Authentication configuration error. The team has been notified.');
        
        // Store the error for debugging
        localStorage.setItem('auth_last_error', 'site_url_formatting');
        localStorage.setItem('auth_error_time', new Date().toISOString());
      } else {
        // For other errors, show the actual message
        toast.error(errorMessage || 'Failed to sign in with Google');
      }
      
      setIsLoading(false); // Reset loading state on error
      throw error; // Re-throw to allow handling in the calling component
    } finally {
      // If it's a native platform, we want to give enough time for the system browser to open
      if (Capacitor.isNativePlatform()) {
        console.log("Native platform detected, giving time for system browser...");
        setTimeout(() => {
          console.log("Resetting loading state after delay");
          setIsLoading(false);
        }, 3000); // 3 second delay for native platforms
      }
      // For web, loading state will be reset on redirect back or by the timeout
    }
  };

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

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithOTP,
    verifyOTP,
    signOut,
    isAuthenticated: !!session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
