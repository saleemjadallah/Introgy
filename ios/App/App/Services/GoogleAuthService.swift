
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
        
        // Check for previous sign-in
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            print("📱 Found previous Google Sign-In session")
            restoreSignInState()
        } else {
            print("📱 No previous Google Sign-In session found")
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
            self.notifyJavaScript(user: user)
        }
    }
    
    /// Handles sign-in with the standard Google Sign-In UI
    func signIn(presentingViewController: UIViewController, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { signInResult, error in
            if let error = error {
                print("❌ Google Sign-In error: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let result = signInResult else {
                let error = NSError(domain: "GoogleAuthService", code: -1, 
                                   userInfo: [NSLocalizedDescriptionKey: "No result returned from Google Sign-In"])
                completion(.failure(error))
                return
            }
            
            let response = self.createResponseDictionary(from: result.user)
            completion(.success(response))
        }
    }
    
    /// Notifies JavaScript layer about sign-in state
    private func notifyJavaScript(user: GIDGoogleUser) {
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
            
            if let photoLargeUrl = profile.imageURL(withDimension: 320)?.absoluteString {
                response["photoUrlLarge"] = photoLargeUrl
            }
        }
        
        return response
    }
    
    /// Signs out the current user
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        print("📱 Signed out from Google")
    }
    
    /// Disconnects the app from the user's Google account
    func disconnect(completion: @escaping (Error?) -> Void) {
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
    
    /// Handles a URL opened by the application
    func handleURL(_ url: URL) -> Bool {
        print("📱 GoogleAuthService handling URL: \(url)")
        return GIDSignIn.sharedInstance.handle(url)
    }
}
