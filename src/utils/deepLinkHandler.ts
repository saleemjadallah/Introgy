import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simple navigation functions since we don't have the navigation utility yet
function navigateToProfile() {
  window.location.href = '/profile';
}

function navigateToOnboarding() {
  window.location.href = '/onboarding';
}

function navigateToAuth() {
  window.location.href = '/auth';
}

/**
 * Initialize the deep link message handler
 * This will listen for messages from the deep-links.js script
 */
export function initDeepLinkMessageHandler() {
  console.log('Initializing deep link message handler');
  
  // Store initialization time for debugging
  localStorage.setItem('deep_link_handler_initialized', Date.now().toString());
  
  window.addEventListener('message', async (event) => {
    // Only process messages from our deep-links script
    if (event.data?.source !== 'deep-links') {
      return;
    }
    
    console.log('Received deep link message:', event.data);
    
    // Store message info for debugging
    try {
      const messageTime = Date.now();
      localStorage.setItem('last_deep_link_message', JSON.stringify({
        type: event.data.type,
        time: messageTime,
        timeFormatted: new Date(messageTime).toISOString()
      }));
    } catch (storageError) {
      console.error('Error storing message info:', storageError);
    }
    
    const { type, data } = event.data;
    
    try {
      switch (type) {
        case 'auth_tokens':
          console.log('Received auth_tokens message');
          if (data?.accessToken && data?.refreshToken) {
            await handleAuthTokens(data.accessToken, data.refreshToken);
          } else {
            console.error('Invalid auth_tokens message: missing token data');
            toast.error('Authentication failed: Missing token data');
          }
          break;
        
        case 'auth_code':
          console.log('Received auth_code message');
          if (data?.code) {
            await handleAuthCode(data.code);
          } else {
            console.error('Invalid auth_code message: missing code');
            toast.error('Authentication failed: Missing authorization code');
          }
          break;
        
        case 'auth_error':
          console.log('Received auth_error message');
          if (data?.error) {
            await handleAuthError(data.error, data.errorDescription || '');
          } else {
            console.error('Invalid auth_error message: missing error');
            toast.error('Authentication error');
          }
          break;
        
        case 'auth_callback_detected':
          console.log('Received auth_callback_detected message');
          // Force a session check with the force option
          await checkCurrentSession(true, { force: true });
          break;
        
        case 'auth_full_url':
          console.log('Received auth_full_url message');
          if (data?.url) {
            await processFullAuthUrl(data.url);
          } else {
            console.error('Invalid auth_full_url message: missing URL');
          }
          break;
        
        case 'check_session':
          console.log('Received check_session message');
          // Check if force refresh is requested
          const forceRefresh = data?.force === true;
          const silent = data?.silent === true;
          
          console.log(`Check session requested, force: ${forceRefresh}, silent: ${silent}`);
          
          // Pass options to checkCurrentSession
          await checkCurrentSession(forceRefresh, { 
            force: forceRefresh, 
            silent: silent 
          });
          break;
        
        default:
          console.log('Unknown message type:', type);
      }
    } catch (messageHandlingError) {
      console.error(`Error handling message of type '${type}':`, messageHandlingError);
      
      // Try to recover by checking session silently
      try {
        await checkCurrentSession(false, { silent: true });
      } catch (sessionError) {
        console.error('Error checking session after message handling error:', sessionError);
      }
    }
  });
  
  // Also check for session on initialization (silent mode)
  console.log('Checking session on initialization');
  checkCurrentSession(false, { silent: true }).catch(error => {
    console.error('Error checking session on initialization:', error);
  });
}

/**
 * Handle authentication tokens received from deep link
 */
