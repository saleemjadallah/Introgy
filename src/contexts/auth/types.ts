
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: { email?: string; phone?: string; password?: string }) => Promise<void>;
  signUp: (credentials: { email?: string; phone?: string; password?: string; displayName?: string }) => Promise<void>;
  signInWithGoogle: () => Promise<any>; // Returns different data depending on platform
  signInWithOTP: (phone: string) => Promise<boolean>; // Returns boolean for success/failure
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
