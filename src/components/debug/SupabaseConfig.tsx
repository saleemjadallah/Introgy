import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SupabaseConfig = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getConfig = async () => {
      try {
        // Get the Supabase URL from the environment or constants
        const supabaseUrl = "https://gnvlzzqtmxrfvkdydxet.supabase.co";
        
        // Get the site URL from localStorage or environment
        const siteUrl = process.env.SITE_URL || localStorage.getItem('site_url') || 'Not configured';
        
        // Get the current auth configuration
        const { data: authConfig, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }

        // Store all configuration details
        setConfig({
          supabaseUrl,
          siteUrl,
          authConfig: authConfig || 'No session',
          redirectUrl: localStorage.getItem('auth_redirect_url_used') || 'Not set',
          oauthConfig: localStorage.getItem('auth_oauth_config') || 'Not set',
          callbackDetails: localStorage.getItem('auth_callback_details') || 'Not set'
        });
      } catch (err) {
        console.error('Error fetching Supabase config:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    getConfig();
  }, []);

  if (loading) return <div>Loading Supabase configuration...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Supabase Configuration</h2>
      <pre className="bg-white p-4 rounded overflow-auto max-h-96">
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
};

export default SupabaseConfig;