async function handleAuthTokens(accessToken: string, refreshToken: string) {
  try {
    console.log('Setting session with tokens');
    console.log('Access token length:', accessToken?.length);
    console.log('Refresh token length:', refreshToken?.length);
    
    if (!accessToken || !refreshToken) {
      console.error('Missing tokens');
      toast.error('Authentication failed: Missing tokens');
      return;
    }
    
    // First check if we already have a session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      console.log('Already have a session, checking if it matches the tokens');
      
      // If the current session matches the tokens, we're already logged in
      if (sessionData.session.access_token === accessToken) {
        console.log('Session already has the same access token');
        toast.success('Already signed in with Google');
        await checkAndNavigateUser(sessionData.session.user.id);
        return;
      }
    }
    
    // Set the session with the new tokens
    console.log('Setting new session with tokens');
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    if (error) {
      console.error('Error setting session:', error);
      toast.error('Failed to complete authentication. Please try again.');
      
      // Try to get the session again to see if we're already authenticated
      const { data: checkData } = await supabase.auth.getSession();
      if (checkData?.session) {
        console.log('Found existing session despite error');
        toast.success('Already signed in with Google');
        await checkAndNavigateUser(checkData.session.user.id);
      }
      return;
    }
    
    console.log('Authentication successful:', data.user?.id);
    toast.success('Successfully signed in with Google');
    
    // Check if this is a new user
    await checkAndNavigateUser(data.user?.id);
  } catch (error) {
    console.error('Error handling auth tokens:', error);
    toast.error('Failed to complete authentication. Please try again.');
    
    // Try to get the session again as a fallback
    try {
      const { data: fallbackData } = await supabase.auth.getSession();
      if (fallbackData?.session) {
        console.log('Found session in fallback check');
        toast.success('Successfully signed in with Google');
        await checkAndNavigateUser(fallbackData.session.user.id);
      }
    } catch (fallbackError) {
      console.error('Error in fallback session check:', fallbackError);
    }
  }
}

/**
 * Handle authentication code received from deep link
 */
async function handleAuthCode(code: string) {
  try {
    console.log('Exchanging code for session');
    console.log('Code length:', code?.length);
    
    if (!code) {
      console.error('Missing authorization code');
      toast.error('Authentication failed: Missing authorization code');
      return;
    }
    
    // First check if we already have a session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      console.log('Already have a session, checking if it is valid');
      
      try {
        // Try to refresh the session to verify it's valid
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshData?.session) {
          console.log('Session is valid, using existing session');
          toast.success('Already signed in with Google');
          await checkAndNavigateUser(refreshData.session.user.id);
          return;
        }
      } catch (refreshError) {
        console.log('Error refreshing session, will try to exchange code:', refreshError);
        // Continue with code exchange
      }
    }
    
    // Exchange the code for a session
    console.log('Exchanging code for session');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      toast.error('Failed to complete authentication. Please try again.');
      
      // Try to get the session again to see if we're already authenticated
      const { data: checkData } = await supabase.auth.getSession();
      if (checkData?.session) {
        console.log('Found existing session despite error');
        toast.success('Already signed in with Google');
        await checkAndNavigateUser(checkData.session.user.id);
      }
      return;
    }
    
    console.log('Authentication successful:', data.user?.id);
    toast.success('Successfully signed in with Google');
    
    // Check if this is a new user
    await checkAndNavigateUser(data.user?.id);
  } catch (error) {
    console.error('Error handling auth code:', error);
    toast.error('Failed to complete authentication. Please try again.');
    
    // Try to get the session again as a fallback
    try {
      const { data: fallbackData } = await supabase.auth.getSession();
      if (fallbackData?.session) {
        console.log('Found session in fallback check');
        toast.success('Successfully signed in with Google');
        await checkAndNavigateUser(fallbackData.session.user.id);
      }
    } catch (fallbackError) {
      console.error('Error in fallback session check:', fallbackError);
    }
  }
}

/**
 * Handle authentication errors
 */
