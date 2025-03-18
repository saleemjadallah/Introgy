// Deep link handler for Introgy app
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// Create a function to communicate with the main app
function sendMessageToApp(type, data) {
  window.postMessage({
    type: type,
    data: data,
    source: 'deep-links'
  }, '*');
}

/**
 * Initialize deep link handling
 */
export async function initDeepLinks() {
  console.log('Initializing deep link handler');
  console.log('Platform:', Capacitor.getPlatform());
  console.log('Is native platform:', Capacitor.isNativePlatform());
  
  // Set a flag to indicate deep links are being initialized
  localStorage.setItem('deep_links_initializing', 'true');
  
  // Check for any previously stored auth callback URL that might not have been processed
  const storedCallbackUrl = localStorage.getItem('auth_callback_url');
  const callbackReceivedAt = localStorage.getItem('auth_callback_received_at');
  
  if (storedCallbackUrl && callbackReceivedAt) {
    const receivedTime = parseInt(callbackReceivedAt, 10);
    const currentTime = Date.now();
    const minutesAgo = (currentTime - receivedTime) / (1000 * 60);
    
    // Only process if it's recent (within last 5 minutes)
    if (minutesAgo < 5) {
      console.log(`Found stored auth callback URL from ${minutesAgo.toFixed(1)} minutes ago`);
      // We'll process this later after setting up listeners
    } else {
      console.log('Found old stored auth callback URL, clearing');
      localStorage.removeItem('auth_callback_url');
      localStorage.removeItem('auth_callback_received_at');
      localStorage.removeItem('auth_callback_received');
    }
  }
  
  // Immediately check for an active session
  // This is important for iOS where the app might be reopened after auth
  // without a proper deep link being processed
  sendMessageToApp('check_session', {});

  try {
    if (Capacitor.isNativePlatform()) {
      // Listen for deep links
      App.addListener('appUrlOpen', async ({ url }) => {
        console.log('App opened with URL:', url);
        console.log('URL type:', typeof url);
        
        // Store the URL for debugging
        localStorage.setItem('last_app_url_open', url);
        localStorage.setItem('last_app_url_open_time', Date.now().toString());

        // Handle auth callback URLs
        if (url.includes('auth/callback') || url.includes('access_token=') || url.includes('code=')) {
          console.log('Auth callback URL detected in appUrlOpen event');
          
          // Store that we received an auth callback via app URL open
          localStorage.setItem('auth_callback_received_via', 'appUrlOpen');
          localStorage.setItem('auth_callback_received_at', Date.now().toString());
          
          // Process the callback
          await handleAuthCallback(url);
          
          // Set a flag to check session again after a short delay
          // This helps in cases where the auth processing might take time
          setTimeout(() => {
            console.log('Performing delayed session check after auth callback');
            sendMessageToApp('check_session', { force: true });
          }, 3000);
        } else {
          console.log('URL does not contain auth parameters');
          // Still check session as a fallback
          sendMessageToApp('check_session', {});
        }
      });

      // Check if app was opened with a URL
      try {
        const urlResult = await App.getLaunchUrl();
        console.log('Launch URL result:', urlResult);
        
        if (urlResult && urlResult.url) {
          console.log('App launched with URL:', urlResult.url);
          
          // Store the URL for debugging
          localStorage.setItem('last_launch_url', urlResult.url);
          localStorage.setItem('last_launch_url_time', Date.now().toString());
          
          // Handle auth callback URLs
          if (urlResult.url.includes('auth/callback') || urlResult.url.includes('access_token=') || urlResult.url.includes('code=')) {
            console.log('Auth callback URL detected in launch URL');
            
            // Store that we received an auth callback via launch URL
            localStorage.setItem('auth_callback_received_via', 'launchUrl');
            localStorage.setItem('auth_callback_received_at', Date.now().toString());
            
            // Process the callback
            await handleAuthCallback(urlResult.url);
            
            // Set a flag to check session again after a short delay
            // This helps in cases where the auth processing might take time
            setTimeout(() => {
              console.log('Performing delayed session check after launch URL auth callback');
              sendMessageToApp('check_session', { force: true });
            }, 3000);
          } else {
            console.log('Launch URL does not contain auth parameters');
            // Still check session as a fallback
            sendMessageToApp('check_session', {});
          }
        } else {
          console.log('No launch URL found');
          
          // Now process any stored callback URL if it exists
          if (storedCallbackUrl && minutesAgo < 5) {
            console.log('Processing stored auth callback URL');
            await handleAuthCallback(storedCallbackUrl);
          } else {
            console.log('No stored callback URL, checking session anyway');
            // Check session as a fallback
            sendMessageToApp('check_session', {});
          }
        }
      } catch (launchUrlError) {
        console.error('Error getting launch URL:', launchUrlError);
        
        // Process any stored callback URL if it exists
        if (storedCallbackUrl && minutesAgo < 5) {
          console.log('Processing stored auth callback URL after launch URL error');
          await handleAuthCallback(storedCallbackUrl);
        } else {
          // Check session as a fallback
          sendMessageToApp('check_session', {});
        }
      }
    } else {
      console.log('Not a native platform, checking for auth parameters in browser URL');
      
      // For web browser, check if the current URL contains auth parameters
      const currentUrl = window.location.href;
      
      if (currentUrl.includes('auth/callback') || currentUrl.includes('access_token=') || currentUrl.includes('code=')) {
        console.log('Auth parameters detected in browser URL');
        await handleAuthCallback(currentUrl);
      } else {
        console.log('No auth parameters in browser URL');
        sendMessageToApp('check_session', {});
      }
    }
    
    // Log success
    console.log('Deep link handler initialized successfully');
  } catch (error) {
    console.error('Error initializing deep links:', error);
    
    // Process any stored callback URL if it exists
    if (storedCallbackUrl && minutesAgo < 5) {
      console.log('Processing stored auth callback URL after initialization error');
      try {
        await handleAuthCallback(storedCallbackUrl);
      } catch (callbackError) {
        console.error('Error processing stored callback URL:', callbackError);
        // Even if there's an error, try to check the session
        sendMessageToApp('check_session', { force: true });
      }
    } else {
      // Even if there's an error, try to check the session
      sendMessageToApp('check_session', { force: true });
    }
  } finally {
    // Clear the initialization flag
    localStorage.removeItem('deep_links_initializing');
  }
}

