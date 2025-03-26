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
        
        // Parse URL components for debugging
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for site URL formatting error in URL parameters
        const urlError = hashParams.get('error') || queryParams.get('error');
        const urlErrorDescription = 
          hashParams.get('error_description') || 
          queryParams.get('error_description') || 
          hashParams.get('message') || 
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
          hashParams: Object.fromEntries(hashParams.entries()),
          queryParams: Object.fromEntries(queryParams.entries()),
          isSiteUrlError
        }));
        
        // Let Supabase process the OAuth response
        // This will automatically exchange the OAuth code for a session
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        // Handle any auth errors
        if (authError) {
          console.error('Auth error:', authError);
          setError(authError.message);
          toast.error(`Authentication failed: ${authError.message}`);
          return;
        }
        
        // Double-check that we have a valid session
        const { data, error: sessionError } = await supabase.auth.refreshSession();
        
        // Handle any session errors
        if (sessionError) {
          console.error('Session refresh error:', sessionError);
          setError(sessionError.message);
          toast.error(`Authentication failed: ${sessionError.message}`);
          return;
        }
        
        if (data?.session) {
          console.log("Authentication successful, session established");
          toast.success("Signed in successfully");
          
          // Redirect to profile page immediately
          navigate('/profile');
        } else {
          console.warn("No session data found after token exchange");
          setError("No session data found");
          toast.error("Authentication failed: No session data found");
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
