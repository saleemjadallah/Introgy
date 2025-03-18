// Deep links debug extension
// This file adds additional debugging capabilities to the deep-links.js file

// Function to test the complete authentication flow
function testAuthenticationFlow() {
  console.log('[Deep Links Debug] Starting comprehensive authentication flow test...');
  
  try {
    // Step 1: Clear any existing auth state
    console.log('[Auth Flow Test] Step 1: Clearing existing auth state...');
    localStorage.removeItem('auth_in_progress');
    localStorage.removeItem('auth_started_at');
    localStorage.removeItem('auth_callback_received');
    localStorage.removeItem('auth_callback_received_at');
    localStorage.removeItem('auth_callback_url');
    localStorage.removeItem('auth_callback_attempt_count');
    localStorage.removeItem('auth_elapsed_time_ms');
    localStorage.removeItem('last_auth_error');
    
    // Step 2: Set up test flags and timestamps
    console.log('[Auth Flow Test] Step 2: Setting up test flags...');
    localStorage.setItem('auth_flow_test_started', Date.now().toString());
    localStorage.setItem('auth_flow_test_stage', 'initialization');
    
    // Step 3: Simulate starting the auth process
    console.log('[Auth Flow Test] Step 3: Simulating auth process start...');
    localStorage.setItem('auth_in_progress', 'true');
    localStorage.setItem('auth_started_at', Date.now().toString());
    localStorage.setItem('auth_flow_test_stage', 'auth_started');
    
    // Step 4: Simulate receiving a callback URL
    console.log('[Auth Flow Test] Step 4: Simulating auth callback...');
    setTimeout(() => {
      // Create a mock callback URL based on platform
      const platform = window.Capacitor?.getPlatform() || 'web';
      let mockCallbackUrl;
      
      if (platform === 'ios' || platform === 'android') {
        mockCallbackUrl = 'introgy://auth/callback?code=mock_auth_code_123&state=mock_state_456';
      } else {
        mockCallbackUrl = 'https://introgy.ai/auth/callback?code=mock_auth_code_123&state=mock_state_456';
      }
      
      console.log(`[Auth Flow Test] Generated mock callback URL for ${platform}: ${mockCallbackUrl}`);
      localStorage.setItem('auth_flow_test_stage', 'callback_received');
      
      // Simulate processing the callback
      console.log('[Auth Flow Test] Processing mock callback...');
      window.postMessage({
        type: 'test_auth_callback',
        data: { url: mockCallbackUrl },
        source: 'deep-links-debug'
      }, '*');
      
      // Step 5: Check if the callback was processed correctly
      setTimeout(() => {
        console.log('[Auth Flow Test] Step 5: Verifying callback processing...');
        const callbackReceived = localStorage.getItem('auth_callback_received');
        const authInProgress = localStorage.getItem('auth_in_progress');
        
        if (callbackReceived === 'true' && !authInProgress) {
          console.log('[Auth Flow Test] Success: Auth callback was processed correctly');
          localStorage.setItem('auth_flow_test_stage', 'success');
          localStorage.setItem('auth_flow_test_result', 'passed');
        } else {
          console.log('[Auth Flow Test] Failure: Auth callback was not processed correctly');
          localStorage.setItem('auth_flow_test_stage', 'failure');
          localStorage.setItem('auth_flow_test_result', 'failed');
        }
        
        // Step 6: Final report
        console.log('[Auth Flow Test] Step 6: Generating test report...');
        const startTime = parseInt(localStorage.getItem('auth_flow_test_started') || '0');
        const elapsedTime = Date.now() - startTime;
        
        const report = {
          testStarted: new Date(startTime).toISOString(),
          testDuration: `${elapsedTime}ms`,
          testResult: localStorage.getItem('auth_flow_test_result'),
          callbackProcessed: callbackReceived === 'true',
          authFlagsCleared: !authInProgress,
          platform: platform
        };
        
        console.log('[Auth Flow Test] Test report:', report);
        localStorage.setItem('auth_flow_test_report', JSON.stringify(report));
        
        // Send the report to the main app
        window.postMessage({
          type: 'auth_flow_test_completed',
          data: report,
          source: 'deep-links-debug'
        }, '*');
      }, 2000); // Check after 2 seconds
    }, 1000); // Wait 1 second before simulating callback
    
    return 'Authentication flow test started. Check console for progress.';
  } catch (e) {
    console.error('[Auth Flow Test] Error during test:', e);
    return `Authentication flow test failed: ${e.message}`;
  }
}

