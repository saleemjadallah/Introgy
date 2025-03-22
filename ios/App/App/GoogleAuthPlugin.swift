import Foundation
import Capacitor
import UIKit

@objc(GoogleAuthPlugin)
public class GoogleAuthPlugin: CAPPlugin {
    
    override public func load() {
        // Configure Google Sign-In when the plugin loads
        GoogleSignInHandler.shared.configure()
    }
    
    @objc func signIn(_ call: CAPPluginCall) {
        // Get the top view controller to present from
        guard let viewController = UIApplication.shared.keyWindow?.rootViewController?.topViewController() else {
            call.reject("Could not find a view controller to present sign-in UI")
            return
        }
        
        // Present the Google Sign-In view controller
        GoogleSignInViewController.present(from: viewController) { result in
            switch result {
            case .success(let tokens):
                call.resolve(tokens)
            case .failure(let error):
                call.reject(error.localizedDescription, nil, error)
            }
        }
    }
    
    @objc func signInWithSupabase(_ call: CAPPluginCall) {
        self.signIn(call)
    }
    
    @objc func signOut(_ call: CAPPluginCall) {
        // Check if user is signed in
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            // Get the top view controller to present from
            guard let viewController = UIApplication.shared.keyWindow?.rootViewController?.topViewController() else {
                // If we can't present UI, just sign out directly
                GIDSignIn.sharedInstance.signOut()
                call.resolve(["success": true])
                return
            }
            
            // Present the sign-out UI
            let showUI = call.getBool("showUI") ?? true
            
            if showUI {
                // Present the Google Sign-Out view controller
                GoogleSignOutViewController.present(from: viewController) { success, error in
                    if success {
                        call.resolve(["success": true])
                    } else if let error = error {
                        call.reject(error.localizedDescription, nil, error)
                    } else {
                        call.reject("User cancelled sign-out")
                    }
                }
            } else {
                // Sign out directly without UI
                GIDSignIn.sharedInstance.signOut()
                call.resolve(["success": true])
            }
        } else {
            // Not signed in
            call.resolve(["success": false, "message": "Not signed in"])
        }
    }
    
    @objc func disconnect(_ call: CAPPluginCall) {
        GoogleSignInHandler.shared.disconnect { success, error in
            if success {
                call.resolve()
            } else if let error = error {
                call.reject(error.localizedDescription, nil, error)
            } else {
                call.reject("Unknown error during disconnect")
            }
        }
    }
    
    @objc func isSignedIn(_ call: CAPPluginCall) {
        // Check if a previous Google sign-in still exists
        let isSignedIn = GIDSignIn.sharedInstance.hasPreviousSignIn()
        call.resolve(["isSignedIn": isSignedIn])
    }
    
    @objc func getCurrentUser(_ call: CAPPluginCall) {
        // Check if user is signed in
        guard GIDSignIn.sharedInstance.hasPreviousSignIn() else {
            call.resolve(["isSignedIn": false])
            return
        }
        
        // Get current user
        guard let currentUser = GIDSignIn.sharedInstance.currentUser else {
            call.resolve(["isSignedIn": false])
            return
        }
        
        // Create response with user information
        var response: [String: Any] = ["isSignedIn": true]
        
        // Add tokens
        if let idToken = currentUser.idToken?.tokenString {
            response["idToken"] = idToken
        }
        
        response["accessToken"] = currentUser.accessToken.tokenString
        
        // Add profile information
        if let profile = currentUser.profile {
            if let name = profile.name {
                response["displayName"] = name
            }
            
            if let email = profile.email {
                response["email"] = email
            }
            
            if let givenName = profile.givenName {
                response["givenName"] = givenName
            }
            
            if let familyName = profile.familyName {
                response["familyName"] = familyName
            }
            
            if let profilePictureURL = profile.imageURL(withDimension: 96)?.absoluteString {
                response["photoUrl"] = profilePictureURL
            }
            
            if let profilePictureLargeURL = profile.imageURL(withDimension: 320)?.absoluteString {
                response["photoUrlLarge"] = profilePictureLargeURL
            }
        }
        
        call.resolve(response)
    }
    
    @objc func refresh(_ call: CAPPluginCall) {
        guard let currentUser = GIDSignIn.sharedInstance.currentUser else {
            call.reject("No user signed in")
            return
        }
        
        currentUser.refreshTokensIfNeeded { user, error in
            if let error = error {
                call.reject(error.localizedDescription, nil, error)
                return
            }
            
            guard let user = user,
                  let idToken = user.idToken?.tokenString else {
                call.reject("Failed to refresh tokens")
                return
            }
            
            let accessToken = user.accessToken.tokenString
            call.resolve([
                "idToken": idToken,
                "accessToken": accessToken
            ])
        }
    }
}

// Extension to find the top-most view controller
extension UIViewController {
    func topViewController() -> UIViewController {
        if let presented = presentedViewController {
            return presented.topViewController()
        }
        if let tabBarController = self as? UITabBarController,
           let selected = tabBarController.selectedViewController {
            return selected.topViewController()
        }
        if let navigationController = self as? UINavigationController,
           let visible = navigationController.visibleViewController {
            return visible.topViewController()
        }
        return self
    }
}

// Extension for UIWindow to get the key window
extension UIApplication {
    var keyWindow: UIWindow? {
        return UIApplication.shared.windows.first { $0.isKeyWindow }
    }
}
