import { supabase, REDIRECT_URL } from "@/integrations/supabase/client";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

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
      // For native platforms, use the URL configured in Google Cloud Console
      redirectTo = 'https://introgy.ai/auth/callback';
      localStorage.setItem('auth_redirect_native', redirectTo);
      console.log(`Using native redirect URL for ${platform}:`, redirectTo);
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
        // Skip browser redirect on native platforms
        skipBrowserRedirect: Capacitor.isNativePlatform(),
        // Query parameters required for proper Google OAuth flow
        queryParams: {
          // Required for Google to send refresh tokens
          access_type: 'offline',
          // Use 'none' to skip consent screens if already granted
          prompt: 'none',
          // Include granted scopes to avoid re-prompting
          include_granted_scopes: 'true',
          // Login hint if we have the user's email
          ...(localStorage.getItem('user_email') ? { login_hint: localStorage.getItem('user_email') } : {})
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
      return data;
    }
    
    // Parse the URL to examine its components
    const url = new URL(data.url);
    console.log('URL protocol:', url.protocol);
    console.log('URL host:', url.host);
    console.log('URL pathname:', url.pathname);
    
    // Check for redirect_uri parameter which might be causing issues
    const params = new URLSearchParams(url.search);
    console.log('redirect_uri param:', params.get('redirect_uri'));
    
    // For iOS, use a more aggressive approach to prevent external browser
    if (platform === 'ios') {
      console.log('Using force in-app browser approach for iOS');
      
      // Force use of internal Browser plugin and prevent external browser
      try {
        // First, ensure any existing browser is closed
        await Browser.close();
        
        // Add listeners to detect browser closed events
        const handleBrowserClosed = () => {
          console.log('Browser was closed');
          document.removeEventListener('browserClosed', handleBrowserClosed);
        };
        
        // Listen for custom events from native side
        document.addEventListener('browserClosed', handleBrowserClosed);
        
        // Add listener for auth completion
        const handleAuthComplete = (event: CustomEvent) => {
          console.log('Received auth completion event:', event.detail);
          document.removeEventListener('supabase.auth.signIn', handleAuthComplete as EventListener);
        };
        window.addEventListener('supabase.auth.signIn', handleAuthComplete as EventListener);
        
        // Crucial: Force the in-app browser by explicitly setting presentation params
        console.log('Opening auth URL with forced in-app browser:', data.url);
        await Browser.open({ 
          url: data.url,
          presentationStyle: 'fullscreen',
          toolbarColor: '#121212',
          // These options help force in-app browser
          windowName: '_self'
        });
      } catch (e) {
        console.error('Error using Browser plugin:', e);
        // Even with error, don't fall back to window.open as that would use external browser
        
        // Try a different approach with our custom event
        const forceInAppBrowsingEvent = new CustomEvent('forceInAppBrowsing', {
          detail: { url: data.url }
        });
        document.dispatchEvent(forceInAppBrowsingEvent);
        console.log('Dispatched forceInAppBrowsing event as fallback');
      }
    } else {
      // For other platforms, use the browser plugin
      try {
        await Browser.open({ 
          url: data.url,
          presentationStyle: 'fullscreen',
          windowName: '_self'  
        });
      } catch (e) {
        console.warn('Browser plugin failed:', e);
        // For non-iOS platforms, fallback to window.open may be necessary
        window.open(data.url, '_self');  // Use _self instead of _blank
      }
    }
    
    return data;
  } catch (err) {
    console.error("Google sign-in error:", err);
    localStorage.setItem('google_auth_error', JSON.stringify(err));
    throw err;
  }
}
