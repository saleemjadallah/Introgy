
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthChangeEvent, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthContextProps } from "./types";
import * as authService from "./authService";
import { Capacitor } from "@capacitor/core";
import { checkGoogleSignInState, setupGoogleSignInListener } from "@/services/googleAuthService";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setInitialSession = async () => {
      try {
        const { data: { session } } = await authService.getSession();
        
        if (session) {
          console.log("Found active Supabase session");
          setSession(session);
          setUser(session.user);
        } else if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
          console.log("Checking for native Google Sign-In state");
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
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
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
      
      const result = await authService.googleSignIn();
      
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
        }, 3000);
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
