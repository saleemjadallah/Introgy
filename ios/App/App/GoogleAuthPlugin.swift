import Foundation
import Capacitor
import UIKit
import GoogleSignIn

@objc(GoogleAuthPlugin)
public class GoogleAuthPlugin: CAPPlugin {
    
    override public func load() {
        print("📱 GoogleAuthPlugin loaded")
        // Register plugin with the bridge for debugging
        CAPLog.print("GoogleAuthPlugin registered with Capacitor")
        
        // Initialize GoogleSignInHandler to ensure it's configured
        GoogleSignInHandler.shared.configure()
    }
    
    // Store the sign-in button as a property so it doesn't get deallocated
    private var googleSignInButton: GIDSignInButton? = nil
    
    @objc func showSignInButton(_ call: CAPPluginCall) {
        let workItem = DispatchWorkItem {
            // Get the view controller for presenting the sign-in UI
            guard let viewController = self.bridge?.viewController else {
                call.reject("Unable to access view controller")
                return
            }
            
            // Create and configure Google Sign-In button
            let signInButton = GIDSignInButton()
            signInButton.style = .wide
            signInButton.colorScheme = .light
            
            // Make button clearly visible and sized to match the verification code button
            signInButton.frame.size = CGSize(width: 280, height: 48) 
            
            // Add a distinctive border so it's more visible for testing
            signInButton.layer.borderWidth = 1.0
            signInButton.layer.borderColor = UIColor.blue.cgColor
            
            // Add the button to the view hierarchy
            signInButton.translatesAutoresizingMaskIntoConstraints = false
            viewController.view.addSubview(signInButton)
            
            let screenHeight = viewController.view.frame.height
            let buttonY = (screenHeight * 0.65) + 20 // Position just below the "OR CONTINUE WITH" text
            
            NSLayoutConstraint.activate([
                signInButton.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor),
                signInButton.topAnchor.constraint(equalTo: viewController.view.topAnchor, constant: buttonY),
                signInButton.widthAnchor.constraint(equalToConstant: 240),
                signInButton.heightAnchor.constraint(equalToConstant: 44)
            ])
            
            // Ensure button is clearly visible
            signInButton.layer.zPosition = 1000
            
            // Make button very prominent so we can see if it appears at all
            signInButton.layer.shadowColor = UIColor.black.cgColor
            signInButton.layer.shadowOffset = CGSize(width: 0, height: 3)
            signInButton.layer.shadowRadius = 5
            signInButton.layer.shadowOpacity = 0.3
            
            // Add a background color to make it easier to spot during testing
            signInButton.backgroundColor = UIColor(red: 0.95, green: 0.95, blue: 1.0, alpha: 1.0)
            
            // Add tap gesture to handle sign-in
            let tapGesture = UITapGestureRecognizer(target: self, action: #selector(self.handleSignInButtonTap))
            signInButton.addGestureRecognizer(tapGesture)
            signInButton.isUserInteractionEnabled = true
            
            // Store the button so it doesn't get deallocated
            self.googleSignInButton = signInButton
            
            // Store the call for reference when the sign-in completes
            self.savedCall = call
            call.resolve()
            
            // Setup keyboard notifications to adjust button position when keyboard shows/hides
            NotificationCenter.default.addObserver(self, 
                                               selector: #selector(self.keyboardWillShow), 
                                               name: UIResponder.keyboardWillShowNotification, 
                                               object: nil)
            NotificationCenter.default.addObserver(self, 
                                               selector: #selector(self.keyboardWillHide), 
                                               name: UIResponder.keyboardWillHideNotification, 
                                               object: nil)
        }
        DispatchQueue.main.async(execute: workItem)
    }
    
    // Track keyboard height to adjust button position
    private var keyboardHeight: CGFloat = 0
    
