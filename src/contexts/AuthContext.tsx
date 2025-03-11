
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthChangeEvent, User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: { email?: string; phone?: string; password?: string; }) => Promise<void>;
  signUp: (credentials: { email?: string; phone?: string; password?: string; displayName?: string; }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial session and user
    const setInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        // Handle auth events
        if (event === 'SIGNED_IN' && currentSession) {
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out');
        } else if (event === 'USER_UPDATED') {
          toast.success('Profile updated');
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, phone, password }: { email?: string; phone?: string; password?: string; }) => {
    try {
      setIsLoading(true);
      
      let response;
      if (email) {
        response = await supabase.auth.signInWithPassword({ email, password: password || "" });
      } else if (phone && password) {
        response = await supabase.auth.signInWithPassword({ phone, password });
      }

      if (response?.error) {
        throw response.error;
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
        response = await supabase.auth.signUp({
          email,
          password: password || "",
          options: {
            data: {
              display_name: displayName
            }
          }
        });
      } else if (phone && password) {
        response = await supabase.auth.signUp({
          phone,
          password,
          options: {
            data: {
              display_name: displayName
            }
          }
        });
      }

      if (response?.error) {
        throw response.error;
      }

      toast.success('Account created! Please verify your account.');
      
      // Set session for cases where confirmations are disabled
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      console.error('Google sign in error:', error);
    }
  };

  const signInWithOTP = async (phone: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        throw error;
      }
      
      toast.success('Verification code sent to your phone');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
      console.error('OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });

      if (error) {
        throw error;
      }
      
      toast.success('Phone verified successfully');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
