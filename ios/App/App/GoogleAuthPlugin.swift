import Foundation
import Capacitor
import GoogleSignIn

// This is the main implementation of the GoogleAuthPlugin
// The @objc attribute ensures this class is visible to Objective-C
// IMPORTANT: This is the ONLY implementation of GoogleAuthPlugin
// The Objective-C files (.h and .m) only handle registration with Capacitor
@objc(GoogleAuthPlugin)
public class GoogleAuthPlugin: CAPPlugin {
    private let googleAuthHandler = GoogleAuthHandler.shared
    
    override public func load() {
        print("📱 GoogleAuthPlugin loaded")
        googleAuthHandler.configure()
        
        // Add notification observer for handling deep links
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleOpenURL),
            name: Notification.Name("CAPNotificationOpenURL"),
            object: nil
        )
        
        // Add observer for URL opening attempts to force in-app browser
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(interceptURLOpening),
            name: Notification.Name("CAPNotificationOpenExternalURL"),
            object: nil
        )
    }
    
    @objc func interceptURLOpening(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let url = userInfo["url"] as? URL else {
            return
        }
        
        print("🔒 GoogleAuthPlugin: Intercepting external URL opening: \(url.absoluteString)")
        
        // Check if this is a Google auth URL
        if url.absoluteString.contains("accounts.google.com") || 
           url.absoluteString.contains("oauth") || 
           url.absoluteString.contains("auth") {
            
            print("🔒 Preventing external browser for auth URL")
            
            // Get the AppDelegate to handle this with in-app browser
            if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
                appDelegate.presentInAppBrowser(for: url)
                
                // Mark as handled
                NotificationCenter.default.post(
                    name: Notification.Name("CAPNotificationOpenExternalURLResult"),
                    object: nil,
                    userInfo: ["handled": true]
                )
            }
        }
    }
    
    @objc func handleOpenURL(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let url = userInfo["url"] as? URL else {
            return
        }
        
        print("📱 GoogleAuthPlugin: Received URL notification: \(url.absoluteString)")
        
        // Check for errors in the URL
        if url.absoluteString.contains("error") {
            print("❌ Error detected in URL: \(url.absoluteString)")
            
            // Extract error message if possible
            var errorMessage = "Unknown error"
            if let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
               let queryItems = components.queryItems {
                for item in queryItems {
                    if item.name == "error" || item.name == "error_description" {
                        errorMessage = item.value ?? errorMessage
                        print("❌ Error detail: \(errorMessage)")
                    }
                }
            }
            
            // Notify JavaScript about the error
            self.notifyListeners("googleAuthError", data: ["error": errorMessage, "url": url.absoluteString])
        }
        
        // Let GoogleAuthHandler process the URL
        let handled = googleAuthHandler.handleURL(url: url)
        
        // Notify Capacitor if we handled this URL
        if handled {
            print("✅ URL handled by GoogleAuthPlugin")
            NotificationCenter.default.post(
                name: Notification.Name("CAPNotificationOpenURLResult"),
                object: nil,
                userInfo: ["handled": true]
            )
            
            // If this was a successful auth URL, notify JavaScript
            if !url.absoluteString.contains("error") && 
               (url.absoluteString.contains("token") || 
                url.absoluteString.contains("code") || 
                url.absoluteString.contains("oauth2redirect")) {
                self.notifyListeners("googleAuthSuccess", data: ["url": url.absoluteString])
            }
        }
    }
    
    @objc func signIn(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: signIn called from JavaScript")
        
        // Get the iOS client ID for native authentication
        let iosClientID = UserDefaults.standard.string(forKey: "google_ios_client_id") ?? 
                          "308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com"
        print("📱 Using iOS client ID for native auth: \(iosClientID)")
        
        // Store the client ID type being used
        UserDefaults.standard.set("ios", forKey: "google_client_id_type")
        
        // Get the redirect URL from the call if available
        let redirectUrl = call.getString("redirectUrl")
        if let redirectUrl = redirectUrl {
            print("📱 Using redirect URL from JS: \(redirectUrl)")
            UserDefaults.standard.set(redirectUrl, forKey: "google_redirect_url_js")
        }
        
        DispatchQueue.main.async {
            guard let viewController = self.bridge?.viewController else {
                call.reject("No view controller available")
                return
            }
            
            self.googleAuthHandler.signInWithViewController(viewController) { tokenData, error in
                if let error = error {
                    print("📱 GoogleAuthPlugin: Sign-in failed: \(error.localizedDescription)")
                    call.reject("Google Sign-In failed: \(error.localizedDescription)")
                    return
                }
                
                guard let tokenData = tokenData else {
                    call.reject("No token data returned")
                    return
                }
                
                print("📱 GoogleAuthPlugin: Sign-in successful, returning token data to JavaScript")
                
                // Notify JavaScript about successful sign-in
                self.notifyListeners("googleSignInComplete", data: [
                    "tokens": tokenData
                ])
                
                call.resolve(tokenData)
            }
        }
    }
    
    @objc func signInWithSupabase(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: signInWithSupabase called from JavaScript")
        
        // Get the web client ID for Supabase authentication
        let webClientID = UserDefaults.standard.string(forKey: "google_web_client_id") ?? 
                          "308656966304-ouvq7u7q9sms8rujjtqpevaqr120vdge.apps.googleusercontent.com"
        print("📱 Using web client ID for Supabase auth: \(webClientID)")
        
        // Store the client ID type being used
        UserDefaults.standard.set("web", forKey: "google_client_id_type")
        
        // Get the redirect URL from the call if available
        let redirectUrl = call.getString("redirectUrl")
        if let redirectUrl = redirectUrl {
            print("📱 Using redirect URL from JS for Supabase: \(redirectUrl)")
            UserDefaults.standard.set(redirectUrl, forKey: "google_redirect_url_supabase")
        }
        
        DispatchQueue.main.async {
            guard let viewController = self.bridge?.viewController else {
                call.reject("No view controller available")
                return
            }
            
            self.googleAuthHandler.signInWithViewController(viewController) { tokenData, error in
                if let error = error {
                    print("📱 GoogleAuthPlugin: Sign-in failed: \(error.localizedDescription)")
                    call.reject("Google Sign-In failed: \(error.localizedDescription)")
                    return
                }
                
                guard let tokenData = tokenData else {
                    call.reject("No token data returned")
                    return
                }
                
                print("📱 GoogleAuthPlugin: Sign-in successful, returning token data to JavaScript")
                
                // Extract tokens
                guard let idToken = tokenData["idToken"] as? String,
                      let accessToken = tokenData["accessToken"] as? String else {
                    call.reject("Missing token data")
                    return
                }
                
                // Format response for TypeScript interface
                let response: [String: Any] = [
                    "idToken": idToken,
                    "accessToken": accessToken
                ]
                
                // Notify JavaScript about successful sign-in
                self.notifyListeners("googleSignInTokenReceived", data: response)
                
                call.resolve(response)
            }
        }
    }
    
    @objc func signOut(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: signOut called from JavaScript")
        
        GIDSignIn.sharedInstance.signOut()
        
        // Clear stored tokens
        UserDefaults.standard.removeObject(forKey: "google_id_token")
        UserDefaults.standard.removeObject(forKey: "google_access_token")
        UserDefaults.standard.removeObject(forKey: "google_auth_timestamp")
        
        print("📱 GoogleAuthPlugin: Sign-out successful")
        call.resolve(["success": true])
    }
    
    @objc func refresh(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: refresh called from JavaScript")
        
        guard let currentUser = GIDSignIn.sharedInstance.currentUser else {
            print("❌ GoogleAuthPlugin: No signed-in user for refresh")
            call.reject("No signed-in user")
            return
        }
        
        print("📱 GoogleAuthPlugin: Refreshing tokens for user ID: \(currentUser.userID ?? "unknown")")
        
        currentUser.refreshTokensIfNeeded { user, error in
            if let error = error {
                print("❌ GoogleAuthPlugin: Token refresh failed: \(error.localizedDescription)")
                
                // Notify JavaScript of refresh failure
                self.notifyListeners("googleAuthRefreshFailure", data: ["error": error.localizedDescription])
                
                call.reject("Token refresh failed: \(error.localizedDescription)")
                return
            }
            
            guard let user = user,
                  let idToken = user.idToken?.tokenString else {
                call.reject("Failed to refresh tokens")
                return
            }
            
            let response: [String: Any] = [
                "idToken": idToken,
                "accessToken": user.accessToken.tokenString
            ]
            
            print("📱 GoogleAuthPlugin: Token refresh successful")
            call.resolve(response)
        }
    }
    
    @objc func isSignedIn(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: isSignedIn called from JavaScript")
        
        let currentUser = GIDSignIn.sharedInstance.currentUser
        let isSignedIn = currentUser != nil
        
        print("📱 GoogleAuthPlugin: isSignedIn = \(isSignedIn)")
        call.resolve(["isSignedIn": isSignedIn])
    }
    
    @objc func getCurrentUser(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: getCurrentUser called from JavaScript")
        
        guard let currentUser = GIDSignIn.sharedInstance.currentUser,
              let idToken = currentUser.idToken?.tokenString else {
            call.reject("No signed-in user or ID token not available")
            return
        }
        
        var response: [String: Any] = [
            "isSignedIn": true,
            "idToken": idToken,
            "accessToken": currentUser.accessToken.tokenString
        ]
        
        if let profile = currentUser.profile {
            response["email"] = profile.email
            response["displayName"] = profile.name
            response["givenName"] = profile.givenName
            response["familyName"] = profile.familyName
            response["photoUrl"] = profile.imageURL(withDimension: 96)?.absoluteString
            response["photoUrlLarge"] = profile.imageURL(withDimension: 256)?.absoluteString
            response["userId"] = currentUser.userID
        }
        
        print("📱 GoogleAuthPlugin: Returning current user data")
        call.resolve(response)
    }
    
    @objc func disconnect(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: disconnect called from JavaScript")
        
        // First sign out the user
        GIDSignIn.sharedInstance.signOut()
        
        // Then disconnect the user's Google account from the app
        GIDSignIn.sharedInstance.disconnect { error in
            if let error = error {
                print("📱 GoogleAuthPlugin: Disconnect failed: \(error.localizedDescription)")
                call.reject("Disconnect failed: \(error.localizedDescription)")
                return
            }
            
            // Clear stored tokens
            UserDefaults.standard.removeObject(forKey: "google_id_token")
            UserDefaults.standard.removeObject(forKey: "google_access_token")
            UserDefaults.standard.removeObject(forKey: "google_auth_timestamp")
            
            print("📱 GoogleAuthPlugin: Disconnect successful")
            call.resolve(["success": true])
        }
    }
    
    @objc func showGoogleSignInButton(_ call: CAPPluginCall) {
        // Instead of rejecting with UNIMPLEMENTED, we'll resolve with a message
        // This prevents the error in the logs while still using web-based approach
        print("📱 Google Sign-In button requested - using web-based approach instead")
        call.resolve(["message": "Using web-based Google Sign-In on iOS"])
    }
    
    @objc func getTokens(_ call: CAPPluginCall) {
        print("📱 GoogleAuthPlugin: getTokens called from JavaScript")
        
        guard let currentUser = GIDSignIn.sharedInstance.currentUser,
              let idToken = currentUser.idToken?.tokenString else {
            call.reject("No signed-in user or ID token not available")
            return
        }
        
        let accessToken = currentUser.accessToken.tokenString
        
        let response: [String: Any] = [
            "idToken": idToken,
            "accessToken": accessToken
        ]
        
        print("📱 GoogleAuthPlugin: Returning tokens to JavaScript")
        call.resolve(response)
    }
}