// Set up message listener for communication from the debug panel
window.addEventListener('message', async (event) => {
  // Process messages from our app or from the debug module
  if (event.data && (event.data.source === 'deep-links' || event.data.source === 'deep-links-debug')) {
    console.log('Received message in deep-links-debug.js:', event.data.type);
    
    // Process based on message type
    if (event.data.type === 'test_auth_flow') {
      // Run the comprehensive auth flow test
      console.log('Starting comprehensive auth flow test');
      const result = testAuthenticationFlow();
      console.log('Auth flow test initiated:', result);
    }
    else if (event.data.type === 'test_auth_callback' && event.data.data && event.data.data.url) {
      // Handle test auth callback
      console.log('Processing test auth callback with URL:', event.data.data.url);
      
      // Call the handleAuthCallback function from deep-links.js
      if (typeof handleAuthCallback === 'function') {
        try {
          await handleAuthCallback(event.data.data.url);
          console.log('Test auth callback processed successfully');
        } catch (e) {
          console.error('Error processing test auth callback:', e);
        }
      } else {
        console.error('handleAuthCallback function not found');
      }
    }
    else if (event.data.type === 'test_google_signin') {
      // Handle Google Sign-In test
      console.log('Initiating Google Sign-In test');
      try {
        // Log the test attempt
        localStorage.setItem('google_signin_test_started', Date.now().toString());
        
        // Send message to main app to initiate Google Sign-In
        window.postMessage({
          type: 'initiate_google_signin',
          data: { test: true },
          source: 'deep-links'
        }, '*');
        
        console.log('Google Sign-In test message sent to main app');
      } catch (e) {
        console.error('Error initiating Google Sign-In test:', e);
        window.postMessage({
          type: 'auth_error',
          data: { message: 'Failed to initiate Google Sign-In test: ' + e.message },
          source: 'deep-links'
        }, '*');
      }
    }
  }
});

// Function to fix common redirect issues
function fixRedirectIssues() {
  console.log('[Deep Links Debug] Attempting to fix redirect issues...');
  
  try {
    // Check for stale flags and clear them
    const authInProgress = localStorage.getItem('auth_in_progress');
    const authStartedAt = localStorage.getItem('auth_started_at');
    
    if (authInProgress) {
      const startTime = parseInt(authStartedAt || '0', 10);
      const currentTime = Date.now();
      const minutesAgo = (currentTime - startTime) / (1000 * 60);
      
      if (minutesAgo > 5) {
        console.log('[Deep Links Debug] Clearing stale auth in progress flags');
        localStorage.removeItem('auth_in_progress');
        localStorage.removeItem('auth_started_at');
      }
    }
    
    // Check for deep links initialization flag
    if (localStorage.getItem('deep_links_initializing') === 'true') {
      console.log('[Deep Links Debug] Clearing stuck deep_links_initializing flag');
      localStorage.removeItem('deep_links_initializing');
    }
    
    // Force a session check
    console.log('[Deep Links Debug] Forcing session check');
    window.postMessage({
      type: 'check_session',
      data: { force: true },
      source: 'deep-links'
    }, '*');
    
    // Check for stored callback URL and process it if it exists
    const storedCallbackUrl = localStorage.getItem('auth_callback_url');
    if (storedCallbackUrl) {
      console.log('[Deep Links Debug] Found stored callback URL, processing it');
      window.postMessage({
        type: 'auth_full_url',
        data: { url: storedCallbackUrl },
        source: 'deep-links'
      }, '*');
    }
    
    console.log('[Deep Links Debug] Redirect fix attempt completed');
  } catch (e) {
    console.error('[Deep Links Debug] Error fixing redirect issues:', e);
  }
}

// Add additional logging for auth events
const originalPostMessage = window.postMessage;
window.postMessage = function(message, targetOrigin, transfer) {
  // Log auth-related messages
  if (message && message.source === 'deep-links') {
    if (message.type && (
      message.type.includes('auth') || 
      message.type.includes('session') || 
      message.type === 'initiate_google_signin'
    )) {
      console.log(`[Deep Links Debug] Sending message: ${message.type}`);
      
      // Create a safe copy for logging
      const safeCopy = { ...message };
      
      // Add a timestamp for the message
      localStorage.setItem(`last_${message.type}_message_time`, Date.now().toString());
      if (safeCopy.data) {
        if (safeCopy.data.accessToken) {
          safeCopy.data.accessToken = `[${safeCopy.data.accessToken.length} chars]`;
        }
        if (safeCopy.data.refreshToken) {
          safeCopy.data.refreshToken = `[${safeCopy.data.refreshToken.length} chars]`;
        }
        if (safeCopy.data.code) {
          safeCopy.data.code = `[${safeCopy.data.code.length} chars]`;
        }
        if (safeCopy.data.url && (safeCopy.data.url.includes('token') || safeCopy.data.url.includes('code'))) {
          safeCopy.data.url = safeCopy.data.url.replace(/access_token=[^&]+/g, 'access_token=[REDACTED]')
            .replace(/refresh_token=[^&]+/g, 'refresh_token=[REDACTED]')
            .replace(/code=[^&]+/g, 'code=[REDACTED]');
        }
      }
      
      console.log('[Deep Links Debug] Message data:', safeCopy);
    }
  }
  
  // Call the original function
  return originalPostMessage.apply(this, arguments);
};

console.log('Deep links debug extension loaded');
