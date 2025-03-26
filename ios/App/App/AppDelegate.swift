import UIKit
import Capacitor
import GoogleSignIn
import SwiftUI
import RevenueCat

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Create window with standard Capacitor setup
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Initialize RevenueCat with proper configuration
        Purchases.logLevel = .debug
        let apiKey = "appl_wHXBFRFAOUUpWRqauPXyZEUElmq"
        Purchases.configure(withAPIKey: apiKey)
        
        // The correct way to ensure plugins are registered with Capacitor
        // We'll set this up when creating the bridge view controller later
        print("📱 Will register GoogleAuthPlugin with Capacitor bridge")
        
        // Configure Google Sign-In using our service
        #if canImport(Services)
        // This would be the imported module path
        let authService = Services.GoogleAuthService.shared
        #else
        // This is the direct class reference in the same module
        let authService = GoogleAuthService.shared
        #endif
        
        // First, verify the GoogleAuthConfig has the correct values
        print("📱 Using GoogleAuthConfig with CLIENT_ID: \(GoogleAuthConfig.clientID)")
        print("📱 Using redirect URI: \(GoogleAuthConfig.redirectURI)")
        
        // Verify and load GoogleService-Info.plist as a backup
        if let googleServiceInfoPath = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
           let googleServiceInfo = NSDictionary(contentsOfFile: googleServiceInfoPath) {
            let clientID = googleServiceInfo["CLIENT_ID"] as? String
            print("📱 Found GoogleService-Info.plist with CLIENT_ID: \(clientID ?? "not found")")
            
            // Verify the client IDs match for debugging purposes
            if clientID != GoogleAuthConfig.clientID {
                print("⚠️ Warning: CLIENT_ID in GoogleService-Info.plist (\(clientID ?? "nil")) doesn't match GoogleAuthConfig.clientID (\(GoogleAuthConfig.clientID))")
            } else {
                print("✅ CLIENT_ID in GoogleService-Info.plist matches GoogleAuthConfig.clientID")
            }
        } else {
            print("⚠️ Could not load GoogleService-Info.plist, but we have GoogleAuthConfig as a fallback")
        }
        
        // Configure both auth implementations for consistency
        authService.configure()
        
        // Also initialize the GoogleSignInHandler
        GoogleSignInHandler.shared.configure()
        
        // Use GoogleAuthVerifier to verify setup
        GoogleAuthVerifier.verifySetup()
        
        // Initialize Capacitor web view with our plugin
        let viewController = CAPBridgeViewController.init()
        
        // The plugins should be registered automatically through the plugin.m file
        // Verify plugin registration with additional diagnostics
        print("📱 Verifying Capacitor plugin registration.")
        
        // Note: With the current Capacitor version, we can't directly inspect the plugin registry
        // from outside the bridge. So we'll just log messages for debugging purposes.
        print("📱 GoogleAuth plugin should be registered through GoogleAuthPluginDefinition.m")
        
        // Log key configuration information for Google Sign-In
        print("📱 Google Sign-In configured with client ID: \(GoogleAuthConfig.clientID)")
        print("📱 Using redirect URI: \(GoogleAuthConfig.redirectURI)")
        
        let navController = UINavigationController(rootViewController: viewController)
        navController.navigationBar.isHidden = true
        
        window?.rootViewController = navController
        window?.makeKeyAndVisible()
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Log the URL for debugging with detailed components
        print("📱 AppDelegate: Received URL: \(url.absoluteString)")
        print("📱 URL scheme: \(url.scheme ?? "none")")
        print("📱 URL host: \(url.host ?? "none")")
        print("📱 URL path: \(url.path)")
        if let query = url.query {
            print("📱 URL query: \(query)")
        }
        
        // Special handling for Google authentication URL with our specific scheme
        if url.scheme == "com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2" {
            print("📱 Detected Google authentication URL with our specific scheme")
            
            // Try with GoogleSignInHandler first (new implementation)
            if GoogleSignInHandler.shared.handleURL(url: url) {
                print("📱 URL successfully handled by GoogleSignInHandler")
                return true
            }
            
            // Then try with GoogleAuthService (legacy implementation)
            if GoogleAuthService.shared.handleURL(url) {
                print("📱 URL successfully handled by GoogleAuthService")
                return true
            }
            
            // If neither handler processed it but it's our Google URL scheme,
            // notify Capacitor directly
            NotificationCenter.default.post(
                name: NSNotification.Name("CAPNotificationOpenURL"),
                object: nil,
                userInfo: ["url": url]
            )
            return true
        }
        
        // General check for OAuth-related URLs
        let urlString = url.absoluteString
        let isOAuthUrl = urlString.contains("oauth") || 
                        urlString.contains("auth") || 
                        urlString.contains("google") || 
                        urlString.contains("token=") || 
                        urlString.contains("code=")
        
        if isOAuthUrl {
            print("📱 Detected potential OAuth URL")
            
            // Try with GoogleSignInHandler first (new implementation)
            if GoogleSignInHandler.shared.handleURL(url: url) {
                print("📱 URL successfully handled by GoogleSignInHandler")
                return true
            }
            
            // Then try with GoogleAuthService (legacy implementation)
            if GoogleAuthService.shared.handleURL(url) {
                print("📱 URL successfully handled by GoogleAuthService")
                return true
            }
            
            // Special handling for Supabase auth URLs with unusual formats
            if urlString.contains("access_token=") || urlString.contains("id_token=") || urlString.contains("error=") {
                print("📱 Detected auth callback URL with tokens or errors")
                
                var tokenParams: [String: String] = [:]
                
                // Extract common OAuth parameters
                for param in ["access_token", "refresh_token", "expires_in", "token_type", "id_token", "error", "error_description", "state"] {
                    if let value = extractParameter(from: urlString, param: param) {
                        tokenParams[param] = value
                        print("📱 Found parameter: \(param) = \(value)")
                    }
                }
                
                // Check for error parameters specifically
                if let error = tokenParams["error"] {
                    print("❌ Auth error detected: \(error)")
                    if let errorDesc = tokenParams["error_description"] {
                        print("❌ Error description: \(errorDesc)")
                    }
                    
                    // Log the error for debugging
                    let errorInfo = ["error": error, "error_description": tokenParams["error_description"] ?? ""]
                    NotificationCenter.default.post(
                        name: Notification.Name("GoogleSignInError"),
                        object: nil,
                        userInfo: errorInfo
                    )
                }
                
                // Check if we have any tokens to process
                if let accessToken = tokenParams["access_token"] ?? tokenParams["id_token"] {
                    print("📱 Successfully extracted auth tokens from URL")
                    
                    // Store tokens in JavaScript localStorage for recovery in case of redirect errors
                    // This allows the AuthCallback component to recover the session if needed
                    if let accessToken = tokenParams["access_token"] {
                        print("📱 Storing access_token in localStorage for recovery")
                        storeInLocalStorage(key: "ios_access_token", value: accessToken)
                    }
                    
                    if let idToken = tokenParams["id_token"] {
                        print("📱 Storing id_token in localStorage for recovery")
                        storeInLocalStorage(key: "ios_id_token", value: idToken)
                    }
                    
                    if let refreshToken = tokenParams["refresh_token"] {
                        print("📱 Storing refresh_token in localStorage for recovery")
                        storeInLocalStorage(key: "ios_refresh_token", value: refreshToken)
                    }
                    
                    // Store timestamp for debugging
                    let timestamp = Date().ISO8601Format()
                    storeInLocalStorage(key: "ios_token_timestamp", value: timestamp)
                    
                    // Build a proper callback URL with all available parameters
                    var callbackParams = [String]()
                    for (key, value) in tokenParams {
                        callbackParams.append("\(key)=\(value)")
                    }
                    
                    let callbackUrl = "introgy://auth/callback?\(callbackParams.joined(separator: "&"))"
                    print("📱 Constructed callback URL: \(callbackUrl)")
                    
                    if let properUrl = URL(string: callbackUrl) {
                        // Let Capacitor handle this properly formatted URL
                        return ApplicationDelegateProxy.shared.application(app, open: properUrl, options: options)
                    } else {
                        print("❌ Failed to create URL from: \(callbackUrl)")
                        
                        // Even if we can't create the URL, we've stored the tokens for recovery
                        // So we can still redirect to the callback page manually
                        if let appUrl = URL(string: "introgy://auth/callback?recovery=true") {
                            print("📱 Redirecting to recovery URL")
                            return ApplicationDelegateProxy.shared.application(app, open: appUrl, options: options)
                        }
                    }
                }
            }
            
            // If we've gotten this far, it's an OAuth URL that we don't know how to handle
            // directly, but we should still notify the JS layer
            print("📱 OAuth URL not handled natively, notifying Capacitor")
            NotificationCenter.default.post(
                name: NSNotification.Name("CAPNotificationOpenURL"),
                object: nil,
                userInfo: ["url": url]
            )
        }
        
        // Then let Capacitor handle the rest
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }
    
    // Helper function to store values in JavaScript localStorage via Capacitor
    private func storeInLocalStorage(key: String, value: String) {
        // Create a JavaScript snippet to store the value
        let jsCode = "localStorage.setItem('\(key)', '\(value)');"
        
        // Execute the JavaScript in the WebView via Capacitor
        DispatchQueue.main.async {
            if let rootViewController = UIApplication.shared.windows.first?.rootViewController as? CAPBridgeViewController {
                rootViewController.webView?.evaluateJavaScript(jsCode) { (result, error) in
                    if let error = error {
                        print("❌ Error storing in localStorage: \(error.localizedDescription)")
                    } else {
                        print("✅ Successfully stored \(key) in localStorage")
                    }
                }
            } else {
                print("❌ Could not access WebView to store in localStorage")
            }
        }
    }
    
    private func extractParameter(from urlString: String, param: String) -> String? {
        // First try to extract from URL components if possible
        if let url = URL(string: urlString), let components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
            if let queryItems = components.queryItems {
                if let value = queryItems.first(where: { $0.name == param })?.value {
                    print("📱 Extracted parameter using URLComponents: \(param) = \(value)")
                    return value
                }
            }
            
            // Also check fragment for SPA-style parameters
            if let fragment = components.fragment {
                let fragmentParams = fragment.components(separatedBy: "&")
                for fragmentParam in fragmentParams {
                    let parts = fragmentParam.components(separatedBy: "=")
                    if parts.count == 2 && parts[0] == param {
                        print("📱 Extracted parameter from fragment: \(param) = \(parts[1])")
                        return parts[1]
                    }
                }
            }
        }
        
        // Fallback to manual string parsing
        guard let range = urlString.range(of: "\(param)=") else {
            return nil
        }
        
        let start = range.upperBound
        let remaining = urlString[start...]
        
        if let end = remaining.range(of: "&")?.lowerBound {
            let value = String(remaining[..<end])
            print("📱 Extracted parameter using string parsing: \(param) = \(value)")
            return value
        } else {
            let value = String(remaining)
            print("📱 Extracted parameter using string parsing (end of string): \(param) = \(value)")
            return value
        }
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
