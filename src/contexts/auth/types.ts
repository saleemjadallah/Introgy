
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: { email?: string; phone?: string; password?: string; }) => Promise<void>;
  signUp: (credentials: { email?: string; phone?: string; password?: string; displayName?: string; }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
