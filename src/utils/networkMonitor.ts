/**
 * Network request monitoring utility
 * Intercepts fetch requests to monitor auth-related network traffic
 */

/**
 * Analyzes a URL for common formatting issues
 */
function analyzeUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const issues = [];
    
    // Check for trailing slashes in site URL
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      issues.push('URL has trailing slash');
    }
    
    // Check for http vs https
    if (urlObj.protocol === 'http:') {
      issues.push('URL uses HTTP instead of HTTPS');
    }
    
    // Check for redirect_to parameter
    const redirectTo = urlObj.searchParams.get('redirect_to');
    if (redirectTo) {
      try {
        const redirectUrl = new URL(redirectTo);
        
        // Check if redirect_to is properly encoded
        if (redirectTo !== encodeURI(decodeURI(redirectTo))) {
          issues.push('redirect_to parameter is not properly encoded');
        }
        
        // Check if redirect_to has trailing slash
        if (redirectUrl.pathname !== '/' && redirectUrl.pathname.endsWith('/')) {
          issues.push('redirect_to has trailing slash');
        }
        
        // Check if redirect_to uses http
        if (redirectUrl.protocol === 'http:') {
          issues.push('redirect_to uses HTTP instead of HTTPS');
        }
      } catch (e) {
        issues.push(`Invalid redirect_to URL: ${redirectTo}`);
      }
    }
    
    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      issues: issues.length > 0 ? issues : undefined
    };
  } catch (e) {
    return { error: `Invalid URL: ${e.message}`, url };
  }
}

export function setupNetworkMonitoring() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  console.log('[Network Monitor] Initializing enhanced network monitoring...');
  
  // Monitor URL errors in the callback
  const monitorCallbackErrors = () => {
    // Check URL every time location changes
    if (window.location.pathname.includes('/auth/callback') || 
        window.location.pathname.includes('/oauth') ||
        window.location.search.includes('error') ||
        window.location.hash.includes('error')) {
      
      const currentUrl = window.location.href;
      const timestamp = new Date().toISOString();
      
      console.log(`[${timestamp}] Auth callback detected at: ${currentUrl}`);
      
      // Parse URL components for debugging
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Check for errors in URL parameters
      const urlError = hashParams.get('error') || queryParams.get('error');
      const urlErrorDescription = 
        hashParams.get('error_description') || 
        queryParams.get('error_description') || 
        hashParams.get('message') || 
        queryParams.get('message');
      
      if (urlError) {
        console.error(`[${timestamp}] Auth error detected:`, {
          error: urlError,
          description: urlErrorDescription
        });
        
        // Check specifically for site URL formatting error
        const isSiteUrlError = urlError === 'unexpected_failure' && 
          (urlErrorDescription?.toLowerCase().includes('site url') || 
           urlErrorDescription?.toLowerCase().includes('formatted'));
        
        if (isSiteUrlError) {
          console.error(`[${timestamp}] SITE URL FORMATTING ERROR DETECTED:`, urlErrorDescription);
          
          // Analyze the URL for common issues
          const urlAnalysis = analyzeUrl(currentUrl);
          console.log(`[${timestamp}] URL analysis:`, urlAnalysis);
          
          // Store detailed error information
          localStorage.setItem('site_url_error_detected', 'true');
          localStorage.setItem('site_url_error_description', urlErrorDescription || 'Unknown');
          localStorage.setItem('site_url_error_timestamp', timestamp);
          localStorage.setItem('site_url_error_url', currentUrl);
          localStorage.setItem('site_url_error_analysis', JSON.stringify(urlAnalysis));
        }
      }
      
      // Store callback details for debugging
      localStorage.setItem('last_auth_callback', JSON.stringify({
        url: currentUrl,
        timestamp,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        hashParams: Object.fromEntries(hashParams.entries()),
        queryParams: Object.fromEntries(queryParams.entries()),
        error: urlError,
        errorDescription: urlErrorDescription,
        urlAnalysis: analyzeUrl(currentUrl)
      }));
    }
  };
  
  // Run once on initialization
  monitorCallbackErrors();
  
  // Monitor location changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    monitorCallbackErrors();
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    monitorCallbackErrors();
  };
  
  window.addEventListener('popstate', monitorCallbackErrors);
  
  // Store the original fetch function
  const originalFetch = window.fetch;
  
  // Override the fetch function to monitor requests
  window.fetch = function(...args) {
    const [url] = args;
    const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : '';
    
    // Check if this is an auth-related request
    if (urlStr && (urlStr.includes('supabase') || urlStr.includes('auth'))) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Auth-related fetch:`, urlStr);
      
      // Analyze the URL for potential issues
      const urlAnalysis = analyzeUrl(urlStr);
      if (urlAnalysis.issues && urlAnalysis.issues.length > 0) {
        console.warn(`[${timestamp}] Potential URL issues detected:`, urlAnalysis.issues);
      }
      
      // Store in localStorage for debugging
      try {
        const storedRequests = JSON.parse(localStorage.getItem('auth_network_requests') || '[]');
        storedRequests.push({
          url: urlStr,
          timestamp,
          args: args.length > 1 ? JSON.stringify(args[1]) : undefined,
          urlAnalysis
        });
        
        // Keep only the last 20 requests to avoid localStorage size limits
        if (storedRequests.length > 20) {
          storedRequests.shift();
        }
        
        localStorage.setItem('auth_network_requests', JSON.stringify(storedRequests));
      } catch (err) {
        console.error('Error storing network request:', err);
      }
    }
    
    // Call the original fetch function
    return originalFetch.apply(this, args).then(response => {
      // If this is an auth-related request, check for errors
      if (urlStr && (urlStr.includes('supabase') || urlStr.includes('auth'))) {
        const timestamp = new Date().toISOString();
        
        // Clone the response so we can read it and still return the original
        response.clone().json().then(data => {
          if (data.error) {
            console.error(`[${timestamp}] Auth API error:`, {
              url: urlStr,
              error: data.error,
              data
            });
            
            // Store error information
            localStorage.setItem('last_auth_api_error', JSON.stringify({
              url: urlStr,
              timestamp,
              error: data.error,
              data
            }));
          }
        }).catch(() => {
          // Ignore JSON parsing errors
        });
      }
      
      return response;
    });
  };
  
  console.log('[Network Monitor] Enhanced monitoring initialized for auth-related requests');
}
