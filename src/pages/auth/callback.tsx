import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Log the complete URL for debugging
        const currentUrl = window.location.href;
        console.log("Auth callback received at URL:", currentUrl);
        
        // Parse URL hash parameters
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Extract tokens from hash parameters
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        
        // Check for errors in both hash and query parameters
        const urlError = urlParams.get('error') || queryParams.get('error');
        const urlErrorDescription = 
          urlParams.get('error_description') || 
          queryParams.get('error_description') || 
          urlParams.get('message') || 
          queryParams.get('message');
          
        // Check specifically for site URL formatting error
        const isSiteUrlError = urlError === 'unexpected_failure' && 
          (urlErrorDescription?.toLowerCase().includes('site url') || 
           urlErrorDescription?.toLowerCase().includes('formatted'));
           
        if (isSiteUrlError) {
          console.error('Site URL formatting error detected:', urlErrorDescription);
          localStorage.setItem('site_url_error_detected', 'true');
          localStorage.setItem('site_url_error_description', urlErrorDescription || 'Unknown');
        }
        
        // Store callback details for debugging
        localStorage.setItem('auth_callback_details', JSON.stringify({
          url: currentUrl,
          timestamp: new Date().toISOString(),
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          hashParams: Object.fromEntries(urlParams.entries()),
          queryParams: Object.fromEntries(queryParams.entries()),
          tokens: {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken
          },
          isSiteUrlError
        }));
        
        // Log tokens for debugging
        console.log('Received tokens:', { 
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken
        });
        
        // Check if we're on iOS native platform
        const isIOS = window.Capacitor?.getPlatform() === 'ios';
        
        if (isIOS) {
          // For iOS, we'll let the native handler manage the tokens
          console.log('iOS platform detected, tokens will be handled by native flow');
          navigate('/profile');
          return;
        }

        // For web platform, handle the tokens here
        if (!accessToken) {
          console.error('No access token found in URL');
          setError('No access token found');
          toast.error('Authentication failed: No access token found');
          return;
        }

        try {
          // Set the session with the received tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          // Handle any auth errors
          if (error) {
            console.error('Auth error:', error);
            setError(error.message);
            toast.error(`Authentication failed: ${error.message}`);
            return;
          }
          
          if (data?.session) {
            console.log("Authentication successful, session established");
            
            // Force a session refresh to ensure we have the latest state
            const { data: refreshData } = await supabase.auth.getSession();
            if (refreshData.session) {
              console.log('Session refreshed successfully');
              window.dispatchEvent(new CustomEvent('supabase.auth.signIn', { 
                detail: { session: refreshData.session } 
              }));
            }
            
            toast.success("Signed in successfully");
            navigate('/profile');
          } else {
            console.warn("No session data found after token exchange");
            setError("No session data found");
            toast.error("Authentication failed: No session data found");
          }
        } catch (e) {
          console.error('Exception during session setup:', e);
          setError(e instanceof Error ? e.message : 'Unknown error');
          toast.error('Authentication failed: Unexpected error');
        }
      } catch (err) {
        console.error("Error in auth callback:", err);
        setError(err instanceof Error ? err.message : String(err));
        toast.error("Authentication error occurred");
      } finally {
        setProcessing(false);
      }
    };

    handleCallback();
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Authentication</h1>
      {processing ? (
        <div>
          <p className="mb-4">Processing authentication...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">
          <p>Authentication failed</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Return to Home
          </button>
        </div>
      ) : (
        <div className="text-green-500">
          <p>Authentication successful!</p>
          <p className="text-sm mt-2">Redirecting to your profile...</p>
        </div>
      )}
    </div>
  );
}
