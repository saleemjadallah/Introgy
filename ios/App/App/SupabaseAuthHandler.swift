import Foundation
import WebKit
import Capacitor

// Protocol for logging events with class bound so it can be used with weak references
@objc protocol AuthEventLogger: AnyObject {
    func logEvent(_ message: String)
}

// Internal class instead of public to avoid exposing internal types
@objc class SupabaseAuthHandler: NSObject {
    
    private weak var webView: WKWebView?
    private weak var logger: AuthEventLogger?
    
    @objc init(webView: WKWebView?, logger: AuthEventLogger?) {
        self.webView = webView
        self.logger = logger
        super.init()
    }
    
    @objc func handleCallback(url: URL) -> Bool {
        // Log the URL for debugging
        print("🔑 SupabaseAuthHandler: Processing URL: \(url.absoluteString)")
        if let logger = logger {
            logger.logEvent("SupabaseAuthHandler processing URL: \(url.absoluteString)")
        }
        
        // Check if this is a Supabase auth callback
        if url.absoluteString.contains("auth.supabase.co/callback") || 
           url.absoluteString.contains("gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback") || 
           (url.host == "auth.supabase.co" && url.path.contains("/callback")) || 
           (url.host == "gnvlzzqtmxrfvkdydxet.supabase.co" && url.path.contains("/auth/v1/callback")) {
            print("🔑 Detected Supabase auth callback URL")
            if let logger = logger {
                logger.logEvent("Processing Supabase auth callback")
            }
            
            // Extract tokens from URL fragment or query parameters
            if let fragment = url.fragment {
                // Handle fragment-based token (common in OAuth flows)
                let fragmentParams = parseUrlParams(fragment)
                if let accessToken = fragmentParams["access_token"],
                   let refreshToken = fragmentParams["refresh_token"] {
                    print("✅ Successfully extracted tokens from URL fragment")
                    if let logger = logger {
                        logger.logEvent("Found tokens in URL fragment")
                    }
                    setSupabaseSession(accessToken: accessToken, refreshToken: refreshToken)
                    return true
                }
            }
            
            // Try query parameters if fragment didn't have tokens
            if let query = url.query {
                let queryParams = parseUrlParams(query)
                if let accessToken = queryParams["access_token"],
                   let refreshToken = queryParams["refresh_token"] {
                    print("✅ Successfully extracted tokens from URL query")
                    if let logger = logger {
                        logger.logEvent("Found tokens in URL query")
                    }
                    setSupabaseSession(accessToken: accessToken, refreshToken: refreshToken)
                    return true
                }
            }
            
            // Check for error in the URL
            if url.absoluteString.contains("error=") {
                print("❌ Error detected in Supabase callback URL")
                if let logger = logger {
                    logger.logEvent("Error in Supabase callback: \(url.absoluteString)")
                }
                handleAuthError(url: url)
                return true
            }
            
            return true
        }
        
        return false
    }
    
    private func parseUrlParams(_ paramString: String) -> [String: String] {
        var params = [String: String]()
        for param in paramString.components(separatedBy: "&") {
            let parts = param.components(separatedBy: "=")
            if parts.count == 2 {
                let key = parts[0]
                let value = parts[1].removingPercentEncoding ?? parts[1]
                params[key] = value
            }
        }
        return params
    }
    
    private func setSupabaseSession(accessToken: String, refreshToken: String) {
        if let logger = logger {
            logger.logEvent("Setting Supabase session with tokens")
        }
        
        // Execute JavaScript to set the session
        if let webView = webView {
            let js = """
            try {
                console.log('Setting Supabase session from native code');
                if (window.supabase && window.supabase.auth) {
                    window.supabase.auth.setSession({
                        access_token: '\(accessToken)',
                        refresh_token: '\(refreshToken)'
                    }).then(response => {
                        console.log('Session set successfully');
                        window.dispatchEvent(new CustomEvent('supabaseAuthComplete', { 
                            detail: { success: true } 
                        }));
                        // Navigate in your app if needed
                        if (window.location.pathname !== '/dashboard') {
                            window.location.href = '/dashboard';
                        }
                    }).catch(error => {
                        console.error('Error setting session:', error);
                        window.dispatchEvent(new CustomEvent('supabaseAuthError', { 
                            detail: { error: error.message } 
                        }));
                    });
                } else {
                    console.error('Supabase auth not available');
                    // Store tokens for later use when Supabase is available
                    localStorage.setItem('pendingAuthTokens', JSON.stringify({
                        access_token: '\(accessToken)',
                        refresh_token: '\(refreshToken)'
                    }));
                    window.dispatchEvent(new CustomEvent('pendingAuthTokens', { 
                        detail: { message: 'Tokens stored for later use' } 
                    }));
                }
            } catch (e) {
                console.error('Error in auth handling:', e);
            }
            """
            
            webView.evaluateJavaScript(js) { result, error in
                if let error = error {
                    print("❌ Error setting Supabase session: \(error.localizedDescription)")
                    if let logger = self.logger {
                        logger.logEvent("Error setting Supabase session: \(error.localizedDescription)")
                    }
                } else {
                    print("✅ Supabase session set successfully")
                    if let logger = self.logger {
                        logger.logEvent("Supabase session set successfully")
                    }
                }
            }
        } else {
            print("❌ WebView not found, cannot set Supabase session")
            if let logger = logger {
                logger.logEvent("WebView not found, cannot set Supabase session")
            }
            
            // Store tokens for later use
            UserDefaults.standard.set(accessToken, forKey: "pending_access_token")
            UserDefaults.standard.set(refreshToken, forKey: "pending_refresh_token")
            UserDefaults.standard.set(true, forKey: "has_pending_auth")
        }
    }
    
    private func handleAuthError(url: URL) {
        // Extract error information
        var errorMessage = "Unknown error"
        var errorCode = "unknown"
        
        if let query = url.query {
            let params = parseUrlParams(query)
            errorMessage = params["error_description"] ?? params["error"] ?? "Unknown error"
            errorCode = params["error"] ?? "unknown"
        } else if let fragment = url.fragment {
            let params = parseUrlParams(fragment)
            errorMessage = params["error_description"] ?? params["error"] ?? "Unknown error"
            errorCode = params["error"] ?? "unknown"
        }
        
        print("❌ Supabase auth error: \(errorMessage) (\(errorCode))")
        if let logger = logger {
            logger.logEvent("Supabase auth error: \(errorMessage) (\(errorCode))")
        }
        
        // Notify WebView about the error
        if let webView = webView {
            let js = """
            window.dispatchEvent(new CustomEvent('supabaseAuthError', { 
                detail: { 
                    error: '\(errorMessage)', 
                    code: '\(errorCode)' 
                } 
            }));
            """
            
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }
}
