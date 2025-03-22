
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log the complete URL for debugging
        const currentUrl = window.location.href;
        console.log("Auth callback received at URL:", currentUrl);
        toast.info("Processing authentication...");
        
        // Parse URL components for debugging
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        const pathname = window.location.pathname;
        
        // Log detailed information about the callback URL
        console.log("Callback URL details:", {
          url: currentUrl,
          pathname,
          hash: window.location.hash,
          search: window.location.search,
          origin: window.location.origin,
          host: window.location.host,
          hashParams: Object.fromEntries(hashParams.entries()),
          queryParams: Object.fromEntries(queryParams.entries())
        });
        
        // Check for the specific error pattern with introgy.ai in the path
        const hasIntrogyInPath = pathname.includes('introgy.ai');
        const hasTokenInHash = hashParams.has('access_token') || hashParams.has('token');
        
        if (hasIntrogyInPath && hasTokenInHash) {
          console.error("Detected invalid path with introgy.ai but contains valid tokens");
          console.log("This indicates a Supabase URL construction issue - handling manually");
          
          // We can try to extract the tokens ourselves and manually handle the auth
          try {
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const expiresIn = hashParams.get('expires_in');
            const tokenType = hashParams.get('token_type') || 'bearer';
            
            if (accessToken) {
              console.log("Found access token, attempting manual session creation");
              localStorage.setItem('auth_token_extracted', 'true');
              
              // Store session with extracted token
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });
              
              if (error) {
                throw error;
              }
              
              if (data?.session) {
                console.log("Successfully created session from extracted tokens");
                toast.success("Signed in successfully");
                navigate('/profile');
                return;
              }
            }
          } catch (extractError) {
            console.error("Error handling extracted tokens:", extractError);
          }
        }
        
        // Store callback URL information for debugging
        localStorage.setItem('last_callback_url', currentUrl);
        localStorage.setItem('callback_time', new Date().toISOString());
        
        // Check for errors in both places
        const urlError = hashParams.get('error') || queryParams.get('error');
        const urlErrorDescription = 
          hashParams.get('error_description') || 
          queryParams.get('error_description') || 
          hashParams.get('message') || 
          queryParams.get('message');
          
        // Also look for the specific site URL formatting error
        const isSiteUrlError = urlError === 'unexpected_failure' && 
          (urlErrorDescription?.includes('site url') || 
           urlErrorDescription?.includes('formatted'));
           
        if (isSiteUrlError) {
          console.error('Site URL formatting error detected in callback');
          localStorage.setItem('auth_error_type', 'site_url_formatting');
        }
        
        // Handle any errors from the OAuth provider
        if (urlError) {
          console.error("Auth Error:", urlError, urlErrorDescription);
          
          if (isSiteUrlError) {
            // This is the site URL formatting error
            setError("Authentication configuration error. Please try again later.");
            toast.error("Authentication configuration error. Please try again later.");
            
            // Redirect to debug page for more detailed information
            setTimeout(() => navigate('/auth/debug'), 2000);
          } else {
            // Other OAuth errors
            setError(urlErrorDescription || "Authentication failed");
            toast.error(urlErrorDescription || "Authentication failed");
            setTimeout(() => navigate('/auth'), 2000);
          }
          return;
        }
        
        // Handle state parameter from OAuth flow if present
        const state = hashParams.get('state') || queryParams.get('state');
        if (state) {
          console.log("Auth state parameter present:", state);
        }

        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        if (data?.session) {
          console.log("User authenticated:", data.session.user.id);
          
          // Check if this is a new user
          try {
            const { data: userResponse } = await supabase
              .from('profiles')
              .select('created_at')
              .eq('id', data.session.user.id)
              .maybeSingle();

            // Calculate time difference in minutes
            const createdTime = new Date(userResponse?.created_at || 0);
            const currentTime = new Date();
            const minutesDiff = (currentTime.getTime() - createdTime.getTime()) / (1000 * 60);
            
            // If account was created less than 5 minutes ago, consider it new
            if (userResponse && minutesDiff < 5) {
              sessionStorage.setItem("newSignup", "true");
              navigate('/onboarding');
            } else {
              navigate('/profile');
            }
          } catch (profileError) {
            console.error("Error checking profile:", profileError);
            navigate('/profile');
          }
        } else {
          console.log("No session found, redirecting to auth");
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error processing auth callback:', error);
        
        // Check if this is the site URL formatting error
        const errorStr = String(error);
        if (errorStr.includes('site url is improperly formatted') || 
            errorStr.includes('unexpected_failure')) {
          console.error('Site URL formatting error in catch block:', error);
          
          // Store error details for debugging
          localStorage.setItem('auth_error_details', errorStr);
          localStorage.setItem('auth_error_time', new Date().toISOString());
          
          setError("Authentication configuration error. Please try again later.");
          toast.error("Authentication configuration error. The team has been notified.");
          
          // Navigate to debug page for troubleshooting
          setTimeout(() => navigate('/auth/debug'), 2000);
        } else {
          // Handle other errors
          setError("Authentication failed. Please try again.");
          toast.error("Authentication failed. Please try again.");
          setTimeout(() => navigate('/auth'), 2000);
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {error ? (
          <>
            <h2 className="text-xl font-medium mb-2 text-destructive">Authentication Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-4">Redirecting to sign in page...</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-medium mb-2">Processing authentication...</h2>
            <p className="text-muted-foreground">You will be redirected shortly.</p>
          </>
        )}
      </div>
    </div>
  );
};
