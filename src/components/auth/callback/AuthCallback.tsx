
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";

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
          queryParams: Object.fromEntries(queryParams.entries()),
          timestamp: new Date().toISOString()
        });
        
        // Store detailed callback information for debugging
        localStorage.setItem('auth_callback_details', JSON.stringify({
          url: currentUrl,
          pathname,
          hash: window.location.hash,
          search: window.location.search,
          origin: window.location.origin,
          host: window.location.host,
          hashParams: Object.fromEntries(hashParams.entries()),
          queryParams: Object.fromEntries(queryParams.entries()),
          timestamp: new Date().toISOString()
        }));
        
        // Clear any stored debug page redirects
        localStorage.removeItem('debug_redirect');
        
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
        localStorage.setItem('callback_origin', window.location.origin);
        localStorage.setItem('callback_pathname', window.location.pathname);
        
        // Check for errors in both places
        const urlError = hashParams.get('error') || queryParams.get('error');
        const urlErrorDescription = 
          hashParams.get('error_description') || 
          queryParams.get('error_description') || 
          hashParams.get('message') || 
          queryParams.get('message');
          
        // Store error information for debugging
        if (urlError) {
          console.error(`Auth error detected: ${urlError} - ${urlErrorDescription}`);
          localStorage.setItem('auth_callback_error', urlError);
          localStorage.setItem('auth_callback_error_description', urlErrorDescription || 'No description');
          localStorage.setItem('auth_callback_error_time', new Date().toISOString());
        }
          
        // Check for site URL formatting error - this is a common error with OAuth redirect issues
        const isSiteUrlError = urlError === 'unexpected_failure' && 
          (urlErrorDescription?.toLowerCase().includes('site url') || 
           urlErrorDescription?.toLowerCase().includes('formatted'));
           
        // Check for platform-specific information
        const platform = Capacitor.getPlatform();
        const isNative = Capacitor.isNativePlatform();
        const isIOSPlatform = platform === 'ios';
        const isRedirectError = urlErrorDescription?.toLowerCase().includes('redirect') || 
                               urlErrorDescription?.toLowerCase().includes('url');
        
        // Log platform-specific information
        console.log(`Platform check: platform=${platform}, isNative=${isNative}, isIOS=${isIOSPlatform}`);
        localStorage.setItem('auth_callback_platform', platform);
        localStorage.setItem('auth_callback_is_native', String(isNative));
        
        // With our app using its own domain for the callback URL,
        // callbacks will come directly to our app's domain
        const expectedRedirectUrl = localStorage.getItem('auth_redirect_url');
        
        if (expectedRedirectUrl) {
          // Using currentUrl already declared at the beginning of the component
          console.log(`Callback URL: ${currentUrl}`);
          console.log(`Expected redirect URL: ${expectedRedirectUrl}`);
          
          localStorage.setItem('auth_callback_url', currentUrl);
          localStorage.setItem('auth_callback_expected_redirect', expectedRedirectUrl);
          
          // Check if we're on the correct callback path
          // We need to handle both our app domain callbacks and Supabase domain callbacks
          const isAppCallback = window.location.pathname.includes('/auth/callback');
          const isSupabaseCallback = window.location.hostname.includes('supabase.co') && 
                                   window.location.pathname.includes('/auth/v1/callback');
          const isCorrectCallbackPath = isAppCallback || isSupabaseCallback;
          
          console.log(`Is app callback: ${isAppCallback}`);
          console.log(`Is Supabase callback: ${isSupabaseCallback}`);
          console.log(`Is correct callback path: ${isCorrectCallbackPath}`);
          
          localStorage.setItem('auth_callback_is_app', String(isAppCallback));
          localStorage.setItem('auth_callback_is_supabase', String(isSupabaseCallback));
          localStorage.setItem('auth_callback_correct_path', String(isCorrectCallbackPath));
        }
           
        if (isSiteUrlError) {
          console.error('Site URL formatting error detected in callback');
          localStorage.setItem('auth_error_type', 'site_url_formatting');
          
          // Log more details to help debug the site URL formatting issue
          console.log(`Auth configuration info:`);  
          console.log(`- Platform: ${platform}, isNative: ${isNative}`);  
          console.log(`- Callback URL: ${currentUrl}`);  
          console.log(`- Expected redirect: ${expectedRedirectUrl || 'not set'}`);  

          // Additional logging for iOS redirect URL issues
          if (isIOSPlatform && isRedirectError) {
            console.error('iOS redirect URL formatting issue detected');
            localStorage.setItem('auth_error_ios_redirect', 'true');
          }
        }
        
        // Handle any errors from the OAuth provider
        if (urlError) {
          console.error("Auth Error:", urlError, urlErrorDescription);
          
          // Check if this is an iOS platform with redirect URL issues
          if (isSiteUrlError && isIOSPlatform && isRedirectError) {
            console.log("Detected iOS redirect URL formatting issue - attempting recovery");
            
            // For iOS, we can try to recover by checking if we have tokens in localStorage
            // that might have been saved by the AppDelegate
            const savedAccessToken = localStorage.getItem('ios_access_token');
            const savedIdToken = localStorage.getItem('ios_id_token');
            
            if (savedAccessToken || savedIdToken) {
              console.log("Found saved tokens from iOS native flow, attempting to use them");
              localStorage.setItem('auth_ios_recovery_attempted', 'true');
              
              try {
                // Try to create a session with the saved tokens
                const token = savedAccessToken || savedIdToken;
                if (token) {
                  const { data, error } = await supabase.auth.setSession({
                    access_token: token,
                    refresh_token: localStorage.getItem('ios_refresh_token') || '',
                  });
                  
                  if (!error && data?.session) {
                    console.log("Successfully recovered session from iOS tokens");
                    toast.success("Signed in successfully");
                    navigate('/profile');
                    return;
                  }
                }
              } catch (recoveryError) {
                console.error("Error in iOS token recovery:", recoveryError);
                localStorage.setItem('auth_ios_recovery_error', JSON.stringify(recoveryError));
              }
            }
            
            // If recovery failed, show a more specific error for iOS users
            setError("iOS authentication issue. Please try again or use a different sign-in method.");
            toast.error("iOS authentication issue. Please try again.");
          } else if (isSiteUrlError) {
            // This is the site URL formatting error for non-iOS platforms
            setError("Authentication configuration error. Please try again later.");
            toast.error("Authentication configuration error. Please try again later.");
          } else {
            // Other OAuth errors
            setError(urlErrorDescription || "Authentication failed");
            toast.error(urlErrorDescription || "Authentication failed");
          }
          
          // Redirect back to the auth page
          setTimeout(() => navigate('/auth'), 2000);
          return;
        }
        
        // Handle state parameter from OAuth flow if present
        const stateParam = hashParams.get('state') || queryParams.get('state');
        if (stateParam) {
          console.log("Auth state parameter present:", stateParam);
          
          try {
            // Try to parse the state as JSON (we now store more detailed state)
            const stateObj = JSON.parse(stateParam);
            console.log("Parsed state object:", stateObj);
            
            // Store the parsed state for debugging
            localStorage.setItem('auth_state_parsed', JSON.stringify(stateObj));
            
            // Check if the redirect URL in the state matches what we expect
            if (stateObj.redirectUrl) {
              console.log("State contains redirect URL:", stateObj.redirectUrl);
              localStorage.setItem('auth_callback_redirect_url', stateObj.redirectUrl);
            }
          } catch (e) {
            // If it's not JSON, it might be the older format
            console.log("State is not JSON, using as string:", stateParam);
            localStorage.setItem('auth_state_string', stateParam);
          }
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
            const { data: userResponse, error: profileError } = await supabase
              .from('profiles')
              .select('created_at')
              .eq('id', data.session.user.id)
              .maybeSingle();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              navigate('/profile');
              return;
            }

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
          
          // Store detailed error information for debugging
          localStorage.setItem('auth_error_details', errorStr);
          localStorage.setItem('auth_error_time', new Date().toISOString());
          localStorage.setItem('auth_error_url', window.location.href);
          
          // Log detailed diagnostic information
          const diagnosticInfo = {
            error: errorStr,
            url: window.location.href,
            platform: Capacitor.getPlatform(),
            isNative: Capacitor.isNativePlatform(),
            redirectUrl: localStorage.getItem('auth_redirect_url'),
            timestamp: new Date().toISOString()
          };
          console.error('Authentication error diagnostics:', diagnosticInfo);
          localStorage.setItem('auth_error_diagnostics', JSON.stringify(diagnosticInfo));
          
          setError("Authentication configuration error. Please try again later.");
          toast.error("Authentication configuration error. The team has been notified.");
          
          // Navigate back to the auth page
          setTimeout(() => navigate('/auth'), 2000);
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
