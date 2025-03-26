
import UIKit
import Capacitor
import GoogleSignIn
import AuthenticationServices

enum Handlers {}
    // This is a wrapper class for handling Google Sign-In with Supabase integration
@objc class GoogleSignInHandler: NSObject {
    
    // Singleton instance
    @objc static let shared = GoogleSignInHandler()
    
    // Save the callback for async operations
    private var signInCompletion: ((Result<[String: Any], Error>) -> Void)? = nil
    
    // Configure Google Sign-In
    @objc func configure() {
        // Use the client ID from GoogleAuthConfig for consistency
        let clientID = GoogleAuthConfig.clientID
        print("📱 Configuring Google Sign-In with iOS client ID: \(clientID)")
        
        // Configure Google Sign-In
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        
        // Check if we have a previous sign-in
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            print("📱 Found previous Google Sign-In session")
            restoreSignInState()
        } else {
            print("📱 No previous Google Sign-In session found")
        }
    }
    
    // Restore sign-in state and notify the JavaScript layer
    func restoreSignInState() {
        // Only try to restore if we have a previous sign-in
        if !GIDSignIn.sharedInstance.hasPreviousSignIn() {
            print("⚠️ No previous Google Sign-In session to restore")
            // Notify JS layer about no session to prevent loading indefinitely
            NotificationCenter.default.post(
                name: Notification.Name("GoogleSignInRestorationFailed"),
                object: nil,
                userInfo: ["error": "No previous sign-in"]
            )
            return
        }
        
        GIDSignIn.sharedInstance.restorePreviousSignIn { [weak self] user, error in
            guard self != nil else { return }
            
            if let error = error {
                print("❌ Failed to restore Google Sign-In: \(error.localizedDescription)")
                // Notify JS layer about the failure to prevent loading indefinitely
                NotificationCenter.default.post(
                    name: Notification.Name("GoogleSignInRestorationFailed"),
                    object: nil,
                    userInfo: ["error": error.localizedDescription]
                )
                return
            }
            
            guard let user = user else {
                print("⚠️ No user returned from restorePreviousSignIn")
                // Notify JS layer about no user to prevent loading indefinitely
                NotificationCenter.default.post(
                    name: Notification.Name("GoogleSignInRestorationFailed"),
                    object: nil,
                    userInfo: ["error": "No user returned"]
                )
                return
            }
            
            print("✅ Successfully restored previous Google Sign-In session")
            guard let idToken = user.idToken?.tokenString else {
                print("⚠️ No ID token found in restored session")
                return
            }
            
            let userId = user.userID ?? ""
            let email = user.profile?.email ?? ""
            let name = user.profile?.name ?? ""
            
            print("📱 Successfully restored Google Sign-In session")
            print("Restored user: \(email)")
            
            // Create a response dictionary with the tokens and user info
            let response: [String: String] = [
                "idToken": idToken,
                "accessToken": user.accessToken.tokenString,
                "userId": userId,
                "email": email,
                "name": name,
                "givenName": user.profile?.givenName ?? "",
                "familyName": user.profile?.familyName ?? ""
            ]
            
            // Post a notification to notify the JS layer
            NotificationCenter.default.post(
                name: Notification.Name("GoogleSignInRestored"),
                object: nil,
                userInfo: ["userInfo": response]
            )
        }
    }
    
    // Sign in with Google and get tokens
    func signIn(viewController: UIViewController, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        self.signInCompletion = completion
        
        // Start Google Sign-In flow
        GIDSignIn.sharedInstance.signIn(withPresenting: viewController) { [weak self] result, error in
            guard let self = self else { return }
            
            if let error = error {
                print("❌ Google Sign-In error: \(error.localizedDescription)")
                self.signInCompletion?(.failure(error))
                self.signInCompletion = nil
                return
            }
            
            guard let result = result else {
                let error = NSError(domain: "GoogleSignInHandler", code: -1, userInfo: [NSLocalizedDescriptionKey: "No result returned from Google Sign-In"])
                self.signInCompletion?(.failure(error))
                self.signInCompletion = nil
                return
            }
            
            self.handleSignInResult(result)
        }
    }
    
    private func handleSignInResult(_ result: GIDSignInResult) {
        print("📱 Handling Google Sign-In result")
        
        guard let idToken = result.user.idToken?.tokenString else {
            let error = NSError(domain: "GoogleSignInHandler", code: -2, userInfo: [NSLocalizedDescriptionKey: "No ID token found"])
            self.signInCompletion?(.failure(error))
            self.signInCompletion = nil
            return
        }
        
        // Get user info
        let userId = result.user.userID ?? ""
        let email = result.user.profile?.email ?? ""
        let name = result.user.profile?.name ?? ""
        let givenName = result.user.profile?.givenName ?? ""
        let familyName = result.user.profile?.familyName ?? ""
        
        // Create response dictionary
        let response: [String: Any] = [
            "idToken": idToken,
            "accessToken": result.user.accessToken.tokenString,
            "userId": userId,
            "email": email,
            "displayName": name,
            "givenName": givenName,
            "familyName": familyName,
            "success": true
        ]
        
        print("📱 Google Sign-In successful")
        print("User ID: \(userId)")
        print("Email: \(email)")
        print("Name: \(name)")
        
        // Return the response
        self.signInCompletion?(.success(response))
        self.signInCompletion = nil
    }
    
    // Sign out from Google
    @objc func signOut() {
        GIDSignIn.sharedInstance.signOut()
        print("📱 Signed out from Google")
    }
    
    // Disconnect Google account
    @objc func disconnect(completion: @escaping (Error?) -> Void) {
        GIDSignIn.sharedInstance.disconnect { error in
            if let error = error {
                print("❌ Error disconnecting from Google: \(error.localizedDescription)")
                completion(error)
            } else {
                print("📱 Successfully disconnected from Google")
                completion(nil)
            }
        }
    }
    
    // MARK: - URL Handling
    
    // Handle callbacks from Google Sign-In
    func handleURL(url: URL) -> Bool {
        print("📱 GoogleSignInHandler.handleURL called with: \(url.absoluteString)")
        
        // Log detailed URL components for debugging
        print("📱 URL scheme: \(url.scheme ?? "none")")
        print("📱 URL host: \(url.host ?? "none")")
        print("📱 URL path: \(url.path)")
        if let query = url.query {
            print("📱 URL query: \(query)")
        }
        
        // First, check if this matches our expected redirect URL format exactly
        let expectedScheme = "com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2"
        if url.scheme == expectedScheme && url.host == nil && url.path == "/oauth2redirect" {
            print("✅ URL matches our expected redirect URL format exactly")
            // Let GIDSignIn try to handle it first
            let handled = GIDSignIn.sharedInstance.handle(url)
            if handled {
                print("✅ URL handled by Google Sign-In SDK")
                return true
            }
        }
        
        // Check if this is a Google Sign-In callback using the standard handler
        let handled = GIDSignIn.sharedInstance.handle(url)
        if handled {
            print("✅ URL handled by Google Sign-In SDK")
            return true
        }
        
        // Check for OAuth-related parameters in URLs not directly handled by GIDSignIn
        let urlString = url.absoluteString
        
        // Handle various OAuth scenarios
        if (urlString.contains("oauth2") || urlString.contains("googleusercontent")) ||
           (urlString.contains("token=") || urlString.contains("code=")) ||
           (urlString.contains("auth/callback") || urlString.contains("signin/callback")) {
            
            print("📱 Detected OAuth parameters in URL not handled by GIDSignIn")
            
            // Try to extract tokens from the URL
            if urlString.contains("id_token=") {
                if let idToken = extractTokenParam(from: urlString, param: "id_token") {
                    print("📱 Found ID token in URL, notifying JS layer")
                    
                    // Post notification for ID token in URL
                    NotificationCenter.default.post(
                        name: Notification.Name("GoogleSignInTokenFound"),
                        object: nil,
                        userInfo: ["idToken": idToken]
                    )
                    return true
                }
            }
            
            // Notify JS about the OAuth URL anyway so it can process it
            NotificationCenter.default.post(
                name: Notification.Name("GoogleSignInURLReceived"),
                object: nil,
                userInfo: ["url": urlString]
            )
            
            // Return true to indicate we're handling it
            return true
        }
        
        print("⚠️ URL not recognized as OAuth URL")
        return false
    }
    
    // Helper method to extract token parameters
    private func extractTokenParam(from urlString: String, param: String) -> String? {
        guard let range = urlString.range(of: "\(param)=") else {
            return nil
        }
        
        let start = range.upperBound
        let remaining = urlString[start...]
        
        if let end = remaining.range(of: "&")?.lowerBound {
            return String(remaining[..<end])
        } else {
            // If there's no trailing &, take the rest of the string
            return String(remaining)
        }
    }
    
    // MARK: - Methods required by GoogleAuthPlugin
    
    // Start the sign-in flow and handle the result
    func startSignIn(presentingViewController: UIViewController, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        print("📱 Starting Google Sign-In via startSignIn")
        signIn(viewController: presentingViewController, completion: completion)
    }
    
    // Specific method for Supabase sign-in
    func signInForSupabase(presentingViewController: UIViewController, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        print("📱 Starting Google Sign-In for Supabase")
        // This uses the same implementation as regular sign-in for now
        signIn(viewController: presentingViewController, completion: completion)
    }
    
    // Check if user is signed in
    func isSignedIn() -> Bool {
        return GIDSignIn.sharedInstance.hasPreviousSignIn()
    }
    
    // Refresh tokens if needed
    func refreshTokens(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let currentUser = GIDSignIn.sharedInstance.currentUser else {
            let error = NSError(domain: "GoogleSignInHandler", code: -3, userInfo: [NSLocalizedDescriptionKey: "No user signed in"])
            completion(.failure(error))
            return
        }
        
        currentUser.refreshTokensIfNeeded { user, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let user = user else {
                let error = NSError(domain: "GoogleSignInHandler", code: -4, userInfo: [NSLocalizedDescriptionKey: "Failed to refresh tokens"])
                completion(.failure(error))
                return
            }
            
            let accessToken = user.accessToken.tokenString
            
            var userData: [String: Any] = [
                "accessToken": accessToken,
                "success": true
            ]
            
            if let idToken = user.idToken?.tokenString {
                userData["idToken"] = idToken
            }
            
            completion(.success(userData))
        }
    }
    
    // Get current user information
    func getCurrentUser(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let currentUser = GIDSignIn.sharedInstance.currentUser else {
            let error = NSError(domain: "GoogleSignInHandler", code: -3, userInfo: [NSLocalizedDescriptionKey: "No user signed in"])
            completion(.failure(error))
            return
        }
        
        var userData: [String: Any] = [
            "accessToken": currentUser.accessToken.tokenString,
            "success": true
        ]
        
        if let idToken = currentUser.idToken?.tokenString {
            userData["idToken"] = idToken
        }
        
        if let profile = currentUser.profile {
            userData["displayName"] = profile.name ?? ""
            userData["email"] = profile.email ?? ""
            userData["userID"] = currentUser.userID ?? ""
            
            if let photoUrl = profile.imageURL(withDimension: 96)?.absoluteString {
                userData["photoUrl"] = photoUrl
            }
        }
        
        completion(.success(userData))
    }
}
