
import Foundation
import Capacitor
import UIKit

@objc(GoogleAuthPlugin)
public class GoogleAuthPlugin: CAPPlugin {
    
    override public func load() {
        // Configure Google Auth when the plugin loads
        GoogleAuthService.shared.configure()
    }
    
    @objc func signIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let viewController = self.bridge?.viewController else {
                call.reject("Could not find a view controller to present sign-in UI")
                return
            }
            
            GoogleAuthService.shared.signIn(presentingViewController: viewController) { result in
                switch result {
                case .success(let response):
                    call.resolve(response)
                case .failure(let error):
                    call.reject(error.localizedDescription, nil, error)
                }
            }
        }
    }
    
    @objc func signInWithSupabase(_ call: CAPPluginCall) {
        self.signIn(call)
    }
    
    @objc func signOut(_ call: CAPPluginCall) {
        GoogleAuthService.shared.signOut()
        call.resolve(["success": true])
    }
    
    @objc func disconnect(_ call: CAPPluginCall) {
        GoogleAuthService.shared.disconnect { error in
            if let error = error {
                call.reject(error.localizedDescription, nil, error)
            } else {
                call.resolve(["success": true])
            }
        }
    }
    
    @objc func isSignedIn(_ call: CAPPluginCall) {
        let isSignedIn = GIDSignIn.sharedInstance.hasPreviousSignIn()
        call.resolve(["isSignedIn": isSignedIn])
    }
    
    @objc func getCurrentUser(_ call: CAPPluginCall) {
        if !GIDSignIn.sharedInstance.hasPreviousSignIn() {
            call.resolve(["isSignedIn": false])
            return
        }
        
        guard let currentUser = GIDSignIn.sharedInstance.currentUser else {
            call.resolve(["isSignedIn": false])
            return
        }
        
        var response: [String: Any] = ["isSignedIn": true]
        
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