async function handleAuthError(error: string, errorDescription?: string) {
  console.error('Authentication error:', error, errorDescription);
  
  // Clear any auth in progress flags
  localStorage.removeItem('auth_in_progress');
  localStorage.removeItem('auth_started_at');
  
  // Check if we have a session despite the error
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      console.log('Found active session despite auth error');
      toast.warning('Authentication had an issue, but you are signed in');
      await checkAndNavigateUser(data.session.user.id);
      return;
    }
  } catch (sessionError) {
    console.error('Error checking session after auth error:', sessionError);
  }
  
  // Show error message
  toast.error(errorDescription || error || 'Authentication failed. Please try again.');
  
  // Navigate to auth page
  navigateToAuth();
}

/**
 * Process the full auth URL
 */
async function processFullAuthUrl(url: string) {
  try {
    console.log('Processing full auth URL:', url);
    
    // First check if we already have a session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData?.session) {
      console.log('Found existing session, user is already signed in');
      await checkAndNavigateUser(sessionData.session.user.id);
      return;
    }
    
    // Try to extract parameters from the URL
    try {
      // Handle both standard URLs and custom scheme URLs
      let urlObj;
      
      if (url.startsWith('introgy://')) {
        // For custom scheme URLs, we need to handle them differently
        console.log('Processing custom scheme URL');
        
        // Extract the path and query parts
        const parts = url.substring('introgy://'.length).split('?');
        const path = parts[0];
        const query = parts.length > 1 ? parts[1] : '';
        
        // Create a temporary standard URL to parse the query parameters
        urlObj = new URL(`https://example.com/${path}?${query}`);
      } else {
        // For standard URLs
        urlObj = new URL(url);
      }
      
      // Check for various auth parameters
      const code = urlObj.searchParams.get('code');
      const accessToken = urlObj.searchParams.get('access_token');
      const refreshToken = urlObj.searchParams.get('refresh_token');
      const error = urlObj.searchParams.get('error');
      const errorDescription = urlObj.searchParams.get('error_description');
      
      // Handle error first
      if (error) {
        console.log('Found error in URL');
        await handleAuthError(error, errorDescription || '');
        return;
      }
      
      // Handle tokens if present
      if (accessToken && refreshToken) {
        console.log('Found tokens in URL');
        await handleAuthTokens(accessToken, refreshToken);
        return;
      }
      
      // Handle code if present
      if (code) {
        console.log('Found code in URL, exchanging for session');
        await handleAuthCode(code);
        return;
      }
      
      // If we get here, we couldn't find any auth parameters
      console.log('No auth parameters found in URL, checking session');
      await checkCurrentSession(true); // Force refresh
    } catch (urlError) {
      console.error('Error parsing URL:', urlError);
      // Fall back to checking session
      await checkCurrentSession(true); // Force refresh
    }
  } catch (error) {
    console.error('Error processing full auth URL:', error);
    toast.error('Failed to process authentication. Please try again.');
    
    // Try to check session as a last resort
    try {
      await checkCurrentSession(true);
    } catch (sessionError) {
      console.error('Error checking session after URL processing failure:', sessionError);
    }
  }
}

/**
 * Check the current session and navigate accordingly
 * @param forceRefresh - Whether to force a session refresh
 * @param options - Additional options for session checking
 */
