
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
        // Get the URL hash and log it for debugging
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlError = hashParams.get('error');
        const urlErrorDescription = hashParams.get('error_description');
        
        console.log("Auth callback URL:", window.location.href);
        console.log("Hash params:", Object.fromEntries(hashParams.entries()));
        
        if (urlError) {
          console.error("URL Error:", urlError, urlErrorDescription);
          setError(urlErrorDescription || "Authentication failed");
          toast.error(urlErrorDescription || "Authentication failed");
          setTimeout(() => navigate('/auth'), 2000);
          return;
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
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate('/auth'), 2000);
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
