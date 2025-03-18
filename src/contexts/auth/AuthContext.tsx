
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthChangeEvent, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthContextProps } from "./types";
import * as authService from "./authService";

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
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setInitialSession();

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
      console.log("Starting Google sign in flow");
      
      // For web, use the normal redirect URL
      // For mobile apps, the authService will use the custom URL scheme
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      // Show loading toast for mobile
      if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
        toast.info('Opening Google sign-in. Please complete the process in your browser.');
      }
      
      await authService.googleSignIn(redirectTo);
    } catch (error: any) {
      console.error('Google sign in error details:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  // Admin phone number that bypasses OTP verification
  const ADMIN_PHONE = '+971507493651';

  const signInWithOTP = async (phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Normalize the phone number for comparison
      const normalizedPhone = phone.replace(/\s+/g, '');
      const isAdminPhone = normalizedPhone === ADMIN_PHONE;
      
      // Special handling for admin phone
      if (isAdminPhone) {
        console.log("AuthContext: Admin phone detected, special handling");
        
        // For admin, we'll try to bypass the OTP flow completely
        const result = await authService.phoneOtpSignIn(normalizedPhone);
        
        // If successful and we have a session already, redirect to profile
        const { data: { session } } = await authService.getSession();
        if (result && session) {
          console.log("Admin already has active session, redirecting");
          navigate('/profile');
        }
        
        return result;
      }
      
      // Normal flow for other phone numbers
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
      
      // Normalize the phone number for comparison
      const normalizedPhone = phone.replace(/\s+/g, '');
      const isAdminPhone = normalizedPhone === ADMIN_PHONE;
      
      if (isAdminPhone) {
        console.log("AuthContext: Admin phone verification");
      }
      
      await authService.verifyPhoneOtp(phone, token);
      
      // Check if we now have a session
      const { data: { session } } = await authService.getSession();
      if (session) {
        navigate('/profile');
      }
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