    @objc private func keyboardWillShow(notification: NSNotification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            let keyboardRectangle = keyboardFrame.cgRectValue
            keyboardHeight = keyboardRectangle.height
            
            // Reposition button if needed
            if let button = googleSignInButton, let viewController = self.bridge?.viewController {
                let visibleHeight = viewController.view.frame.height - keyboardHeight
                let targetPosition = visibleHeight * 0.55 // Move up a bit when keyboard is showing
                
                button.frame.origin.y = targetPosition
            }
        }
    }
    
    @objc private func keyboardWillHide(notification: NSNotification) {
        keyboardHeight = 0
        
        // Reposition button if needed
        if let button = googleSignInButton, let viewController = self.bridge?.viewController {
            let visibleHeight = viewController.view.frame.height
            let targetPosition = visibleHeight * 0.65 // Back to regular position
            
            button.frame.origin.y = targetPosition
        }
    }
    
    // Property to store the plugin call for resolving after sign-in completes
    private var savedCall: CAPPluginCall? = nil
    
    @objc private func handleSignInButtonTap() {
        // Use a simple function call instead of async dispatch since we're already on main thread
        self.performSignIn()
    }
    
    private func performSignIn() {
        guard let viewController = self.bridge?.viewController else { return }
        
        // Log detailed information for debugging
        print("📱 Current view controller: \(viewController)")
        
        // Start the sign-in process using GIDSignIn directly
        let workItem = DispatchWorkItem {
            GIDSignIn.sharedInstance.signIn(withPresenting: viewController) { signInResult, error in
                if let error = error {
                    print("📱 Google Sign-In error: \(error.localizedDescription)")
                    self.savedCall?.reject(error.localizedDescription, nil, error)
                    return
                }
                
                guard let signInResult = signInResult else {
                    print("📱 No sign-in result returned from Google Sign-In")
                    self.savedCall?.reject("No sign-in result")
                    return
                }
                
                // Access the user and tokens
                let accessToken = signInResult.user.accessToken.tokenString
                
                guard let idToken = signInResult.user.idToken?.tokenString else {
                    print("📱 No ID token returned from Google Sign-In")
                    self.savedCall?.reject("Failed to get ID token")
                    return
                }
                
                var response: [String: Any] = [
                    "accessToken": accessToken,
                    "idToken": idToken,
                    "success": true
                ]
                
                if let profile = signInResult.user.profile {
                    response["displayName"] = profile.name ?? ""
                    response["email"] = profile.email ?? ""
                    response["userID"] = signInResult.user.userID
                }
                
                self.savedCall?.resolve(response)
            }
        }
        DispatchQueue.main.async(execute: workItem)
    }
    
    @objc func signIn(_ call: CAPPluginCall) {
        print("📱 signIn method called from JavaScript")
        // Delegate to the GoogleSignInHandler for consistent implementation
        self.delegateToHandler(call: call)
    }
    
    private func delegateToHandler(call: CAPPluginCall) {
        guard let viewController = self.bridge?.viewController else {
            call.reject("Could not find a view controller to present sign-in UI")
            return
        }
        
        print("📱 Delegating to GoogleSignInHandler for sign-in")
        
        // Use the GoogleSignInHandler to handle the sign-in process
        GoogleSignInHandler.shared.startSignIn(presentingViewController: viewController) { result in
            switch result {
            case .success(let userData):
                print("📱 Google Sign-In successful via handler")
                call.resolve(userData)
                
            case .failure(let error):
                print("📱 Google Sign-In error via handler: \(error.localizedDescription)")
                call.reject(error.localizedDescription)
            }
        }
    }
    
    private func delegateToHandlerForSupabase(call: CAPPluginCall) {
        guard let viewController = self.bridge?.viewController else {
            call.reject("Could not find a view controller to present sign-in UI")
            return
        }
        
        print("📱 Delegating to GoogleSignInHandler for Supabase sign-in")
        
        // Use the GoogleSignInHandler's Supabase-specific method
        GoogleSignInHandler.shared.signInForSupabase(presentingViewController: viewController) { result in
            switch result {
            case .success(let userData):
                print("📱 Google Sign-In for Supabase successful via handler")
                call.resolve(userData)
                
            case .failure(let error):
                print("📱 Google Sign-In for Supabase error via handler: \(error.localizedDescription)")
                call.reject(error.localizedDescription)
            }
        }
    }
    
    @objc func signInWithSupabase(_ call: CAPPluginCall) {
        print("📱 signInWithSupabase method called from JavaScript")
        // Delegate to GoogleSignInHandler for Supabase authentication
        self.delegateToHandlerForSupabase(call: call)
    }
    
    @objc func refresh(_ call: CAPPluginCall) {
        print("📱 refresh method called from JavaScript")
        // Use the handler to refresh tokens
        GoogleSignInHandler.shared.refreshTokens { result in
            switch result {
            case .success(let userData):
                call.resolve(userData)
                
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
    
    @objc func signOut(_ call: CAPPluginCall) {
        print("📱 signOut method called from JavaScript")
        GoogleSignInHandler.shared.signOut()
        call.resolve(["success": true])
    }
    
    @objc func disconnect(_ call: CAPPluginCall) {
        print("📱 disconnect method called from JavaScript")
        GoogleSignInHandler.shared.disconnect { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve(["success": true])
            }
        }
    }
    
    @objc func isSignedIn(_ call: CAPPluginCall) {
        print("📱 isSignedIn method called from JavaScript")
        let isSignedIn = GoogleSignInHandler.shared.isSignedIn()
        call.resolve(["isSignedIn": isSignedIn])
    }
    
    @objc func getCurrentUser(_ call: CAPPluginCall) {
        print("📱 getCurrentUser method called from JavaScript")
        GoogleSignInHandler.shared.getCurrentUser { result in
            switch result {
            case .success(let userData):
                call.resolve(userData)
                
            case .failure(let error):
                call.reject(error.localizedDescription)
            }
        }
    }
}