async function checkCurrentSession(forceRefresh = false, options: { force?: boolean, silent?: boolean } = {}) {
  try {
    console.log('Checking current session, forceRefresh:', forceRefresh, 'options:', options);
    
    // Store the timestamp of when we checked the session
    const checkTimestamp = Date.now();
    localStorage.setItem('last_session_check', checkTimestamp.toString());
    
    // Check if we're in the middle of an auth flow
    const authInProgress = localStorage.getItem('auth_in_progress') === 'true';
    const authStartedAt = parseInt(localStorage.getItem('auth_started_at') || '0', 10);
    const authStartedMinutesAgo = (checkTimestamp - authStartedAt) / (1000 * 60);
    
    // If auth is in progress and started recently (within 5 minutes), and we're not forcing a check
    if (authInProgress && authStartedMinutesAgo < 5 && !options.force) {
      console.log(`Auth in progress (started ${authStartedMinutesAgo.toFixed(1)} minutes ago), skipping session check`);
      return;
    }
    
    // If auth has been in progress for too long, clear the flag
    if (authInProgress && authStartedMinutesAgo >= 5) {
      console.log('Auth in progress flag is stale, clearing it');
      localStorage.removeItem('auth_in_progress');
      localStorage.removeItem('auth_started_at');
    }
    
    let sessionData;
    let refreshError = null;
    
    // First, try to refresh the session if requested
    if (forceRefresh) {
      try {
        console.log('Forcing session refresh');
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.log('Session refresh error:', error.message);
          refreshError = error;
        } else {
          console.log('Session refreshed successfully');
          sessionData = data;
          
          // Log token details for debugging
          if (data?.session) {
            const accessToken = data.session.access_token;
            const refreshToken = data.session.refresh_token;
            console.log(`Refreshed tokens: access_token (${accessToken.length} chars), refresh_token (${refreshToken.length} chars)`);
            console.log('Session expires at:', new Date(data.session.expires_at * 1000).toISOString());
          }
        }
      } catch (refreshException) {
        console.error('Exception during session refresh:', refreshException);
      }
    }
    
    // If refresh failed or wasn't requested, get the current session
    if (!sessionData) {
      try {
        console.log('Getting current session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
        } else {
          sessionData = data;
          
          // Log token details for debugging
          if (data?.session) {
            const accessToken = data.session.access_token;
            const refreshToken = data.session.refresh_token;
            console.log(`Current tokens: access_token (${accessToken.length} chars), refresh_token (${refreshToken.length} chars)`);
            console.log('Session expires at:', new Date(data.session.expires_at * 1000).toISOString());
          }
        }
      } catch (getSessionException) {
        console.error('Exception getting session:', getSessionException);
      }
    }
    
    // Process the session data
    if (sessionData?.session) {
      console.log('User is signed in:', sessionData.session.user.id);
      
      // Store session info for debugging
      localStorage.setItem('last_session_user_id', sessionData.session.user.id);
      localStorage.setItem('last_session_expires_at', new Date(sessionData.session.expires_at * 1000).toISOString());
      
      // Only show toast if not silent mode
      if (!options.silent) {
        toast.success('Successfully signed in');
      }
      
      // Clear any auth in progress flags
      localStorage.removeItem('auth_in_progress');
      localStorage.removeItem('auth_started_at');
      
      // Navigate the user based on their account status
      await checkAndNavigateUser(sessionData.session.user.id);
      return true;
    } else {
      console.log('No active session found');
      
      // If we tried to refresh and it failed, the session is definitely invalid
      if (forceRefresh && refreshError) {
        console.log('Session refresh failed, session is invalid');
        localStorage.removeItem('auth_in_progress');
        localStorage.removeItem('auth_started_at');
        
        // Only show toast if not silent mode
        if (!options.silent) {
          toast.error('Session expired. Please sign in again.');
        }
        
        // Only navigate to auth if we're sure the session is invalid and we're not in the middle of signing in
        if (!authInProgress || authStartedMinutesAgo >= 5) {
          navigateToAuth();
        }
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
}

/**
 * Check if the user is new and navigate accordingly
 */
async function checkAndNavigateUser(userId?: string) {
  if (!userId) {
    navigateToAuth();
    return;
  }
  
  try {
    const { data: userResponse } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .maybeSingle();
    
    // Calculate time difference in minutes
    const createdTime = new Date(userResponse?.created_at || 0);
    const currentTime = new Date();
    const minutesDiff = (currentTime.getTime() - createdTime.getTime()) / (1000 * 60);
    
    // If account was created less than 5 minutes ago, consider it new
    if (userResponse && minutesDiff < 5) {
      sessionStorage.setItem("newSignup", "true");
      navigateToOnboarding();
    } else {
      navigateToProfile();
    }
  } catch (error) {
    console.error('Error checking profile:', error);
    navigateToProfile();
  }
}
