import Foundation
import WebKit

// This file contains a simplified version of the Supabase callback handling code
// Copy and paste the relevant sections into your AppDelegate.swift file

/*
Replace the Supabase auth callback section in AppDelegate.swift with this code:

// Check for Supabase auth callback
if url.absoluteString.contains("auth.supabase.co/callback") || 
   (url.host == "auth.supabase.co" && url.path.contains("/callback")) {
    print("🔑 Detected Supabase auth callback URL")
    logAuthEvent("Processing Supabase auth callback")
    
    // Extract tokens from URL fragment or query parameters
    if let fragment = url.fragment {
        // Handle fragment-based token (common in OAuth flows)
        // Parse fragment parameters manually
        var fragmentParams = [String: String]()
        for param in fragment.components(separatedBy: "&") {
            let parts = param.components(separatedBy: "=")
            if parts.count == 2 {
                let key = parts[0]
                let value = parts[1].removingPercentEncoding ?? parts[1]
                fragmentParams[key] = value
            }
        }
        
        if let accessToken = fragmentParams["access_token"],
           let refreshToken = fragmentParams["refresh_token"] {
            print("✅ Successfully extracted tokens from URL fragment")
            logAuthEvent("Found tokens in URL fragment")
            
            // Set session directly
            if let webView = findWebView() {
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
                            if (window.location.pathname !== '/dashboard') {
                                window.location.href = '/dashboard';
                            }
                        }).catch(error => {
                            console.error('Error setting session:', error);
                        });
                    } else {
                        console.error('Supabase auth not available');
                        localStorage.setItem('pendingAuthTokens', JSON.stringify({
                            access_token: '\(accessToken)',
                            refresh_token: '\(refreshToken)'
                        }));
                    }
                } catch (e) {
                    console.error('Error in auth handling:', e);
                }
                """
                
                webView.evaluateJavaScript(js) { _, error in
                    if let error = error {
                        print("❌ Error setting Supabase session: \(error.localizedDescription)")
                        self.logAuthEvent("Error setting Supabase session: \(error.localizedDescription)")
                    } else {
                        print("✅ Supabase session set successfully")
                        self.logAuthEvent("Supabase session set successfully")
                    }
                }
            }
            return true
        }
    }
    
    // Try query parameters if fragment didn't have tokens
    if let query = url.query {
        // Parse query parameters manually
        var queryParams = [String: String]()
        for param in query.components(separatedBy: "&") {
            let parts = param.components(separatedBy: "=")
            if parts.count == 2 {
                let key = parts[0]
                let value = parts[1].removingPercentEncoding ?? parts[1]
                queryParams[key] = value
            }
        }
        
        if let accessToken = queryParams["access_token"],
           let refreshToken = queryParams["refresh_token"] {
            print("✅ Successfully extracted tokens from URL query")
            logAuthEvent("Found tokens in URL query")
            
            // Set session directly
            if let webView = findWebView() {
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
                            if (window.location.pathname !== '/dashboard') {
                                window.location.href = '/dashboard';
                            }
                        }).catch(error => {
                            console.error('Error setting session:', error);
                        });
                    } else {
                        console.error('Supabase auth not available');
                        localStorage.setItem('pendingAuthTokens', JSON.stringify({
                            access_token: '\(accessToken)',
                            refresh_token: '\(refreshToken)'
                        }));
                    }
                } catch (e) {
                    console.error('Error in auth handling:', e);
                }
                """
                
                webView.evaluateJavaScript(js) { _, error in
                    if let error = error {
                        print("❌ Error setting Supabase session: \(error.localizedDescription)")
                        self.logAuthEvent("Error setting Supabase session: \(error.localizedDescription)")
                    } else {
                        print("✅ Supabase session set successfully")
                        self.logAuthEvent("Supabase session set successfully")
                    }
                }
            }
            return true
        }
    }
    
    // Check for error in the URL
    if url.absoluteString.contains("error=") {
        print("❌ Error detected in Supabase callback URL")
        logAuthEvent("Error in Supabase callback: \(url.absoluteString)")
        
        // Handle error directly
        var errorMessage = "Unknown error"
        var errorCode = "unknown"
        
        if let query = url.query {
            // Parse query parameters manually
            var queryParams = [String: String]()
            for param in query.components(separatedBy: "&") {
                let parts = param.components(separatedBy: "=")
                if parts.count == 2 {
                    let key = parts[0]
                    let value = parts[1].removingPercentEncoding ?? parts[1]
                    queryParams[key] = value
                }
            }
            
            errorMessage = queryParams["error_description"] ?? queryParams["error"] ?? "Unknown error"
            errorCode = queryParams["error"] ?? "unknown"
        }
        
        print("❌ Supabase auth error: \(errorMessage) (\(errorCode))")
        logAuthEvent("Supabase auth error: \(errorMessage) (\(errorCode))")
        
        // Notify WebView about the error
        if let webView = findWebView() {
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
        return true
    }
}
*/
