
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Check if this is a new user
          const { data: userResponse } = await supabase
            .from('profiles')
            .select('created_at')
            .eq('id', data.session.user.id)
            .single();

          // Calculate time difference in minutes
          const createdTime = new Date(userResponse?.created_at || 0);
          const currentTime = new Date();
          const minutesDiff = (currentTime.getTime() - createdTime.getTime()) / (1000 * 60);
          
          // If account was created less than 5 minutes ago, consider it new
          if (userResponse && minutesDiff < 5) {
            navigate('/onboarding');
          } else {
            navigate('/profile');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error processing auth callback:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Processing authentication...</h2>
        <p className="text-muted-foreground">You will be redirected shortly.</p>
      </div>
    </div>
  );
};