/**
 * Handle authentication callback URLs
 * @param {string} url - The callback URL
 */
async function handleAuthCallback(url) {
  console.log('Processing auth callback:', url);
  
  try {
    // Log the full URL for debugging
    console.log('Full callback URL:', url);
    
    // First, send the full URL for processing
    sendMessageToApp('auth_full_url', { url });
    
    // Store detailed information about the auth callback for debugging
    localStorage.setItem('auth_callback_received', 'true');
    localStorage.setItem('auth_callback_received_at', Date.now().toString());
    localStorage.setItem('auth_callback_url', url);
    
    // Store the auth callback attempt count to track multiple attempts
    const attemptCount = parseInt(localStorage.getItem('auth_callback_attempt_count') || '0');
    localStorage.setItem('auth_callback_attempt_count', (attemptCount + 1).toString());
    
    // Store the current timestamp for tracking how long the auth process takes
    const authStartTime = localStorage.getItem('auth_started_at');
    if (authStartTime) {
      const elapsedTime = Date.now() - parseInt(authStartTime);
      localStorage.setItem('auth_elapsed_time_ms', elapsedTime.toString());
      console.log(`Auth process elapsed time: ${elapsedTime}ms`);
    }
    
    // Handle custom scheme URLs (introgy://)
    let processedUrl = url;
    if (url.startsWith('introgy://')) {
      console.log('Processing custom scheme URL');
      
      // Extract the path and query parts
      const schemePrefix = 'introgy://';
      const pathAndQuery = url.substring(schemePrefix.length);
      
      // Check if this is an auth callback path
      if (pathAndQuery.startsWith('auth/callback') || pathAndQuery.includes('access_token=') || pathAndQuery.includes('code=')) {
        console.log('Auth callback detected in custom scheme URL');
        
        // If there's no query part in the custom scheme URL, check session directly
        if (!pathAndQuery.includes('?') && !pathAndQuery.includes('#')) {
          console.log('No parameters in custom scheme URL, checking session');
          sendMessageToApp('check_session', { force: true });
          return;
        }
        
        // For better parameter parsing, convert to a standard URL format
        processedUrl = `https://example.com/${pathAndQuery}`;
        console.log('Converted to standard URL for parsing:', processedUrl);
      } else {
        console.log('Not an auth callback path in custom scheme');
        sendMessageToApp('check_session', {});
        return;
      }
    }
    
    // Extract the hash or query parameters from the URL
    const hasHashParams = processedUrl.includes('#');
    const hasQueryParams = processedUrl.includes('?');
    
    if (!hasHashParams && !hasQueryParams) {
      console.log('No parameters found in URL');
      // For iOS, the URL might be just the scheme and path without params
      // Try to extract just the fact that this is an auth callback
      if (processedUrl.includes('auth/callback')) {
        console.log('Auth callback detected without params, checking session');
        sendMessageToApp('auth_callback_detected', { url: processedUrl });
        // Check session as a fallback
        sendMessageToApp('check_session', { force: true });
      }
      return;
    }
    
    // Parse the URL parameters - try both hash and query parameters
    let params = new URLSearchParams();
    
    // First check hash parameters (after #)
    if (hasHashParams) {
      const hashPart = processedUrl.split('#')[1];
      const hashParams = new URLSearchParams(hashPart);
      console.log('Hash parameters:', Object.fromEntries(hashParams.entries()));
      
      // Add hash parameters to our params object
      hashParams.forEach((value, key) => {
        params.append(key, value);
      });
    }
    
    // Then check query parameters (after ?)
    if (hasQueryParams) {
      const queryPart = processedUrl.split('?')[1]?.split('#')[0]; // Get part between ? and # (or end)
      if (queryPart) {
        const queryParams = new URLSearchParams(queryPart);
        console.log('Query parameters:', Object.fromEntries(queryParams.entries()));
        
        // Add query parameters to our params object
        queryParams.forEach((value, key) => {
          params.append(key, value);
        });
      }
    }
    
    // Log all parameters found
    console.log('All parameters:', Object.fromEntries(params.entries()));
    
    // Check for errors
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      console.error('Auth error:', error, errorDescription);
      
      // Store the error for debugging
      try {
        localStorage.setItem('last_auth_error', JSON.stringify({ 
          error, 
          errorDescription,
          timestamp: Date.now(),
          timestampFormatted: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Error storing auth error:', e);
      }
      
      // Send error message to the main app
      sendMessageToApp('auth_error', { error, errorDescription });
      
      // Clear any auth in progress flags
      localStorage.removeItem('auth_in_progress');
      localStorage.removeItem('auth_started_at');
      
      // Check if this is a redirect URI mismatch error
      if (error === 'redirect_uri_mismatch' || (errorDescription && errorDescription.includes('redirect'))) {
        console.error('Detected redirect URI mismatch error!');
        // This is likely a configuration issue with Supabase or OAuth provider
      }
      
      // Still check session as a fallback
      sendMessageToApp('check_session', {});
      return;
    }
    
    // Check for access token and refresh token
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    if (accessToken && refreshToken) {
      console.log(`Found tokens in URL: access_token (${accessToken.length} chars), refresh_token (${refreshToken.length} chars)`);
      
      // Validate token format
      if (accessToken.length < 10 || refreshToken.length < 10) {
        console.error('Invalid token format - tokens are too short');
        sendMessageToApp('auth_error', { error: 'invalid_token', errorDescription: 'Tokens are too short' });
        sendMessageToApp('check_session', {});
        return;
      }
      
      // Send tokens to the main app to handle authentication
      sendMessageToApp('auth_tokens', { accessToken, refreshToken });
      
      // Also store a flag that we've processed tokens
      localStorage.setItem('auth_tokens_processed', 'true');
      localStorage.setItem('auth_tokens_processed_at', Date.now().toString());
      
      // Clear any auth in progress flags
      localStorage.removeItem('auth_in_progress');
      localStorage.removeItem('auth_started_at');
      return;
    }
    
    // If no tokens in URL, try to get the code
    const code = params.get('code');
    
    if (code) {
      console.log(`Found authorization code (${code.length} chars)`);
      
      // Validate code format
      if (code.length < 10) {
        console.error('Invalid code format - code is too short');
        sendMessageToApp('auth_error', { error: 'invalid_code', errorDescription: 'Code is too short' });
        sendMessageToApp('check_session', {});
        return;
      }
      
      // Send code to the main app to handle authentication
      sendMessageToApp('auth_code', { code });
      
      // Also store a flag that we've processed a code
      localStorage.setItem('auth_code_processed', 'true');
      localStorage.setItem('auth_code_processed_at', Date.now().toString());
      
      // Clear any auth in progress flags
      localStorage.removeItem('auth_in_progress');
      localStorage.removeItem('auth_started_at');
      return;
    }
    
    // Last resort: just check the session
    console.log('No standard auth parameters found, checking session');
    
    // Check if we've already processed tokens or code recently
    const tokensProcessed = localStorage.getItem('auth_tokens_processed');
    const codeProcessed = localStorage.getItem('auth_code_processed');
    
    if (tokensProcessed === 'true' || codeProcessed === 'true') {
      console.log('Auth tokens or code were already processed recently');
    }
    
    // Check session as a fallback
    sendMessageToApp('check_session', { force: true });
  } catch (error) {
    console.error('Error processing auth callback:', error);
    sendMessageToApp('auth_error', { error: error.message || 'Unknown error' });
    
    // Still try to check session as a fallback
    sendMessageToApp('check_session', { force: true });
  }
}
