
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
    private var signInCompletion: ((Result<[String: String], Error>) -> Void)? = nil
    
    // Configure Google Sign-In
    @objc func configure() {
        // Use the iOS client ID for native authentication
        let clientID = "308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com"
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
        GIDSignIn.sharedInstance.restorePreviousSignIn { [weak self] user, error in
            guard let self = self else { return }
            
            if let error = error {
                print("❌ Failed to restore Google Sign-In: \(error.localizedDescription)")
                return
            }
            
            guard let user = user else {
                print("⚠️ No user returned from restorePreviousSignIn")
                return
            }
            
            // Get user info
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
    func signIn(viewController: UIViewController, completion: @escaping (Result<[String: String], Error>) -> Void) {
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
        let response: [String: String] = [
            "idToken": idToken,
            "accessToken": result.user.accessToken.tokenString,
            "userId": userId,
            "email": email,
            "name": name,
            "givenName": givenName,
            "familyName": familyName
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
}
