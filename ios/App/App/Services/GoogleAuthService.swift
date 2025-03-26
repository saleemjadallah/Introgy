import Foundation
import GoogleSignIn
import Capacitor

/// Handles Google Sign-In operations
class GoogleAuthService {
    
    /// Shared instance for singleton access
    static let shared = GoogleAuthService()
    
    private init() {}
    
    /// Configures Google Sign-In with client ID from Info.plist
    func configure() {
        guard let clientID = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String else {
            print("❌ Error: GIDClientID not found in Info.plist")
            return
        }
        
        print("📱 Configuring Google Sign-In with client ID: \(clientID)")
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        
        // Verify URL scheme is properly configured
        validateURLScheme()
        
        // Check for previous sign-in
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            print("📱 Found previous Google Sign-In session")
            restoreSignInState()
        } else {
            print("📱 No previous Google Sign-In session found")
        }
    }
    
    /// Validates that the URL scheme is properly configured
    private func validateURLScheme() {
        guard let clientID = GIDSignIn.sharedInstance.configuration?.clientID else {
            print("❌ No client ID configured")
            return
        }
        
        // For Google Sign-In, we need to ensure the proper URL scheme is registered
        // The expected format is "com.googleusercontent.apps.[CLIENT_ID]"
        let reversedClientID = "com.googleusercontent.apps.\(clientID)"
        
        print("📱 Checking for URL scheme: \(reversedClientID)")
        
        // Check if the URL scheme is registered in Info.plist
        var schemeFound = false
        if let urlTypes = Bundle.main.object(forInfoDictionaryKey: "CFBundleURLTypes") as? [[String: Any]] {
            for urlType in urlTypes {
                if let schemes = urlType["CFBundleURLSchemes"] as? [String] {
                    for scheme in schemes {
                        if scheme.hasPrefix("com.googleusercontent.apps") {
                            schemeFound = true
                            print("✅ Valid URL scheme found: \(scheme)")
                            break
                        }
                    }
                }
                if schemeFound { break }
            }
        }
        
        if !schemeFound {
            print("⚠️ WARNING: URL scheme for Google Sign-In not configured correctly")
            print("⚠️ Expected scheme: \(reversedClientID)")
            print("❌ Authentication will likely fail without the proper URL scheme registered")
        } else {
            print("✅ Google Sign-In URL scheme validation successful")
        }
    }
    
    /// Restores previous sign-in state
    func restoreSignInState() {
        GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
            if let error = error {
                print("❌ Failed to restore Google Sign-In: \(error.localizedDescription)")
                return
            }
            
            guard let user = user else {
                print("⚠️ No user returned from restorePreviousSignIn")
                return
            }
            
            print("✅ Successfully restored Google Sign-In session")
            self.sendSignInNotification(user: user)
        }
    }
    
    /// Notifies JavaScript layer about sign-in state
    private func sendSignInNotification(user: GIDGoogleUser) {
        guard let idToken = user.idToken?.tokenString else {
            print("⚠️ No ID token found in restored session")
            return
        }
        
        let response = createResponseDictionary(from: user)
        
        // Post a notification to notify the JS layer
        NotificationCenter.default.post(
            name: Notification.Name("GoogleSignInRestored"),
            object: nil,
            userInfo: ["userInfo": response]
        )
    }
    
    /// Creates a response dictionary from a Google user
    private func createResponseDictionary(from user: GIDGoogleUser) -> [String: Any] {
        var response: [String: Any] = [:]
        
        if let idToken = user.idToken?.tokenString {
            response["idToken"] = idToken
        }
        
        response["accessToken"] = user.accessToken.tokenString
        response["userId"] = user.userID ?? ""
        
        // Add profile information if available
        if let profile = user.profile {
            response["email"] = profile.email ?? ""
            response["displayName"] = profile.name ?? ""
            response["givenName"] = profile.givenName ?? ""
            response["familyName"] = profile.familyName ?? ""
            
            if let photoUrl = profile.imageURL(withDimension: 96)?.absoluteString {
                response["photoUrl"] = photoUrl
            }
        }
        
        return response
    }
    
    /// Handles sign-in with the standard Google Sign-In UI
    func signIn(presentingViewController: UIViewController, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        print("📱 Starting Google Sign-In flow with presenting view controller: \(presentingViewController)")
        
        // Log the configuration being used
        if let clientID = GIDSignIn.sharedInstance.configuration?.clientID {
            print("📱 Using client ID: \(clientID)")
        } else {
            print("❌ No client ID configured for Google Sign-In")
        }
        
        // Perform sign-in with additional logging
        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { signInResult, error in
            if let error = error {
                // Enhanced error logging
                let nsError = error as NSError
                print("❌ Google Sign-In error: \(error.localizedDescription)")
                print("❌ Error domain: \(nsError.domain), code: \(nsError.code)")
                if let underlyingError = nsError.userInfo[NSUnderlyingErrorKey] as? NSError {
                    print("❌ Underlying error: \(underlyingError.localizedDescription)")
                }
                
                completion(.failure(error))
                return
            }
            
            guard let result = signInResult else {
                let error = NSError(domain: "GoogleAuthService", code: -1, 
                                  userInfo: [NSLocalizedDescriptionKey: "No result returned from Google Sign-In"])
                print("❌ No sign-in result returned")
                completion(.failure(error))
                return
            }
            
            print("✅ Google Sign-In successful!")
            let response = self.createResponseDictionary(from: result.user)
            completion(.success(response))
        }
    }
    
    /// Handles a URL opened by the application
    func handleURL(_ url: URL) -> Bool {
        let urlString = url.absoluteString
        print("📱 GoogleAuthService handling URL: \(urlString)")
        
        // Log detailed URL components for debugging
        print("📱 URL scheme: \(url.scheme ?? "none")")
        print("📱 URL host: \(url.host ?? "none")")
        print("📱 URL path: \(url.path)")
        if let query = url.query {
            print("📱 URL query: \(query)")
        }
        if let fragment = URLComponents(url: url, resolvingAgainstBaseURL: false)?.fragment {
            print("📱 URL fragment: \(fragment)")
        }
        
        // First, check if this matches our expected redirect URL format exactly
        let expectedScheme = "com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2"
        if url.scheme == expectedScheme {
            print("✅ URL matches our expected Google Sign-In scheme exactly")
            
            // Check if it's the oauth2redirect path
            if url.path == "/oauth2redirect" {
                print("✅ URL matches our expected oauth2redirect path")
            }
            
            // Let GIDSignIn try to handle it
            let handled = GIDSignIn.sharedInstance.handle(url)
            print("📱 Google Sign-In handled URL: \(handled)")
            
            // Even if GIDSignIn didn't handle it, we should still return true
            // to indicate that we're handling this URL type
            return true
        }
        
        // Check for any Google Sign-In URL with the googleusercontent prefix
        if let scheme = url.scheme, scheme.hasPrefix("com.googleusercontent.apps") {
            print("📱 URL matches Google Sign-In scheme pattern")
            let handled = GIDSignIn.sharedInstance.handle(url)
            print("📱 Google Sign-In handled URL: \(handled)")
            return true
        }
        
        // Look for OAuth2 token responses that might not match the Google scheme
        if urlString.contains("access_token=") || urlString.contains("id_token=") || 
           urlString.contains("error=") || urlString.contains("code=") {
            print("📱 Found URL with OAuth tokens or parameters")
            
            // Try to handle with GIDSignIn first
            let handled = GIDSignIn.sharedInstance.handle(url)
            if handled {
                print("✅ OAuth URL successfully handled by Google Sign-In")
                return true
            } else {
                // Check for error parameters
                if urlString.contains("error=") {
                    print("❌ OAuth URL contains error parameter")
                    // Extract error information
                    if let errorRange = urlString.range(of: "error=") {
                        let start = errorRange.upperBound
                        let remaining = urlString[start...]
                        
                        if let end = remaining.range(of: "&")?.lowerBound {
                            let errorValue = String(remaining[..<end])
                            print("❌ Error value: \(errorValue)")
                        } else {
                            let errorValue = String(remaining)
                            print("❌ Error value: \(errorValue)")
                        }
                    }
                }
                
                print("📱 OAuth URL not handled by Google Sign-In, will be processed by Capacitor")
                return false
            }
        }
        
        print("⚠️ URL does not appear to be a Google auth callback")
        return false
    }
}
