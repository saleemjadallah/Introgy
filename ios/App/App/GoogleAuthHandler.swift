import Foundation
import GoogleSignIn
import Capacitor

@objc public class GoogleAuthHandler: NSObject {
    static let shared = GoogleAuthHandler()
    
    private override init() {
        super.init()
        print("📱 GoogleAuthHandler initialized")
    }
    
    // Configure Google Sign-In
    @objc public func configure() {
        print("📱 Configuring GoogleAuthHandler")
        
        // Get client ID from GoogleService-Info.plist
        guard let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
              let dict = NSDictionary(contentsOfFile: path),
              let clientID = dict["CLIENT_ID"] as? String else {
            print("❌ Failed to read CLIENT_ID from GoogleService-Info.plist")
            return
        }
        
        // Set up the correct redirect URL using REVERSED_CLIENT_ID from GoogleService-Info.plist
        guard let reversedClientID = dict["REVERSED_CLIENT_ID"] as? String else {
            print("❌ Failed to read REVERSED_CLIENT_ID from GoogleService-Info.plist")
            return
        }
        
        let redirectURL = "\(reversedClientID):/oauth2redirect"
        print("📱 Using redirect URL: \(redirectURL)")
        
        // Store for debugging and reference
        UserDefaults.standard.set(redirectURL, forKey: "google_redirect_url")
        UserDefaults.standard.set(clientID, forKey: "google_ios_client_id")
        
        print("📱 Configured with Client ID from GoogleService-Info.plist: \(clientID)")
        
        // Note: We'll use a different approach to force in-app browser
        // The KVC approach is not reliable and can cause crashes
        print("🔒 Using AppDelegate's in-app browser implementation instead of direct SDK configuration")
    }
    
    // Perform Google Sign-In
    public func signIn(viewController: UIViewController, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        print("📱 Starting Google Sign-In process")
        
        // Get the iOS client ID (for native authentication)
        let iosClientID = UserDefaults.standard.string(forKey: "google_ios_client_id") ?? 
                          "308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com"
        
        // Create Google Sign-In configuration with the iOS client ID
        let config = GIDConfiguration(clientID: iosClientID)
        
        // Log the configuration for debugging
        print("📱 Using iOS client ID for native auth: \(config.clientID)")
        
        // Use the correct method signature for GIDSignIn
        GIDSignIn.sharedInstance.signIn(withPresenting: viewController) { signInResult, error in
            if let error = error {
                print("❌ Google Sign-In error: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let signInResult = signInResult else {
                print("❌ Google Sign-In failed: No result returned")
                completion(.failure(NSError(domain: "GoogleAuthHandler", code: 1, userInfo: [NSLocalizedDescriptionKey: "No result returned from Google Sign-In"])))
                return
            }
            
            guard let idToken = signInResult.user.idToken?.tokenString else {
                print("❌ Google Sign-In failed: No ID token found")
                completion(.failure(NSError(domain: "GoogleAuthHandler", code: 2, userInfo: [NSLocalizedDescriptionKey: "No ID token found"])))
                return
            }
            
            let accessToken = signInResult.user.accessToken.tokenString
            
            // Create token data dictionary to return
            let tokenData: [String: Any] = [
                "idToken": idToken,
                "accessToken": accessToken,
                "user": [
                    "email": signInResult.user.profile?.email ?? "",
                    "name": signInResult.user.profile?.name ?? "",
                    "id": signInResult.user.userID ?? ""
                ]
            ]
            
            print("✅ Google Sign-In successful")
            
            // Store tokens in UserDefaults for debugging
            UserDefaults.standard.set(idToken, forKey: "google_id_token")
            UserDefaults.standard.set(accessToken, forKey: "google_access_token")
            UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "google_auth_timestamp")
            
            completion(.success(tokenData))
        }
    }
    
    // Objective-C compatible version that uses a callback with dictionaries
    @objc public func signInWithViewController(_ viewController: UIViewController, completion: @escaping ([String: Any]?, Error?) -> Void) {
        print("📱 Starting Google Sign-In process (Obj-C compatible method)")
        
        self.signIn(viewController: viewController) { result in
            switch result {
            case .success(let tokenData):
                completion(tokenData, nil)
            case .failure(let error):
                completion(nil, error)
            }
        }
    }
    
    // Handle incoming URLs for Google Sign-In
    @objc public func handleURL(url: URL) -> Bool {
        print("📱 GoogleAuthHandler: Processing URL: \(url.absoluteString)")
        
        // Log URL components for debugging
        if let components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
            print("📱 URL scheme: \(components.scheme ?? "none")")
            print("📱 URL host: \(components.host ?? "none")")
            print("📱 URL path: \(components.path)")
            
            if let queryItems = components.queryItems {
                for item in queryItems {
                    print("📱 Query item: \(item.name) = \(item.value ?? "nil")")
                }
            }
            
            // Check for error in URL
            if components.path.contains("error") || url.absoluteString.contains("error") {
                print("❌ Error detected in URL: \(url.absoluteString)")
                
                // Check for "requested path is invalid" error
                if url.absoluteString.contains("requested path is invalid") {
                    print("❌ Detected 'requested path is invalid' error - this is likely due to a misconfigured redirect URL")
                    
                    // Notify that we're handling this error
                    NotificationCenter.default.post(
                        name: Notification.Name("GoogleAuthError"),
                        object: nil,
                        userInfo: ["error": "requested path is invalid", "url": url.absoluteString]
                    )
                    
                    // We're handling this error
                    return true
                }
            }
        }
        
        // First try the standard Google Sign-In handler
        if GIDSignIn.sharedInstance.handle(url) {
            print("📱 URL handled by Google Sign-In SDK")
            return true
        }
        
        // Special case for Supabase callback URLs
        if url.absoluteString.contains("supabase.co") {
            print("📱 Detected Supabase callback URL")
            
            // Extract any error information
            if url.absoluteString.contains("error") {
                print("❌ Error in Supabase callback: \(url.absoluteString)")
                
                // Notify about the error
                NotificationCenter.default.post(
                    name: Notification.Name("GoogleAuthError"),
                    object: nil,
                    userInfo: ["error": "Supabase callback error", "url": url.absoluteString]
                )
                
                return true
            }
            
            // This is a successful callback
            print("✅ Successful Supabase callback")
            return true
        }
        
        // If the standard handler doesn't work, try to extract tokens manually
        // This is for handling the redirect from Supabase
        if url.absoluteString.contains("oauth2redirect") || 
           url.absoluteString.contains("callback") || 
           url.absoluteString.contains("auth/v1") {
            
            print("📱 Attempting to handle OAuth redirect manually")
            
            // Extract tokens from URL
            if let components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
                // Check for tokens in query parameters
                if let queryItems = components.queryItems {
                    for item in queryItems {
                        if item.name == "id_token" || item.name == "access_token" {
                            print("📱 Found token in URL query: \(item.name)")
                            return true
                        }
                    }
                }
                
                // Check for tokens in fragment
                if let fragment = components.fragment {
                    if fragment.contains("id_token=") || fragment.contains("access_token=") {
                        print("📱 Found token in URL fragment")
                        return true
                    }
                }
            }
        }
        
        print("📱 URL not handled by GoogleAuthHandler")
        return false
    }
}
