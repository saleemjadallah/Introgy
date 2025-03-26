import { supabase, REDIRECT_URL } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";

/**
 * Sign in with Google using the recommended pattern
 * This function follows Supabase's recommended approach for Google authentication
 */
export async function signInWithGoogle() {
  try {
    // Store debug information
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    localStorage.setItem('auth_timestamp', new Date().toISOString());
    localStorage.setItem('auth_attempt_platform', platform);
    localStorage.setItem('auth_attempt_is_native', String(isNative));
    
    // For native platforms, use platform-specific redirect URLs
    // Always use a properly formatted URL without trailing slashes
    // This helps prevent the 'site url is improperly formatted' error
    
    // For web authentication, we MUST use the Supabase callback URL directly
    // This is critical - using your own domain for callbacks causes the 'site url is improperly formatted' error
    let redirectTo = 'https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback';
    
    // Store the redirect URL for debugging
    localStorage.setItem('auth_redirect_base', redirectTo);
    
    if (isNative) {
      if (platform === 'ios') {
        // For iOS, use the custom URL scheme that matches what's in Info.plist
        // This format is critical - it must match EXACTLY what's in Info.plist
        // Do not add trailing slashes or extra characters
        redirectTo = 'com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2:/oauth2redirect';
        localStorage.setItem('auth_redirect_ios', redirectTo);
        console.log('Using iOS redirect URL:', redirectTo);
      } else if (platform === 'android') {
        // For Android, use the custom URL scheme that matches what's in AndroidManifest.xml
        // This format is critical - it must match EXACTLY what's in your intent filters
        redirectTo = 'com.introgy.app:/oauth2redirect';
        localStorage.setItem('auth_redirect_android', redirectTo);
        console.log('Using Android redirect URL:', redirectTo);
      }
    }
    
    console.log(`Using redirect URL: ${redirectTo}`);
    localStorage.setItem('auth_redirect_url_used', redirectTo);
    
    // Call Supabase OAuth with the correct parameters
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This must match a redirect URL you've added in Supabase dashboard
        redirectTo,
        // Essential scopes for Google Auth
        scopes: 'email profile',
        // Query parameters required for proper Google OAuth flow
        queryParams: {
          // Required for Google to send refresh tokens
          access_type: 'offline',
          // Ensures the consent screen is shown every time
          prompt: 'consent'
        }
      }
    });
    
    if (error) {
      console.error('Auth Error:', error);
      localStorage.setItem('auth_error', JSON.stringify({
        message: error.message,
        name: error.name,
        timestamp: new Date().toISOString()
      }));
      throw error;
    }
    
    if (!data?.url) {
      console.error("No OAuth URL returned from Supabase");
      localStorage.setItem('auth_error', 'No OAuth URL returned');
      throw new Error("Failed to get authentication URL");
    }
    
    console.log(`Received OAuth URL from Supabase: ${data.url}`);
    localStorage.setItem('oauth_url', data.url);
    
    // For web platforms, redirect to the OAuth URL
    if (!isNative) {
      window.location.href = data.url;
    } else {
      // For native platforms, open the URL in the system browser
      // This should be handled by your native implementation
      // Use proper type casting for Capacitor plugins
      if (Capacitor.isPluginAvailable('Browser')) {
        // Use proper type casting to access Capacitor plugins
        const Browser = (Capacitor as any).Plugins.Browser;
        await Browser.open({ url: data.url });
      } else {
        // Fallback to window.open for Capacitor web
        window.open(data.url, '_blank');
      }
    }
    
    return data;
  } catch (err) {
    console.error("Google sign-in error:", err);
    localStorage.setItem('google_auth_error', JSON.stringify(err));
    throw err;
  }
}
