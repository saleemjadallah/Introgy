import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle deep links for Google Auth in Capacitor apps
 * This hook will set up listeners for the app URL open event
 * and handle the auth callback from Google OAuth
 */
const useGoogleAuth = () => {
  const navigate = useNavigate();
  const [lastProcessedUrl, setLastProcessedUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Set up auth recovery timer for native platforms
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    
    // Check if there was a previously started auth process that didn't complete
    const authInProgress = localStorage.getItem('auth_in_progress');
    const authStartTime = localStorage.getItem('auth_started_at');
    
    if (isNative && authInProgress === 'true' && authStartTime) {
      const startedAt = parseInt(authStartTime, 10);
      const now = Date.now();
      const timeSinceAuthStarted = now - startedAt;
      
      // If more than 2 minutes have passed, we probably missed the callback
      if (timeSinceAuthStarted > 2 * 60 * 1000) {
        console.log('Detected stale auth process, checking session state');
        supabase.auth.getSession().then(({ data, error }) => {
          if (data?.session) {
            console.log('Found valid session despite missing callback');
            toast.success('Signed in successfully');
            // Clear auth in progress
            localStorage.removeItem('auth_in_progress');
            localStorage.removeItem('auth_started_at');
          } else {
            console.log('No valid session found, auth may have failed');
            if (error) console.error('Session error:', error);
            
            // If no valid session, show a message about potential auth failure
            toast.error('Previous sign-in may have failed');
            localStorage.removeItem('auth_in_progress');
            localStorage.removeItem('auth_started_at');
          }
        });
      }
    }
    
    // Only set up deep link listeners for native platforms
    if (!isNative) return;
    
    const handleDeepLink = async (urlOpenEvent: URLOpenListenerEvent) => {
      console.log('App opened with URL:', urlOpenEvent.url);
      
      // Prevent processing the same URL multiple times
      if (lastProcessedUrl === urlOpenEvent.url) {
        console.log('Already processed this URL, skipping');
        return;
      }
      
      setLastProcessedUrl(urlOpenEvent.url);
      toast.info('Processing deep link...');
      
      // Store the URL for debugging
      localStorage.setItem('last_deep_link', urlOpenEvent.url);
      localStorage.setItem('deep_link_time', new Date().toISOString());
      
      // Check if this is an auth callback URL - use a more comprehensive check
      const isAuthUrl = [
        'auth/callback', 
        'auth/v1/callback', 
        'oauth', 
        'google/callback',
        'access_token=',
        'code=',
        'token_type=',
        'introgy.ai/auth/google/callback',
        'introgy.ai/auth/callback',
        'gnvlzzqtmxrfvkdydxet.supabase.co'
      ].some(marker => urlOpenEvent.url.includes(marker));
      
      if (isAuthUrl) {
        try {
          console.log('Processing auth callback from deep link');
          
          // Handle special case for Supabase URLs with invalid paths
          if (urlOpenEvent.url.includes("gnvlzzqtmxrfvkdydxet.supabase.co/introgy.ai")) {
            console.log('Detected Supabase URL with invalid path');
            
            // Extract tokens directly from the URL string
            const extractParam = (url: string, param: string): string | null => {
              const regex = new RegExp(`${param}=([^&]+)`);
              const match = url.match(regex);
              return match ? match[1] : null;
            };
            
            const accessToken = extractParam(urlOpenEvent.url, 'access_token');
            const refreshToken = extractParam(urlOpenEvent.url, 'refresh_token');
            const expiresIn = extractParam(urlOpenEvent.url, 'expires_in');
            const expiresAt = extractParam(urlOpenEvent.url, 'expires_at');
            
            if (accessToken) {
              console.log('Successfully extracted access token from URL');
              
              // Attempt to set the session directly using extracted tokens
              if (accessToken && refreshToken) {
                toast.loading('Setting session with extracted tokens...');
                try {
                  const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                  });
                  
                  if (error) {
                    console.error('Error setting session with extracted tokens:', error);
                    toast.error('Failed to authenticate with extracted tokens');
                    navigate('/auth/debug');
                    return;
                  }
                  
                  if (data?.session) {
                    console.log('Successfully set session with extracted tokens');
                    toast.success('Signed in successfully!');
                    navigate('/');
                    return;
                  }
                } catch (error) {
                  console.error('Error in setSession:', error);
                }
              }
            } else {
              console.warn('Could not extract tokens from URL:', urlOpenEvent.url);
            }
          }
          
          // Standard URL parsing for normal cases
          const url = new URL(urlOpenEvent.url);
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const queryParams = new URLSearchParams(url.search);
          
          // Log detailed information for debugging
          console.log('Deep link auth data:', {
            fullUrl: urlOpenEvent.url,
            protocol: url.protocol,
            host: url.host,
            pathname: url.pathname,
            hash: url.hash,
            search: url.search,
            hashParams: Object.fromEntries(hashParams.entries()),
            queryParams: Object.fromEntries(queryParams.entries())
          });
          
          // Check for errors in URL
          const error = hashParams.get('error') || queryParams.get('error');
          const errorDescription = 
            hashParams.get('error_description') || 
            queryParams.get('error_description') ||
            hashParams.get('message') || 
            queryParams.get('message');
            
          if (error) {
            console.error('Auth error in deep link:', error, errorDescription);
            toast.error(`Authentication error: ${errorDescription || error}`);
            // Navigate to debug page with all information
            navigate('/auth/debug');
            return;
          }
          
          // Check for various auth tokens/codes in different formats
          const hasAuthData = [
            hashParams.has('access_token'),
            queryParams.has('code'),
            hashParams.has('id_token'),
            queryParams.has('token'),
            hashParams.has('refresh_token')
          ].some(Boolean);
          
          if (hasAuthData) {
            console.log('OAuth tokens or code found in URL, processing...');
            toast.loading('Processing authentication...');
            
            // Try to set session directly with tokens from hash if available
            if (hashParams.has('access_token') && hashParams.has('refresh_token')) {
              try {
                const { data, error } = await supabase.auth.setSession({
                  access_token: hashParams.get('access_token')!,
                  refresh_token: hashParams.get('refresh_token')!
                });
                
                if (!error && data.session) {
                  console.log('Successfully set session with tokens from URL hash');
                  toast.success('Signed in successfully!');
                  navigate('/');
                  return;
                }
              } catch (err) {
                console.error('Error setting session with hash tokens:', err);
              }
            }
            
            // Clear the auth_in_progress flag since we've received a callback
            localStorage.removeItem('auth_in_progress');
            localStorage.removeItem('auth_started_at');
            
            // Let Supabase handle processing the OAuth response
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('Error processing deep link auth:', error);
              toast.error('Authentication failed. Please try again.');
              // Navigate to debug page with error information
              navigate('/auth/debug');
              return;
            }
            
            if (data?.session) {
              console.log('Successfully authenticated via deep link');
              toast.success('Signed in successfully!');
              // Navigate to the home page on success
              navigate('/');
            } else {
              // No session but also no error - unusual case
              console.warn('Auth completed but no session found');
              toast.warning('Sign-in process completed but no session was created');
              // Navigate to debug page for investigation
              navigate('/auth/debug');
            }
          }
        } catch (error) {
          console.error('Error handling deep link:', error);
          toast.error('Failed to process authentication. Please try again.');
          // Store error for debugging
          localStorage.setItem('deep_link_error', error instanceof Error ? error.message : String(error));
          // Navigate to debug page with error information
          navigate('/auth/debug');
        }
      } else {
        console.log('Deep link received but not auth-related');
      }
    };
    
    // Add listener for URL open events (deep links)
    let cleanupFunction: (() => void) | undefined;
    
    // Add listener and store the promise
    const listenerPromise = App.addListener('appUrlOpen', handleDeepLink);
    
    // When the promise resolves, store the cleanup function
    listenerPromise.then(listener => {
      cleanupFunction = () => listener.remove();
    });
    
    // Cleanup listener on component unmount
    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, []);
  
  return null; // This hook doesn't return anything
};

export default useGoogleAuth;
