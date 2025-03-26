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
        
        // This processes the auth response
        const { data, error } = await supabase.auth.getSession();
        
        // Handle any errors
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          toast.error(`Authentication failed: ${error.message}`);
          return;
        }
        
        if (data?.session) {
          console.log("Authentication successful, session established");
          toast.success("Signed in successfully");
          
          // Store session info for debugging
          localStorage.setItem('auth_success_time', new Date().toISOString());
          localStorage.setItem('auth_user_id', data.session.user.id);
          
          // Redirect to your app's home or dashboard
          setTimeout(() => {
            navigate('/profile');
          }, 1000);
        } else {
          console.warn("No session data found in callback");
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
