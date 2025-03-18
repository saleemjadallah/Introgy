// Auth debugging script for Introgy app
// This script helps debug authentication issues by providing detailed logging

// Global variable to store logs
window.authDebugLogs = [];

// Initialize immediately and also wait for document to be ready
initAuthDebug();

// Main initialization function
function initAuthDebug() {
  console.log('Auth debug script initializing');
  
  // Check if we've already initialized to avoid duplicate listeners
  if (window.authDebugInitialized) {
    console.log('Auth debug already initialized');
    return;
  }
  window.authDebugInitialized = true;
  
  // Try to load logs from localStorage
  try {
    const storedLogsJson = localStorage.getItem('auth_debug_logs');
    if (storedLogsJson) {
      const storedLogs = JSON.parse(storedLogsJson);
      if (Array.isArray(storedLogs) && storedLogs.length > 0) {
        // Only keep the last 100 logs to avoid memory issues
        window.authDebugLogs = storedLogs.slice(-100);
        console.log(`Loaded ${window.authDebugLogs.length} logs from localStorage`);
      }
    }
  } catch (e) {
    console.warn('Failed to load auth debug logs from localStorage', e);
  }
  
  // Track Google Sign-In flow
  window.googleAuthInProgress = false;
  window.googleAuthStartTime = null;
  
  // Initialize auth debug listeners immediately
  initAuthDebugListeners();
  
  // Create debug panel when document is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createDebugPanel();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Auth debug DOM ready');
      createDebugPanel();
    });
  }
  
  // Also listen for deviceready event for Capacitor
  document.addEventListener('deviceready', function() {
    console.log('Auth debug deviceready');
    // Refresh the debug panel if it exists
    updateDebugPanel();
    
    // Check for auth parameters in URL on deviceready
    const currentUrl = window.location.href;
    if (currentUrl.includes('auth/callback') || currentUrl.includes('access_token=') || currentUrl.includes('code=')) {
      logDebugMessage('Auth parameters detected in URL on deviceready', 'info');
      
      // Store the callback URL for debugging
      localStorage.setItem('auth_callback_url', currentUrl);
      localStorage.setItem('auth_callback_received_at', Date.now().toString());
      
      // Process after a short delay
      setTimeout(() => {
        window.postMessage({
          source: 'deep-links',
          type: 'auth_full_url',
          data: { url: currentUrl }
        }, '*');
      }, 500);
    }
  });
  
  // Listen for visibility changes (app coming to foreground)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      logDebugMessage('App returned to foreground', 'info');
      
      // Check if we were in the middle of Google auth
      const authInProgress = localStorage.getItem('auth_in_progress');
      const authStartedAt = localStorage.getItem('auth_started_at');
      
      if (authInProgress === 'google' && authStartedAt) {
        const startTime = parseInt(authStartedAt, 10);
        const currentTime = Date.now();
        const secondsPassed = (currentTime - startTime) / 1000;
        
        logDebugMessage(`Google auth in progress (started ${secondsPassed.toFixed(1)} seconds ago)`, 'warning');
        
        // If it's been less than 5 minutes, check for session
        if (secondsPassed < 300) {
          logDebugMessage('Checking for session after returning from Google auth', 'info');
          
          // Force a session check
          setTimeout(() => {
            window.postMessage({
              source: 'deep-links',
              type: 'check_session',
              data: { force: true }
            }, '*');
          }, 1000);
        }
      }
    }
  });
}

