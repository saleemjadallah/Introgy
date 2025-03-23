
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { listenForDeepLinks, initGoogleAuthPlugin } from '@/services/googleAuthService';

export default function useGoogleAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  // Initialize Google Auth plugin on component mount
  useEffect(() => {
    initGoogleAuthPlugin();
  }, []);

  // Handle Auth callback and deep links
  useEffect(() => {
    // Set up deep link listener for mobile platforms
    listenForDeepLinks();

    // Check for auth callback in URL (from OAuth redirect)
    const handleAuthCallback = async () => {
      // When user comes back from OAuth redirect, the url contains a #access_token or error
      if (window.location.hash || searchParams.has('error')) {
        try {
          const authError = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (authError) {
            console.error('Auth error:', authError, errorDescription);
            toast.error(errorDescription || 'Authentication failed');
            navigate('/auth', { replace: true });
            return;
          }
          
          // Hash contains token data - Supabase will handle this automatically
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            toast.error('Failed to complete authentication');
            navigate('/auth', { replace: true });
            return;
          }
          
          if (data.session) {
            console.log('Successfully authenticated with OAuth');
            toast.success('Successfully signed in');
            
            // Clear any OAuth-related localStorage items
            localStorage.removeItem('google_auth_initiated');
            localStorage.removeItem('google_auth_timestamp');
            localStorage.removeItem('auth_provider');
            
            // Redirect to profile or dashboard
            navigate('/profile', { replace: true });
          }
        } catch (error) {
          console.error('Error processing auth callback:', error);
          toast.error('An error occurred during sign-in');
          navigate('/auth', { replace: true });
        }
      }
    };
    
    if (!isLoading) {
      handleAuthCallback();
    }
  }, [searchParams, navigate, isLoading]);
  
  // Check for OAuth timeout - this cleans up if redirect failed
  useEffect(() => {
    // Check if we're in the middle of Google auth but it's been too long
    const isGoogleAuthInProgress = localStorage.getItem('google_auth_initiated') === 'true';
    const googleAuthTimestamp = localStorage.getItem('google_auth_timestamp');
    
    if (isGoogleAuthInProgress && googleAuthTimestamp) {
      const startTime = parseInt(googleAuthTimestamp, 10);
      const currentTime = Date.now();
      const diffMinutes = (currentTime - startTime) / (1000 * 60);
      
      // If it's been more than 5 minutes, assume the auth flow failed
      if (diffMinutes > 5) {
        console.log('Google auth flow timed out after 5 minutes');
        localStorage.removeItem('google_auth_initiated');
        localStorage.removeItem('google_auth_timestamp');
      }
    }
  }, []);

  return null;
}
