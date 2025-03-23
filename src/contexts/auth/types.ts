
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: { phone: string; password?: string }) => Promise<void>;
  signUp: (credentials: { phone: string; password?: string; displayName?: string }) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}