// Create a debug panel that can be shown/hidden
function createDebugPanel() {
  // Check if panel already exists
  if (document.getElementById('auth-debug-button')) {
    console.log('Debug panel already exists');
    return;
  }
  
  // Create debug button
  const debugButton = document.createElement('button');
  debugButton.id = 'auth-debug-button';
  debugButton.textContent = 'Auth Debug';
  debugButton.style.position = 'fixed';
  debugButton.style.bottom = '10px';
  debugButton.style.right = '10px';
  debugButton.style.zIndex = '9999';
  debugButton.style.padding = '8px 12px';
  debugButton.style.backgroundColor = '#333';
  debugButton.style.color = 'white';
  debugButton.style.border = 'none';
  debugButton.style.borderRadius = '4px';
  debugButton.style.opacity = '0.7';
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'auth-debug-panel';
  debugPanel.style.position = 'fixed';
  debugPanel.style.bottom = '50px';
  debugPanel.style.right = '10px';
  debugPanel.style.width = '300px';
  debugPanel.style.height = '400px';
  debugPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  debugPanel.style.color = 'white';
  debugPanel.style.padding = '10px';
  debugPanel.style.borderRadius = '4px';
  debugPanel.style.overflow = 'auto';
  debugPanel.style.display = 'none';
  debugPanel.style.zIndex = '9998';
  debugPanel.style.fontFamily = 'monospace';
  debugPanel.style.fontSize = '12px';
  
  // Add title
  const title = document.createElement('h3');
  title.textContent = 'Auth Debug Info';
  title.style.margin = '0 0 10px 0';
  debugPanel.appendChild(title);
  
  // Add log container
  const logContainer = document.createElement('div');
  logContainer.id = 'auth-debug-log';
  debugPanel.appendChild(logContainer);
  
  // Add button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.flexWrap = 'wrap';
  buttonContainer.style.gap = '5px';
  buttonContainer.style.marginTop = '10px';
  debugPanel.appendChild(buttonContainer);
  
  // Add session info button
  const sessionButton = document.createElement('button');
  sessionButton.textContent = 'Check Session';
  sessionButton.style.padding = '5px';
  sessionButton.style.backgroundColor = '#555';
  sessionButton.style.color = 'white';
  sessionButton.style.border = 'none';
  sessionButton.style.borderRadius = '4px';
  
  sessionButton.addEventListener('click', async () => {
    try {
      // This assumes supabase is globally available
      if (window.supabase) {
        const { data, error } = await window.supabase.auth.getSession();
        if (error) {
          logDebugMessage('Session error: ' + error.message);
        } else if (data?.session) {
          logDebugMessage('Active session found:');
          logDebugMessage('User ID: ' + data.session.user.id);
          logDebugMessage('Email: ' + (data.session.user.email || 'none'));
          logDebugMessage('Expires: ' + new Date(data.session.expires_at * 1000).toLocaleString());
          
          // Display token info
          const tokenLength = data.session.access_token?.length || 0;
          logDebugMessage(`Access token: ${tokenLength} chars`);
          
          // Check token expiry
          const now = Math.floor(Date.now() / 1000);
          const expiresAt = data.session.expires_at;
          const minutesLeft = Math.floor((expiresAt - now) / 60);
          logDebugMessage(`Token expires in: ${minutesLeft} minutes`);
        } else {
          logDebugMessage('No active session found');
        }
      } else {
        logDebugMessage('Supabase not available');
      }
    } catch (e) {
      logDebugMessage('Error checking session: ' + e.message);
    }
  });
  
  buttonContainer.appendChild(sessionButton);
  
  // Add refresh session button
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Refresh Session';
  refreshButton.style.padding = '5px';
  refreshButton.style.backgroundColor = '#555';
  refreshButton.style.color = 'white';
  refreshButton.style.border = 'none';
  refreshButton.style.borderRadius = '4px';
  
  refreshButton.addEventListener('click', async () => {
    try {
      // This assumes supabase is globally available
      if (window.supabase) {
        const { data, error } = await window.supabase.auth.refreshSession();
        if (error) {
          logDebugMessage('Refresh error: ' + error.message);
        } else if (data?.session) {
          logDebugMessage('Session refreshed:');
          logDebugMessage('User ID: ' + data.session.user.id);
          logDebugMessage('Expires: ' + new Date(data.session.expires_at * 1000).toLocaleString());
        } else {
          logDebugMessage('No session after refresh');
        }
      } else {
        logDebugMessage('Supabase not available');
      }
    } catch (e) {
      logDebugMessage('Error refreshing session: ' + e.message);
    }
  });
  
  buttonContainer.appendChild(refreshButton);
  
  // Add clear storage button
  const clearStorageButton = document.createElement('button');
  clearStorageButton.textContent = 'Clear Auth Storage';
  clearStorageButton.style.padding = '5px';
  clearStorageButton.style.backgroundColor = '#a33';
  clearStorageButton.style.color = 'white';
  clearStorageButton.style.border = 'none';
  clearStorageButton.style.borderRadius = '4px';
  
  clearStorageButton.addEventListener('click', () => {
    try {
      // Clear auth-related localStorage items
      const authKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('auth') || key.includes('supabase'))) {
          authKeys.push(key);
        }
      }
      
      logDebugMessage(`Clearing ${authKeys.length} auth-related items:`);
      authKeys.forEach(key => {
        logDebugMessage(`- ${key}`);
        localStorage.removeItem(key);
      });
      
      logDebugMessage('Auth storage cleared');
    } catch (e) {
      logDebugMessage('Error clearing storage: ' + e.message);
    }
  });
  
  buttonContainer.appendChild(clearStorageButton);
  
  // Add test deep link button
  const testDeepLinkButton = document.createElement('button');
  testDeepLinkButton.textContent = 'Test Deep Link';
  testDeepLinkButton.style.padding = '5px';
  testDeepLinkButton.style.backgroundColor = '#555';
  testDeepLinkButton.style.color = 'white';
  testDeepLinkButton.style.border = 'none';
  testDeepLinkButton.style.borderRadius = '4px';
  
  testDeepLinkButton.addEventListener('click', () => {
    try {
      // Create a test deep link message
      logDebugMessage('Sending test deep link message');
      window.postMessage({
        source: 'deep-links',
        type: 'check_session',
        data: {}
      }, '*');
    } catch (e) {
      logDebugMessage('Error sending test message: ' + e.message);
    }
  });
  
  buttonContainer.appendChild(testDeepLinkButton);
  
  // Add force refresh button
  const forceRefreshButton = document.createElement('button');
  forceRefreshButton.textContent = 'Force Session Check';
  forceRefreshButton.style.padding = '5px';
  forceRefreshButton.style.backgroundColor = '#555';
  forceRefreshButton.style.color = 'white';
  forceRefreshButton.style.border = 'none';
  forceRefreshButton.style.borderRadius = '4px';
  
  forceRefreshButton.addEventListener('click', () => {
    try {
      logDebugMessage('Forcing session check with refresh');
      window.postMessage({
        source: 'deep-links',
        type: 'check_session',
        data: { force: true }
      }, '*');
    } catch (e) {
      logDebugMessage('Error forcing session check: ' + e.message);
    }
  });
  
  buttonContainer.appendChild(forceRefreshButton);
  
  // Add URL parameters button
  const urlParamsButton = document.createElement('button');
  urlParamsButton.textContent = 'Check URL Params';
  urlParamsButton.style.padding = '5px';
  urlParamsButton.style.backgroundColor = '#555';
  urlParamsButton.style.color = 'white';
  urlParamsButton.style.border = 'none';
  urlParamsButton.style.borderRadius = '4px';
  
  urlParamsButton.addEventListener('click', () => {
    try {
      const url = window.location.href;
      logDebugMessage('Current URL: ' + url);
      
      // Check for hash parameters
      if (url.includes('#')) {
        const hashPart = url.split('#')[1];
        const hashParams = new URLSearchParams(hashPart);
        logDebugMessage('Hash parameters:');
        hashParams.forEach((value, key) => {
          const displayValue = key.includes('token') ? `[${value.length} chars]` : value;
          logDebugMessage(`- ${key}: ${displayValue}`);
        });
      } else {
        logDebugMessage('No hash parameters');
      }
      
      // Check for query parameters
      if (url.includes('?')) {
        const queryPart = url.split('?')[1]?.split('#')[0];
        if (queryPart) {
          const queryParams = new URLSearchParams(queryPart);
          logDebugMessage('Query parameters:');
          queryParams.forEach((value, key) => {
            const displayValue = key.includes('token') || key === 'code' ? `[${value.length} chars]` : value;
            logDebugMessage(`- ${key}: ${displayValue}`);
          });
        }
      } else {
        logDebugMessage('No query parameters');
      }
      
      // Check for auth-related parameters
      if (url.includes('auth/callback') || url.includes('access_token=') || url.includes('code=')) {
        logDebugMessage('Auth parameters detected in URL');
        
        // Process the URL as if it were a deep link
        window.postMessage({
          source: 'deep-links',
          type: 'auth_full_url',
          data: { url }
        }, '*');
      }
    } catch (e) {
      logDebugMessage('Error checking URL parameters: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(urlParamsButton);
  
  // Add Google Sign-In test button
  const googleSignInButton = document.createElement('button');
  googleSignInButton.textContent = 'Test Google Sign-In';
  googleSignInButton.style.padding = '5px';
  googleSignInButton.style.backgroundColor = '#4285F4'; // Google blue
  googleSignInButton.style.color = 'white';
  googleSignInButton.style.border = 'none';
  googleSignInButton.style.borderRadius = '4px';
  
  googleSignInButton.addEventListener('click', () => {
    try {
      logDebugMessage('Initiating Google Sign-In test', 'info');
      
      // Set auth in progress flags
      localStorage.setItem('auth_in_progress', 'google');
      localStorage.setItem('auth_started_at', Date.now().toString());
      
      // Track in window variables too
      window.googleAuthInProgress = true;
      window.googleAuthStartTime = Date.now();
      
      // Send message to initiate Google Sign-In
      window.postMessage({
        source: 'deep-links',
        type: 'test_google_signin',
        data: {}
      }, '*');
      
      logDebugMessage('Google Sign-In test message sent', 'info');
    } catch (e) {
      logDebugMessage('Error initiating Google Sign-In test: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(googleSignInButton);
  
  // Add session monitor button
  const monitorButton = document.createElement('button');
  monitorButton.textContent = 'Monitor Session';
  monitorButton.style.padding = '5px';
  monitorButton.style.backgroundColor = '#555';
  monitorButton.style.color = 'white';
  monitorButton.style.border = 'none';
  monitorButton.style.borderRadius = '4px';
  
  let sessionMonitorInterval = null;
  
  monitorButton.addEventListener('click', () => {
    try {
      if (sessionMonitorInterval) {
        // Stop monitoring
        clearInterval(sessionMonitorInterval);
        sessionMonitorInterval = null;
        monitorButton.textContent = 'Monitor Session';
        logDebugMessage('Session monitoring stopped', 'info');
      } else {
        // Start monitoring
        logDebugMessage('Starting session monitoring (every 10 seconds)', 'info');
        monitorButton.textContent = 'Stop Monitoring';
        
        // Check immediately
        checkSessionStatus();
        
        // Then check every 10 seconds
        sessionMonitorInterval = setInterval(checkSessionStatus, 10000);
      }
    } catch (e) {
      logDebugMessage('Error toggling session monitoring: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(monitorButton);
  
  // Function to check session status
  function checkSessionStatus() {
    if (window.supabase) {
      window.supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          logDebugMessage('Session check error: ' + error.message, 'error');
        } else if (data?.session) {
          const now = Math.floor(Date.now() / 1000);
          const expiresAt = data.session.expires_at;
          const minutesLeft = Math.floor((expiresAt - now) / 60);
          
          if (minutesLeft < 5) {
            logDebugMessage(`Session expires soon: ${minutesLeft} minutes left`, 'warning');
          } else {
            logDebugMessage(`Session active: expires in ${minutesLeft} minutes`, 'success');
          }
        } else {
          logDebugMessage('No active session found', 'warning');
        }
      });
    } else {
      logDebugMessage('Supabase not available for session check', 'error');
    }
  }
  
  // Toggle debug panel on button click
  debugButton.addEventListener('click', () => {
    if (debugPanel.style.display === 'none') {
      debugPanel.style.display = 'block';
      updateDebugPanel(); // Refresh logs when opening
    } else {
      debugPanel.style.display = 'none';
    }
  });
  
  // Add export logs button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Logs';
  exportButton.style.padding = '5px';
  exportButton.style.backgroundColor = '#555';
  exportButton.style.color = 'white';
  exportButton.style.border = 'none';
  exportButton.style.borderRadius = '4px';
  
  exportButton.addEventListener('click', () => {
    try {
      exportAuthDebugLogs();
    } catch (e) {
      logDebugMessage('Error exporting logs: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(exportButton);
  
  // Add token debug button
  const tokenDebugButton = document.createElement('button');
  tokenDebugButton.textContent = 'Debug Tokens';
  tokenDebugButton.style.padding = '5px';
  tokenDebugButton.style.backgroundColor = '#555';
  tokenDebugButton.style.color = 'white';
  tokenDebugButton.style.border = 'none';
  tokenDebugButton.style.borderRadius = '4px';
  
  tokenDebugButton.addEventListener('click', () => {
    try {
      debugTokens();
    } catch (e) {
      logDebugMessage('Error debugging tokens: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(tokenDebugButton);
  
  // Add redirect analysis button
  const redirectAnalysisButton = document.createElement('button');
  redirectAnalysisButton.textContent = 'Analyze Redirect Issues';
  redirectAnalysisButton.style.padding = '5px';
  redirectAnalysisButton.style.backgroundColor = '#555';
  redirectAnalysisButton.style.color = 'white';
  redirectAnalysisButton.style.border = 'none';
  redirectAnalysisButton.style.borderRadius = '4px';
  
  redirectAnalysisButton.addEventListener('click', () => {
    try {
      analyzeRedirectIssues();
    } catch (e) {
      logDebugMessage('Error analyzing redirect issues: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(redirectAnalysisButton);
  
  // Add fix redirect issues button
  const fixRedirectButton = document.createElement('button');
  fixRedirectButton.textContent = 'Fix Redirect Issues';
  fixRedirectButton.style.padding = '5px';
  fixRedirectButton.style.backgroundColor = '#d35400';
  fixRedirectButton.style.color = 'white';
  fixRedirectButton.style.border = 'none';
  fixRedirectButton.style.borderRadius = '4px';
  
  fixRedirectButton.addEventListener('click', () => {
    try {
      logDebugMessage('Attempting to fix redirect issues...', 'info');
      
      // Call the fixRedirectIssues function from deep-links-debug.js
      if (typeof fixRedirectIssues === 'function') {
        fixRedirectIssues();
        logDebugMessage('Fix redirect issues function called successfully', 'success');
      } else {
        // If the function doesn't exist, do the fixes here
        logDebugMessage('Fix function not found, performing fixes directly', 'warning');
        
        // Clear stale flags
        const authInProgress = localStorage.getItem('auth_in_progress');
        const authStartedAt = localStorage.getItem('auth_started_at');
        
        if (authInProgress) {
          const startTime = parseInt(authStartedAt || '0', 10);
          const currentTime = Date.now();
          const minutesAgo = (currentTime - startTime) / (1000 * 60);
          
          if (minutesAgo > 5) {
            logDebugMessage('Clearing stale auth in progress flags', 'info');
            localStorage.removeItem('auth_in_progress');
            localStorage.removeItem('auth_started_at');
          }
        }
        
        // Check for deep links initialization flag
        if (localStorage.getItem('deep_links_initializing') === 'true') {
          logDebugMessage('Clearing stuck deep_links_initializing flag', 'info');
          localStorage.removeItem('deep_links_initializing');
        }
        
        // Force a session check via message
        logDebugMessage('Forcing session check', 'info');
        window.postMessage({
          type: 'check_session',
          data: { force: true },
          source: 'deep-links'
        }, '*');
        
        // Process any stored callback URL
        const storedCallbackUrl = localStorage.getItem('auth_callback_url');
        if (storedCallbackUrl) {
          logDebugMessage('Processing stored callback URL', 'info');
          logDebugMessage(storedCallbackUrl, 'info');
          
          window.postMessage({
            type: 'auth_full_url',
            data: { url: storedCallbackUrl },
            source: 'deep-links'
          }, '*');
        }
      }
      
      logDebugMessage('Redirect fix attempt completed', 'success');
    } catch (e) {
      logDebugMessage('Error fixing redirect issues: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(fixRedirectButton);
  
  // Update the existing test deep link button to use the new function
  testDeepLinkButton.removeEventListener('click', testDeepLinkButton.clickHandler);
  testDeepLinkButton.clickHandler = () => {
    try {
      testDeepLinkHandling();
    } catch (e) {
      logDebugMessage('Error testing deep link handling: ' + e.message, 'error');
    }
  };
  testDeepLinkButton.addEventListener('click', testDeepLinkButton.clickHandler);
  testDeepLinkButton.style.backgroundColor = '#2980b9';
  
  // Add check Supabase redirect URLs button
  const checkRedirectUrlsButton = document.createElement('button');
  checkRedirectUrlsButton.textContent = 'Check Redirect URLs';
  checkRedirectUrlsButton.style.padding = '5px';
  checkRedirectUrlsButton.style.backgroundColor = '#8e44ad';
  checkRedirectUrlsButton.style.color = 'white';
  checkRedirectUrlsButton.style.border = 'none';
  checkRedirectUrlsButton.style.borderRadius = '4px';
  
  checkRedirectUrlsButton.addEventListener('click', () => {
    try {
      checkSupabaseRedirectUrls();
    } catch (e) {
      logDebugMessage('Error checking redirect URLs: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(checkRedirectUrlsButton);
  
  // Add check deep linking config button
  const checkDeepLinkingButton = document.createElement('button');
  checkDeepLinkingButton.textContent = 'Check Deep Linking';
  checkDeepLinkingButton.style.padding = '5px';
  checkDeepLinkingButton.style.backgroundColor = '#27ae60';
  checkDeepLinkingButton.style.color = 'white';
  checkDeepLinkingButton.style.border = 'none';
  checkDeepLinkingButton.style.borderRadius = '4px';
  
  checkDeepLinkingButton.addEventListener('click', () => {
    try {
      checkDeepLinkingConfig();
    } catch (e) {
      logDebugMessage('Error checking deep linking configuration: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(checkDeepLinkingButton);
  
  // Add test auth flow button
  const testAuthFlowButton = document.createElement('button');
  testAuthFlowButton.textContent = 'Test Auth Flow';
  testAuthFlowButton.style.padding = '5px';
  testAuthFlowButton.style.backgroundColor = '#e74c3c';
  testAuthFlowButton.style.color = 'white';
  testAuthFlowButton.style.border = 'none';
  testAuthFlowButton.style.borderRadius = '4px';
  
  testAuthFlowButton.addEventListener('click', () => {
    try {
      logDebugMessage('Starting comprehensive authentication flow test...', 'info');
      
      // Send message to trigger the test
      window.postMessage({
        type: 'test_auth_flow',
        source: 'deep-links'
      }, '*');
      
      // Set up a listener for the test completion
      const listener = (event) => {
        if (event.data && event.data.type === 'auth_flow_test_completed' && event.data.source === 'deep-links-debug') {
          logDebugMessage('Authentication flow test completed', 'success');
          logDebugMessage('Test results:', 'info');
          
          const report = event.data.data;
          for (const [key, value] of Object.entries(report)) {
            logDebugMessage(`${key}: ${value}`, 'info');
          }
          
          // Remove the listener after receiving the report
          window.removeEventListener('message', listener);
        }
      };
      
      window.addEventListener('message', listener);
    } catch (e) {
      logDebugMessage('Error starting auth flow test: ' + e.message, 'error');
    }
  });
  
  buttonContainer.appendChild(testAuthFlowButton);
  
  // Add elements to document
  document.body.appendChild(debugButton);
  document.body.appendChild(debugPanel);
  
  // Display any logs that were captured before the panel was created
  updateDebugPanel();
}

// Update the debug panel with the latest logs
function updateDebugPanel() {
  const logContainer = document.getElementById('auth-debug-log');
  if (!logContainer) return;
  
  // Clear existing logs
  logContainer.innerHTML = '';
  
  // Add all logs from the global array
  window.authDebugLogs.forEach(log => {
    const logEntry = document.createElement('div');
    
    // Style based on log level
    const levelColors = {
      info: '#3498db',
      error: '#e74c3c',
      warning: '#f39c12',
      success: '#2ecc71'
    };
    
    // Add icon based on log level
    let icon = '🔵'; // blue circle
    if (log.level === 'error') icon = '🔴'; // red circle
    if (log.level === 'warning') icon = '🟠'; // orange circle
    if (log.level === 'success') icon = '🟢'; // green circle
    
    // Create log entry with icon and colored border
    logEntry.innerHTML = `<span style="color: ${levelColors[log.level || 'info']}">${icon}</span> <span style="color: #888;">[${log.time}]</span> ${log.message}`;
    logEntry.style.borderBottom = '1px solid #444';
    logEntry.style.paddingBottom = '5px';
    logEntry.style.marginBottom = '5px';
    logEntry.style.borderLeft = `3px solid ${levelColors[log.level || 'info']}`;
    logEntry.style.paddingLeft = '5px';
    
    // Add to the top
    if (logContainer.firstChild) {
      logContainer.insertBefore(logEntry, logContainer.firstChild);
    } else {
      logContainer.appendChild(logEntry);
    }
  });
}

// Function to check platform-specific deep linking configuration
function checkDeepLinkingConfig() {
  try {
    logDebugMessage('Checking platform-specific deep linking configuration...', 'info');
    
    // Get the platform
    const platform = window.Capacitor?.getPlatform() || 'web';
    logDebugMessage(`Current platform: ${platform}`, 'info');
    
    if (platform === 'ios') {
      logDebugMessage('iOS Deep Linking Requirements:', 'info');
      logDebugMessage('1. Associated Domains must be configured in your app', 'info');
      logDebugMessage('2. apple-app-site-association file must be properly set up on your domain', 'info');
      logDebugMessage('3. URL scheme "introgy://" must be registered in Info.plist', 'info');
      logDebugMessage('4. CFBundleURLSchemes must include "introgy"', 'info');
      
      logDebugMessage('\nTo verify iOS configuration:', 'info');
      logDebugMessage('- Check Info.plist for URL scheme registration', 'info');
      logDebugMessage('- Verify apple-app-site-association file at https://introgy.ai/.well-known/apple-app-site-association', 'info');
      logDebugMessage('- Ensure Associated Domains entitlement is enabled in Xcode', 'info');
    } else if (platform === 'android') {
      logDebugMessage('Android Deep Linking Requirements:', 'info');
      logDebugMessage('1. Intent filters must be properly configured in AndroidManifest.xml', 'info');
      logDebugMessage('2. URL scheme "introgy://" must be registered', 'info');
      logDebugMessage('3. Digital Asset Links file must be set up for App Links', 'info');
      
      logDebugMessage('\nTo verify Android configuration:', 'info');
      logDebugMessage('- Check AndroidManifest.xml for intent filters', 'info');
      logDebugMessage('- Verify Digital Asset Links file at https://introgy.ai/.well-known/assetlinks.json', 'info');
    } else if (platform === 'web') {
      logDebugMessage('Web Platform:', 'info');
      logDebugMessage('- Deep linking is handled through regular URLs', 'info');
      logDebugMessage('- No special configuration needed beyond proper Supabase redirect URLs', 'info');
    }
    
    // Check for common issues based on platform
    if (platform === 'ios' || platform === 'android') {
      // Check if we've ever received a deep link
      const lastAppUrlOpen = localStorage.getItem('last_app_url_open');
      const lastLaunchUrl = localStorage.getItem('last_launch_url');
      
      if (!lastAppUrlOpen && !lastLaunchUrl) {
        logDebugMessage('\nPotential Issue: No record of app being opened with a URL', 'warning');
        logDebugMessage('This suggests deep linking may not be working properly', 'warning');
      }
      
      // Check for auth callback handling
      const authCallbackReceived = localStorage.getItem('auth_callback_received');
      const authCallbackReceivedVia = localStorage.getItem('auth_callback_received_via');
      
      if (authCallbackReceived === 'true') {
        logDebugMessage(`\nAuth callback was received via: ${authCallbackReceivedVia || 'unknown'}`, 'success');
      } else {
        logDebugMessage('\nNo record of auth callback being received', 'warning');
      }
    }
    
    logDebugMessage('Deep linking configuration check completed', 'success');
  } catch (e) {
    logDebugMessage('Error checking deep linking configuration: ' + e.message, 'error');
  }
}

// Function to check Supabase redirect URLs
function checkSupabaseRedirectUrls() {
  try {
    logDebugMessage('Checking Supabase redirect URL configuration...', 'info');
    
    // Get the platform
    const platform = window.Capacitor?.getPlatform() || 'web';
    logDebugMessage(`Current platform: ${platform}`, 'info');
    
    // Define the expected redirect URLs based on platform
    let expectedRedirectUrls = [];
    
    if (platform === 'ios' || platform === 'android') {
      expectedRedirectUrls = [
        'introgy://auth/callback',
        'https://introgy.ai/auth/callback'
      ];
      logDebugMessage('For mobile platforms, both custom scheme and web URLs should be configured', 'info');
    } else {
      expectedRedirectUrls = [
        'https://introgy.ai/auth/callback'
      ];
      logDebugMessage('For web platform, only web URL needs to be configured', 'info');
    }
    
    // Display the expected redirect URLs
    logDebugMessage('Expected redirect URLs in Supabase settings:', 'info');
    expectedRedirectUrls.forEach(url => {
      logDebugMessage(`- ${url}`, 'info');
    });
    
    // Provide instructions for checking
    logDebugMessage('To verify Supabase settings:', 'info');
    logDebugMessage('1. Log in to the Supabase Dashboard: https://app.supabase.com', 'info');
    logDebugMessage('2. Select your project: "Introgy"', 'info');
    logDebugMessage('3. Go to "Authentication" in the left sidebar', 'info');
    logDebugMessage('4. Click on "URL Configuration"', 'info');
    logDebugMessage('5. Check that the Site URL is set to: https://introgy.ai', 'info');
    logDebugMessage('6. Verify that all expected redirect URLs are listed', 'info');
    
    // Google OAuth specific checks
    logDebugMessage('\nFor Google OAuth Provider:', 'info');
    logDebugMessage('1. In Supabase, go to "Authentication" > "Providers" > "Google"', 'info');
    logDebugMessage('2. Ensure Google is enabled', 'info');
    logDebugMessage('3. Verify that your Google OAuth credentials are correctly configured', 'info');
    logDebugMessage('4. In your Google Cloud Console, verify these redirect URIs:', 'info');
    logDebugMessage('   - https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback', 'info');
    logDebugMessage('   - https://introgy.ai/auth/callback', 'info');
    
    // Attempt to detect any issues
    const lastAuthError = localStorage.getItem('last_auth_error');
    if (lastAuthError) {
      try {
        const errorData = JSON.parse(lastAuthError);
        if (errorData.error === 'redirect_uri_mismatch' || errorData.error.includes('redirect')) {
          logDebugMessage('\nDetected a redirect URI mismatch error!', 'error');
          logDebugMessage('This indicates that the redirect URLs in Supabase or Google OAuth settings are not configured correctly.', 'error');
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    logDebugMessage('Redirect URL configuration check completed', 'success');
  } catch (e) {
    logDebugMessage('Error checking redirect URLs: ' + e.message, 'error');
  }
}

// Function to test deep link handling with a mock URL
function testDeepLinkHandling() {
  try {
    logDebugMessage('Testing deep link handling with mock URL...', 'info');
    
    // Create a mock auth callback URL
    const mockUrl = 'introgy://auth/callback?code=mock_auth_code_' + Date.now();
    
    logDebugMessage('Using mock URL: ' + mockUrl, 'info');
    
    // Store the URL as if it was received via deep linking
    localStorage.setItem('auth_callback_url', mockUrl);
    localStorage.setItem('auth_callback_received_at', Date.now().toString());
    localStorage.setItem('auth_callback_received', 'true');
    
    // Set auth in progress flags
    localStorage.setItem('auth_in_progress', 'true');
    localStorage.setItem('auth_started_at', Date.now().toString());
    
    // Send the URL to the deep link handler
    window.postMessage({
      type: 'auth_full_url',
      data: { url: mockUrl, test: true },
      source: 'deep-links'
    }, '*');
    
    logDebugMessage('Mock deep link sent for processing', 'success');
    
    // Set a timer to check the results
    setTimeout(() => {
      const codeProcessed = localStorage.getItem('auth_code_processed');
      const authInProgress = localStorage.getItem('auth_in_progress');
      
      if (codeProcessed === 'true') {
        logDebugMessage('Mock auth code was processed successfully', 'success');
      } else {
        logDebugMessage('Mock auth code was not processed', 'warning');
      }
      
      if (authInProgress === 'true') {
        logDebugMessage('Auth in progress flag is still set (potential issue)', 'warning');
      } else {
        logDebugMessage('Auth in progress flag was cleared (good)', 'success');
      }
      
      // Check if any message was sent to check the session
      const lastSessionCheckTime = localStorage.getItem('last_check_session_message_time');
      if (lastSessionCheckTime) {
        const checkTime = parseInt(lastSessionCheckTime, 10);
        const secondsAgo = (Date.now() - checkTime) / 1000;
        
        if (secondsAgo < 10) {
          logDebugMessage(`Session check was triggered ${secondsAgo.toFixed(1)} seconds ago (good)`, 'success');
        } else {
          logDebugMessage('Session check was not triggered recently (potential issue)', 'warning');
        }
      } else {
        logDebugMessage('No record of session check being triggered (potential issue)', 'warning');
      }
    }, 2000);
  } catch (e) {
    logDebugMessage('Error testing deep link handling: ' + e.message, 'error');
  }
}

// Function to analyze redirect issues
function analyzeRedirectIssues() {
  try {
    logDebugMessage('Analyzing redirect issues...', 'info');
    
    // Check for stored callback URL
    const callbackUrl = localStorage.getItem('auth_callback_url');
    const callbackReceivedAt = localStorage.getItem('auth_callback_received_at');
    
    if (callbackUrl) {
      const receivedTime = callbackReceivedAt ? parseInt(callbackReceivedAt, 10) : 0;
      const currentTime = Date.now();
      const minutesAgo = (currentTime - receivedTime) / (1000 * 60);
      
      logDebugMessage(`Found stored callback URL from ${minutesAgo.toFixed(1)} minutes ago:`, 'info');
      logDebugMessage(callbackUrl, 'info');
      
      // Check if URL contains expected parameters
      if (callbackUrl.includes('auth/callback')) {
        logDebugMessage('URL contains auth/callback path (good)', 'success');
      } else {
        logDebugMessage('URL does not contain auth/callback path (potential issue)', 'warning');
      }
      
      if (callbackUrl.includes('access_token=') || callbackUrl.includes('code=')) {
        logDebugMessage('URL contains authentication parameters (good)', 'success');
      } else {
        logDebugMessage('URL does not contain authentication parameters (potential issue)', 'warning');
      }
      
      // Check URL scheme
      if (callbackUrl.startsWith('introgy://')) {
        logDebugMessage('URL uses custom scheme introgy:// (good for native app)', 'success');
      } else if (callbackUrl.startsWith('https://introgy.ai')) {
        logDebugMessage('URL uses https://introgy.ai domain (good for web app)', 'success');
      } else {
        logDebugMessage(`URL uses unexpected scheme/domain: ${callbackUrl.split('/')[0]}`, 'warning');
      }
    } else {
      logDebugMessage('No stored callback URL found', 'warning');
    }
    
    // Check for auth in progress flags
    const authInProgress = localStorage.getItem('auth_in_progress');
    const authStartedAt = localStorage.getItem('auth_started_at');
    
    if (authInProgress) {
      const startedTime = authStartedAt ? parseInt(authStartedAt, 10) : 0;
      const currentTime = Date.now();
      const minutesAgo = (currentTime - startedTime) / (1000 * 60);
      
      logDebugMessage(`Auth in progress: ${authInProgress} (started ${minutesAgo.toFixed(1)} minutes ago)`, 'warning');
      logDebugMessage('Auth process may be stuck or incomplete', 'warning');
    } else {
      logDebugMessage('No auth in progress flags found', 'info');
    }
    
    // Check for processed tokens/code flags
    const tokensProcessed = localStorage.getItem('auth_tokens_processed');
    const tokensProcessedAt = localStorage.getItem('auth_tokens_processed_at');
    const codeProcessed = localStorage.getItem('auth_code_processed');
    const codeProcessedAt = localStorage.getItem('auth_code_processed_at');
    
    if (tokensProcessed === 'true' || codeProcessed === 'true') {
      const processedTime = tokensProcessedAt || codeProcessedAt || '0';
      const minutesAgo = (Date.now() - parseInt(processedTime, 10)) / (1000 * 60);
      
      logDebugMessage(`Authentication was processed ${minutesAgo.toFixed(1)} minutes ago`, 'success');
      
      if (tokensProcessed === 'true') {
        logDebugMessage('Tokens were processed successfully', 'success');
      }
      
      if (codeProcessed === 'true') {
        logDebugMessage('Authorization code was processed successfully', 'success');
      }
    } else {
      logDebugMessage('No evidence that auth tokens or code were processed', 'warning');
    }
    
    // Check for deep links initialization
    const deepLinksInitializing = localStorage.getItem('deep_links_initializing');
    
    if (deepLinksInitializing === 'true') {
      logDebugMessage('Deep links are currently initializing (potential issue)', 'warning');
    } else {
      logDebugMessage('Deep links are not initializing', 'info');
    }
    
    // Check for last URL opens
    const lastAppUrlOpen = localStorage.getItem('last_app_url_open');
    const lastAppUrlOpenTime = localStorage.getItem('last_app_url_open_time');
    const lastLaunchUrl = localStorage.getItem('last_launch_url');
    const lastLaunchUrlTime = localStorage.getItem('last_launch_url_time');
    
    if (lastAppUrlOpen) {
      const openTime = lastAppUrlOpenTime ? parseInt(lastAppUrlOpenTime, 10) : 0;
      const minutesAgo = (Date.now() - openTime) / (1000 * 60);
      
      logDebugMessage(`Last app URL open (${minutesAgo.toFixed(1)} minutes ago):`, 'info');
      logDebugMessage(lastAppUrlOpen, 'info');
    } else {
      logDebugMessage('No record of app being opened with a URL', 'warning');
      logDebugMessage('This suggests deep linking may not be working properly', 'warning');
    }
    
    if (lastLaunchUrl) {
      const launchTime = lastLaunchUrlTime ? parseInt(lastLaunchUrlTime, 10) : 0;
      const minutesAgo = (Date.now() - launchTime) / (1000 * 60);
      
      logDebugMessage(`Last launch URL (${minutesAgo.toFixed(1)} minutes ago):`, 'info');
      logDebugMessage(lastLaunchUrl, 'info');
    }
    
    // Check platform information
    const platform = window.Capacitor?.getPlatform() || 'web';
    logDebugMessage(`Current platform: ${platform}`, 'info');
    
    if (platform === 'ios') {
      logDebugMessage('iOS requires proper app association for deep linking', 'info');
      logDebugMessage('Check that apple-app-site-association file is properly configured', 'info');
    } else if (platform === 'android') {
      logDebugMessage('Android requires proper intent filters for deep linking', 'info');
      logDebugMessage('Check that AndroidManifest.xml has proper intent filters', 'info');
    } else if (platform === 'web') {
      logDebugMessage('Web platform should use regular URLs for redirection', 'info');
      logDebugMessage('Check that redirect URLs are properly configured in Supabase', 'info');
    }
    
    // Check for common issues
    logDebugMessage('Common redirect issues:', 'info');
    logDebugMessage('1. Incorrect redirect URL in Supabase settings', 'info');
    logDebugMessage('2. Missing or incorrect URL scheme registration in native app', 'info');
    logDebugMessage('3. Deep link handler not properly initialized', 'info');
    logDebugMessage('4. Authentication process interrupted or timed out', 'info');
    logDebugMessage('5. App in background not receiving the deep link', 'info');
    
    logDebugMessage('Redirect analysis completed', 'success');
  } catch (e) {
    logDebugMessage('Error analyzing redirect issues: ' + e.message, 'error');
  }
}

// Function to debug tokens
function debugTokens() {
  try {
    logDebugMessage('Starting token debugging...', 'info');
    
    // Check if Supabase is available
    if (!window.supabase) {
      logDebugMessage('Supabase client not available', 'error');
      return;
    }
    
    // Check current session
    window.supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        logDebugMessage('Error getting session: ' + error.message, 'error');
        return;
      }
      
      if (!data || !data.session) {
        logDebugMessage('No active session found', 'warning');
        
        // Check localStorage for any tokens
        const localStorageKeys = Object.keys(localStorage);
        const tokenKeys = localStorageKeys.filter(key => 
          key.includes('token') || 
          key.includes('supabase.auth') || 
          key.includes('sb-') ||
          key.includes('access_token') ||
          key.includes('refresh_token')
        );
        
        if (tokenKeys.length > 0) {
          logDebugMessage(`Found ${tokenKeys.length} potential token-related items in localStorage:`, 'info');
          tokenKeys.forEach(key => {
            const value = localStorage.getItem(key);
            const displayValue = value ? `[${value.length} chars]` : '[empty]';
            logDebugMessage(`- ${key}: ${displayValue}`, 'info');
            
            // For Supabase auth data, try to parse and analyze
            if (key.includes('supabase.auth.token') || key.includes('sb-')) {
              try {
                const parsed = JSON.parse(value);
                if (parsed) {
                  // Check for expired tokens
                  if (parsed.expiresAt || parsed.expires_at || parsed.exp) {
                    const expiresAt = parsed.expiresAt || parsed.expires_at || parsed.exp;
                    const expiryDate = new Date(expiresAt * 1000);
                    const now = new Date();
                    
                    if (expiryDate < now) {
                      logDebugMessage(`Token expired at ${expiryDate.toLocaleString()}`, 'warning');
                    } else {
                      const minutesLeft = Math.floor((expiryDate - now) / (1000 * 60));
                      logDebugMessage(`Token expires in ${minutesLeft} minutes (${expiryDate.toLocaleString()})`, 'info');
                    }
                  }
                  
                  // Log token type if available
                  if (parsed.token_type || parsed.tokenType) {
                    logDebugMessage(`Token type: ${parsed.token_type || parsed.tokenType}`, 'info');
                  }
                }
              } catch (parseError) {
                logDebugMessage(`Could not parse token data for ${key}: ${parseError.message}`, 'warning');
              }
            }
          });
        } else {
          logDebugMessage('No token-related items found in localStorage', 'warning');
        }
        
        return;
      }
      
      // We have an active session
      const session = data.session;
      logDebugMessage('Active session found', 'success');
      
      // Check token expiry
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = expiresAt - now;
      const minutesLeft = Math.floor(secondsLeft / 60);
      
      if (minutesLeft < 5) {
        logDebugMessage(`Session expires soon: ${minutesLeft} minutes left`, 'warning');
      } else {
        logDebugMessage(`Session expires in ${minutesLeft} minutes`, 'info');
      }
      
      // Check token details
      if (session.access_token) {
        logDebugMessage(`Access token present (${session.access_token.length} chars)`, 'info');
        
        // Try to decode JWT to check claims
        try {
          const tokenParts = session.access_token.split('.');
          if (tokenParts.length === 3) {
            // Decode the payload (middle part)
            const payload = JSON.parse(atob(tokenParts[1]));
            
            // Log important claims
            if (payload.exp) {
              const expDate = new Date(payload.exp * 1000);
              logDebugMessage(`Token exp claim: ${expDate.toLocaleString()}`, 'info');
            }
            
            if (payload.sub) {
              logDebugMessage(`Token subject (user ID): ${payload.sub}`, 'info');
            }
            
            if (payload.email) {
              logDebugMessage(`Token email: ${payload.email}`, 'info');
            }
            
            if (payload.aud) {
              logDebugMessage(`Token audience: ${payload.aud}`, 'info');
            }
            
            // Check for role or permissions
            if (payload.role) {
              logDebugMessage(`Token role: ${payload.role}`, 'info');
            }
            
            // Log all claims for debugging
            logDebugMessage('All token claims:', 'info');
            Object.keys(payload).forEach(key => {
              logDebugMessage(`- ${key}: ${JSON.stringify(payload[key])}`, 'info');
            });
          } else {
            logDebugMessage('Access token is not in valid JWT format', 'warning');
          }
        } catch (e) {
          logDebugMessage('Error decoding access token: ' + e.message, 'error');
        }
      } else {
        logDebugMessage('No access token in session', 'warning');
      }
      
      // Check refresh token
      if (session.refresh_token) {
        logDebugMessage(`Refresh token present (${session.refresh_token.length} chars)`, 'info');
      } else {
        logDebugMessage('No refresh token in session', 'warning');
      }
      
      // Check user data
      if (session.user) {
        logDebugMessage(`User ID: ${session.user.id}`, 'info');
        if (session.user.email) {
          logDebugMessage(`User email: ${session.user.email}`, 'info');
        }
        if (session.user.app_metadata) {
          logDebugMessage('User app metadata:', 'info');
          Object.keys(session.user.app_metadata).forEach(key => {
            logDebugMessage(`- ${key}: ${JSON.stringify(session.user.app_metadata[key])}`, 'info');
          });
        }
        if (session.user.user_metadata) {
          logDebugMessage('User metadata:', 'info');
          Object.keys(session.user.user_metadata).forEach(key => {
            logDebugMessage(`- ${key}: ${JSON.stringify(session.user.user_metadata[key])}`, 'info');
          });
        }
      } else {
        logDebugMessage('No user data in session', 'warning');
      }
      
      // Check for provider
      if (session.provider) {
        logDebugMessage(`Auth provider: ${session.provider}`, 'info');
      }
      
      logDebugMessage('Token debugging completed', 'success');
    });
  } catch (e) {
    logDebugMessage('Error during token debugging: ' + e.message, 'error');
  }
}

// Function to export logs to a downloadable file
function exportAuthDebugLogs() {
  try {
    // Get all logs from localStorage if available
    let logs = [];
    const storedLogsJson = localStorage.getItem('auth_debug_logs');
    if (storedLogsJson) {
      try {
        logs = JSON.parse(storedLogsJson);
      } catch (e) {
        logs = [];
      }
    }
    
    // If no stored logs, use in-memory logs
    if (!logs.length) {
      logs = window.authDebugLogs;
    }
    
    // Add system information
    const systemInfo = {
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      message: 'SYSTEM INFORMATION',
      level: 'info',
      details: {
        userAgent: navigator.userAgent,
        platform: window.Capacitor?.getPlatform() || 'web',
        url: window.location.href,
        localStorage: {}
      }
    };
    
    // Add auth-related localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('supabase') || key.includes('deep_link') || key.includes('session'))) {
        const value = localStorage.getItem(key);
        systemInfo.details.localStorage[key] = value;
      }
    }
    
    // Add system info to the beginning of logs
    logs.unshift(systemInfo);
    
    // Format logs for export
    let exportText = 'AUTHENTICATION DEBUG LOGS\n';
    exportText += `Exported: ${new Date().toLocaleString()}\n`;
    exportText += `URL: ${window.location.href}\n`;
    exportText += `Platform: ${window.Capacitor?.getPlatform() || 'web'}\n`;
    exportText += `User Agent: ${navigator.userAgent}\n\n`;
    
    // Add all logs
    logs.forEach(log => {
      let logLine = `[${log.date || ''} ${log.time}] [${log.level || 'info'}] ${log.message}`;
      
      // Add details if present
      if (log.details) {
        logLine += '\n' + JSON.stringify(log.details, null, 2);
      }
      
      exportText += logLine + '\n\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth-debug-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    logDebugMessage('Logs exported successfully', 'success');
  } catch (e) {
    console.error('Error exporting logs:', e);
    logDebugMessage('Error exporting logs: ' + e.message, 'error');
  }
}

// Initialize auth debug listeners
function initAuthDebugListeners() {
  // Log auth-related localStorage changes
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (key.includes('auth') || key.includes('supabase') || key.includes('deep_link') || key.includes('session')) {
      logDebugMessage(`localStorage.setItem('${key}', '${value.substring(0, 20)}${value.length > 20 ? '...' : ''}')`);
    }
    originalSetItem.call(this, key, value);
  };
  
  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function(key) {
    if (key.includes('auth') || key.includes('supabase') || key.includes('deep_link') || key.includes('session')) {
      logDebugMessage(`localStorage.removeItem('${key}')`);
    }
    originalRemoveItem.call(this, key);
  };
  
  // Log all message events
  window.addEventListener('message', (event) => {
    // Log deep link messages
    if (event.data?.source === 'deep-links') {
      // Create a safe copy of the data for logging
      const safeCopy = { ...event.data };
      
      // Truncate any tokens or sensitive data
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
          // Truncate URL with sensitive data
          safeCopy.data.url = safeCopy.data.url.replace(/access_token=[^&]+/g, 'access_token=[REDACTED]')
            .replace(/refresh_token=[^&]+/g, 'refresh_token=[REDACTED]')
            .replace(/code=[^&]+/g, 'code=[REDACTED]');
        }
      }
      
      logDebugMessage('Deep link message: ' + JSON.stringify(safeCopy));
    }
  });
  
  // Monitor Google Sign-In related events
  const originalWindowOpen = window.open;
  window.open = function(url, target, features) {
    if (url && typeof url === 'string' && (url.includes('google') || url.includes('accounts.google'))) {
      logDebugMessage(`Opening Google auth window: ${url.substring(0, 100)}...`);
      localStorage.setItem('google_auth_window_opened', Date.now().toString());
    }
    return originalWindowOpen.apply(this, arguments);
  };
  
  // Intercept fetch requests to auth endpoints
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Only log auth-related requests
    if (typeof url === 'string' && (url.includes('auth') || url.includes('supabase'))) {
      try {
        let requestInfo = `Fetch request to: ${url}`;
        
        // Log request body if it exists and is auth-related
        if (options && options.body) {
          try {
            const bodyContent = typeof options.body === 'string' ? options.body : '(non-string body)';
            if (bodyContent.includes('token') || bodyContent.includes('code')) {
              // Redact sensitive information
              const redactedBody = bodyContent
                .replace(/"access_token":"[^"]+"/g, '"access_token":"[REDACTED]"')
                .replace(/"refresh_token":"[^"]+"/g, '"refresh_token":"[REDACTED]"')
                .replace(/"code":"[^"]+"/g, '"code":"[REDACTED]"');
              requestInfo += `\nBody: ${redactedBody.substring(0, 100)}${redactedBody.length > 100 ? '...' : ''}`;
            }
          } catch (bodyError) {
            requestInfo += '\nCould not parse request body';
          }
        }
        
        logDebugMessage(requestInfo);
      } catch (logError) {
        console.error('Error logging fetch request:', logError);
      }
      
      // Return the original fetch with added logging
      return originalFetch.apply(this, arguments)
        .then(response => {
          logDebugMessage(`Fetch response from ${url}: status ${response.status}`);
          
          // Clone the response to inspect it without consuming it
          const clonedResponse = response.clone();
          
          // Try to log response body for auth endpoints
          if (url.includes('auth/token') || url.includes('auth/callback')) {
            clonedResponse.json().catch(() => ({})).then(body => {
              try {
                if (body) {
                  // Redact sensitive information
                  const safeBody = { ...body };
                  if (safeBody.access_token) safeBody.access_token = `[${safeBody.access_token.length} chars]`;
                  if (safeBody.refresh_token) safeBody.refresh_token = `[${safeBody.refresh_token.length} chars]`;
                  
                  logDebugMessage(`Response body: ${JSON.stringify(safeBody).substring(0, 100)}...`);
                }
              } catch (bodyError) {
                console.error('Error logging response body:', bodyError);
              }
            });
          }
          
          return response;
        })
        .catch(error => {
          logDebugMessage(`Fetch error for ${url}: ${error.message}`);
          throw error;
        });
    }
    
    // For non-auth requests, just pass through
    return originalFetch.apply(this, arguments);
  };
  
  // Monitor URL changes for single-page apps
  let lastUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      const oldUrl = lastUrl;
      lastUrl = window.location.href;
      
      // Only log if the URL contains auth-related parameters
      if (lastUrl.includes('auth') || lastUrl.includes('token') || lastUrl.includes('code')) {
        logDebugMessage(`URL changed from ${oldUrl.substring(0, 30)}... to ${lastUrl.substring(0, 30)}...`);
        
        // If this is an auth callback URL, process it
        if (lastUrl.includes('auth/callback') || lastUrl.includes('access_token=') || lastUrl.includes('code=')) {
          logDebugMessage('Auth callback URL detected after navigation');
          
          // Process the URL
          setTimeout(() => {
            window.postMessage({
              source: 'deep-links',
              type: 'auth_full_url',
              data: { url: lastUrl }
            }, '*');
          }, 100);
        }
      }
    }
  });
  
  // Start observing URL changes
  urlObserver.observe(document, { subtree: true, childList: true });
  
  // Log initial auth state
  logDebugMessage('Auth debug initialized');
  logDebugMessage('URL: ' + window.location.href);
  logDebugMessage('User Agent: ' + navigator.userAgent);
  logDebugMessage('Platform: ' + (window.Capacitor?.getPlatform() || 'web'));
  
  // Log auth in progress state
  const authInProgress = localStorage.getItem('auth_in_progress');
  const authStartedAt = localStorage.getItem('auth_started_at');
  if (authInProgress) {
    logDebugMessage('Auth in progress: ' + authInProgress);
  }
  if (authStartedAt) {
    const startTime = parseInt(authStartedAt, 10);
    const currentTime = Date.now();
    const minutesPassed = (currentTime - startTime) / (1000 * 60);
    logDebugMessage('Auth started: ' + new Date(startTime).toLocaleString() + ` (${minutesPassed.toFixed(1)} minutes ago)`);
  }
  
  // Check for existing auth tokens
  const tokensProcessed = localStorage.getItem('auth_tokens_processed');
  const tokensProcessedAt = localStorage.getItem('auth_tokens_processed_at');
  const codeProcessed = localStorage.getItem('auth_code_processed');
  const codeProcessedAt = localStorage.getItem('auth_code_processed_at');
  
  if (tokensProcessed) {
    const processedTime = parseInt(tokensProcessedAt || '0', 10);
    const minutesAgo = processedTime ? ((Date.now() - processedTime) / (1000 * 60)).toFixed(1) : 'unknown';
    logDebugMessage(`Auth tokens were processed previously (${minutesAgo} minutes ago)`);
  }
  
  if (codeProcessed) {
    const processedTime = parseInt(codeProcessedAt || '0', 10);
    const minutesAgo = processedTime ? ((Date.now() - processedTime) / (1000 * 60)).toFixed(1) : 'unknown';
    logDebugMessage(`Auth code was processed previously (${minutesAgo} minutes ago)`);
  }
  
  // Check for callback URL
  const callbackUrl = localStorage.getItem('auth_callback_url');
  const callbackReceivedAt = localStorage.getItem('auth_callback_received_at');
  
  if (callbackUrl) {
    const receivedTime = parseInt(callbackReceivedAt || '0', 10);
    const minutesAgo = receivedTime ? ((Date.now() - receivedTime) / (1000 * 60)).toFixed(1) : 'unknown';
    logDebugMessage(`Stored auth callback URL (${minutesAgo} minutes ago): ${callbackUrl.substring(0, 30)}...`);
  }
  
  // Log all existing auth-related localStorage items
  logDebugMessage('Existing auth storage items:');
  let authItemCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('auth') || key.includes('supabase') || key.includes('deep_link') || key.includes('session'))) {
      const value = localStorage.getItem(key);
      const displayValue = value ? `${value.substring(0, 20)}${value.length > 20 ? '...' : ''}` : 'null';
      logDebugMessage(`- ${key}: ${displayValue}`);
      authItemCount++;
    }
  }
  if (authItemCount === 0) {
    logDebugMessage('- No auth items found');
  }
  
  // Check if current URL has auth parameters
  const currentUrl = window.location.href;
  if (currentUrl.includes('auth/callback') || currentUrl.includes('access_token=') || currentUrl.includes('code=')) {
    logDebugMessage('Current URL contains auth parameters, will process it');
    
    // Process the URL after a short delay to allow other initialization to complete
    setTimeout(() => {
      window.postMessage({
        source: 'deep-links',
        type: 'auth_full_url',
        data: { url: currentUrl }
      }, '*');
    }, 500);
  }
}

// Helper function to log debug messages
function logDebugMessage(message, level = 'info') {
  const timestamp = new Date();
  const timeString = timestamp.toLocaleTimeString();
  const dateString = timestamp.toLocaleDateString();
  
  // Add icon based on log level
  let icon = '🔵';
  if (level === 'error') icon = '🔴';
  if (level === 'warning') icon = '🟠';
  if (level === 'success') icon = '🟢';
  
  // Log to console with appropriate styling
  const consoleStyles = {
    info: 'color: #3498db', // blue
    error: 'color: #e74c3c', // red
    warning: 'color: #f39c12', // orange
    success: 'color: #2ecc71' // green
  };
  
  console.log(`%c[Auth Debug] ${icon} ${message}`, consoleStyles[level] || consoleStyles.info);
  
  // Create log entry
  const logEntry = {
    time: timeString,
    date: dateString,
    timestamp: timestamp.getTime(),
    message: message,
    level: level
  };
  
  // Add to global log array
  window.authDebugLogs.push(logEntry);
  
  // Store logs in localStorage with a timestamp (keep last 200 logs)
  try {
    // Get existing logs from localStorage
    let storedLogs = [];
    const storedLogsJson = localStorage.getItem('auth_debug_logs');
    if (storedLogsJson) {
      try {
        storedLogs = JSON.parse(storedLogsJson);
      } catch (e) {
        // If parsing fails, start with empty array
        storedLogs = [];
      }
    }
    
    // Add new log
    storedLogs.push(logEntry);
    
    // Limit to last 200 logs
    if (storedLogs.length > 200) {
      storedLogs = storedLogs.slice(-200);
    }
    
    // Save back to localStorage
    localStorage.setItem('auth_debug_logs', JSON.stringify(storedLogs));
  } catch (e) {
    // If localStorage fails, just continue
    console.warn('Failed to store auth debug logs in localStorage', e);
  }
  
  // Limit the in-memory logs
  if (window.authDebugLogs.length > 100) {
    window.authDebugLogs.shift();
  }
  
  // Update the UI if it exists
  const logContainer = document.getElementById('auth-debug-log');
  if (logContainer) {
    const logEntryElement = document.createElement('div');
    
    // Style based on log level
    const levelColors = {
      info: '#3498db',
      error: '#e74c3c',
      warning: '#f39c12',
      success: '#2ecc71'
    };
    
    // Create log entry with icon and colored border
    logEntryElement.innerHTML = `<span style="color: ${levelColors[level] || levelColors.info}">${icon}</span> <span style="color: #888;">[${logEntry.time}]</span> ${logEntry.message}`;
    logEntryElement.style.borderBottom = '1px solid #444';
    logEntryElement.style.paddingBottom = '5px';
    logEntryElement.style.marginBottom = '5px';
    logEntryElement.style.borderLeft = `3px solid ${levelColors[level] || levelColors.info}`;
    logEntryElement.style.paddingLeft = '5px';
    
    // Add to the top
    if (logContainer.firstChild) {
      logContainer.insertBefore(logEntryElement, logContainer.firstChild);
    } else {
      logContainer.appendChild(logEntryElement);
    }
    
    // Limit number of displayed entries
    while (logContainer.children.length > 50) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }
  
  // Return the log entry for chaining
  return logEntry;
}

// Make supabase available to the debug panel
document.addEventListener('deviceready', () => {
  // Wait for supabase to be initialized
  const checkSupabase = setInterval(() => {
    if (window.supabase) {
      clearInterval(checkSupabase);
      logDebugMessage('Supabase is available');
      
      // Check for session immediately
      try {
        window.supabase.auth.getSession().then(({ data, error }) => {
          if (error) {
            logDebugMessage('Session check error: ' + error.message);
          } else if (data?.session) {
            logDebugMessage('Session found on deviceready:');
            logDebugMessage('User ID: ' + data.session.user.id);
            const now = Math.floor(Date.now() / 1000);
            const expiresAt = data.session.expires_at;
            const minutesLeft = Math.floor((expiresAt - now) / 60);
            logDebugMessage(`Token expires in: ${minutesLeft} minutes`);
          } else {
            logDebugMessage('No session found on deviceready');
          }
        });
      } catch (e) {
        logDebugMessage('Error in deviceready session check: ' + e.message);
      }
    }
  }, 1000);
}, false);

// Also check on page load
window.addEventListener('load', () => {
  logDebugMessage('Window loaded');
  
  // Check if we have a URL with auth parameters
  const url = window.location.href;
  if (url.includes('auth/callback') || url.includes('access_token=') || url.includes('code=')) {
    logDebugMessage('Auth parameters detected in URL: ' + url);
  }
});

// Monitor navigation events
window.addEventListener('popstate', () => {
  logDebugMessage('Navigation: popstate event');
  logDebugMessage('Current URL: ' + window.location.href);
});

// Monitor hash changes
window.addEventListener('hashchange', (event) => {
  logDebugMessage('Navigation: hashchange event');
  logDebugMessage('Old URL: ' + event.oldURL);
  logDebugMessage('New URL: ' + event.newURL);
});
