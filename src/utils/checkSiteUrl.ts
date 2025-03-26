import { supabase } from "@/integrations/supabase/client";

// Function to check the current Site URL configuration in Supabase
export const checkSiteUrl = async () => {
  try {
    // Instead of querying a non-existent table, we'll get the site URL from the client config
    // or from environment variables/constants
    
    // Get the site URL from the environment or constants
    const SITE_URL = "https://introgy.ai";
    console.log('Current site URL (from constants):', SITE_URL);
    
    // Check if we have a session to verify Supabase connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking Supabase connection:', error);
      return null;
    }
    
    // Return the site URL from our constants
    return SITE_URL;
  } catch (err) {
    console.error('Exception when checking site URL:', err);
    return null;
  }
};

// Execute immediately when imported
checkSiteUrl();
