import Foundation
import Capacitor
import GoogleSignIn

@objc(GoogleSignInPlugin)
public class GoogleSignInPlugin: CAPPlugin {
    
    override public func load() {
        // Listen for Google Sign-In restoration events
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleSignInRestored(_:)),
            name: NSNotification.Name("GoogleSignInRestored"),
            object: nil
        )
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc func handleSignInRestored(_ notification: Notification) {
        // When a sign-in is restored, notify the JS layer
        if let userInfo = notification.userInfo?["userInfo"] as? [String: String] {
            // Send an event to JavaScript
            self.notifyListeners("signInRestored", data: [
                "user": userInfo
            ])
        }
    }
    
    @objc func signIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            GoogleSignInViewController.present(from: self.bridge?.viewController ?? UIViewController()) { result in
                switch result {
                case .success(let response):
                    // Create a dictionary with the token information
                    var resultData: [String: Any] = [:]
                    
                    // Add all token information to the result
                    for (key, value) in response {
                        resultData[key] = value
                    }
                    
                    // Return success to JavaScript
                    call.resolve(resultData)
                    
                case .failure(let error):
                    call.reject(error.localizedDescription, nil, error)
                }
            }
        }
    }
    
    @objc func checkSignInState(_ call: CAPPluginCall) {
        // Check if the user is already signed in with Google
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            // Try to restore the previous sign-in
            GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
                if let error = error {
                    call.reject("Error checking sign-in state: \(error.localizedDescription)")
                    return
                }
                
                if let user = user, let idToken = user.idToken?.tokenString {
                    // User is signed in, return user info
                    var userData: [String: Any] = [
                        "isSignedIn": true,
                        "idToken": idToken,
                        "accessToken": user.accessToken.tokenString
                    ]
                    
                    // Add profile info if available
                    if let profile = user.profile {
                        userData["email"] = profile.email
                        userData["displayName"] = profile.name
                        userData["givenName"] = profile.givenName
                        userData["familyName"] = profile.familyName
                        
                        if let photoUrl = profile.imageURL(withDimension: 96)?.absoluteString {
                            userData["photoUrl"] = photoUrl
                        }
                    }
                    
                    call.resolve(userData)
                } else {
                    // No user or ID token
                    call.resolve(["isSignedIn": false])
                }
            }
        } else {
            // No previous sign-in
            call.resolve(["isSignedIn": false])
        }
    }
    
    @objc func refresh(_ call: CAPPluginCall) {
        // Check if user is signed in
        guard GIDSignIn.sharedInstance.hasPreviousSignIn() else {
            call.reject("No user signed in")
            return
        }
        
        // Get current user
        guard let currentUser = GIDSignIn.sharedInstance.currentUser else {
            call.reject("No current user found")
            return
        }
        
        // Refresh tokens
        print("📱 Refreshing Google ID token")
        currentUser.refreshTokensIfNeeded { user, error in
            if let error = error {
                print("❌ Error refreshing Google tokens: \(error.localizedDescription)")
                call.reject("Failed to refresh tokens: \(error.localizedDescription)", nil, error)
                return
            }
            
            guard let user = user,
                  let idToken = user.idToken?.tokenString else {
                print("❌ No ID token after refresh")
                call.reject("Failed to get ID token after refresh")
                return
            }
            
            print("✅ Successfully refreshed Google tokens")
            let accessToken = user.accessToken.tokenString
            call.resolve([
                "idToken": idToken,
                "accessToken": accessToken
            ])
        }
    }
}
