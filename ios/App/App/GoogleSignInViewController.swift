import UIKit
import GoogleSignIn
import Capacitor
import SwiftUI

class GoogleSignInViewController: UIViewController {
    
    private let signInButton = GIDSignInButton()
    private var completion: ((Result<[String: String], Error>) -> Void)? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    private func setupView() {
        // Apply standard UIKit colors
        view.backgroundColor = .systemBackground
        
        // Create welcome card using standard UIKit components
        let welcomeCard = UIView(frame: CGRect(x: 20, y: 100, width: view.bounds.width - 40, height: 180))
        welcomeCard.backgroundColor = .white
        welcomeCard.layer.cornerRadius = 12
        welcomeCard.layer.shadowColor = UIColor.black.cgColor
        welcomeCard.layer.shadowOffset = CGSize(width: 0, height: 4)
        welcomeCard.layer.shadowRadius = 8
        welcomeCard.layer.shadowOpacity = 0.1
        
        // Add title label
        let titleLabel = UILabel()
        titleLabel.text = "Welcome to Introgy"
        titleLabel.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        titleLabel.textColor = .black
        welcomeCard.addSubview(titleLabel)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Add subtitle label
        let subtitleLabel = UILabel()
        subtitleLabel.text = "Sign in to access your personalized experience"
        subtitleLabel.font = UIFont.systemFont(ofSize: 16, weight: .regular)
        subtitleLabel.textColor = .darkGray
        subtitleLabel.numberOfLines = 0
        welcomeCard.addSubview(subtitleLabel)
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Add icon
        let iconImageView = UIImageView()
        if let iconImage = UIImage(systemName: "person.circle.fill") {
            iconImageView.image = iconImage
            iconImageView.tintColor = .systemBlue
            iconImageView.contentMode = .scaleAspectFit
        }
        welcomeCard.addSubview(iconImageView)
        iconImageView.translatesAutoresizingMaskIntoConstraints = false
        
        // Set up constraints for the elements inside the card
        NSLayoutConstraint.activate([
            iconImageView.topAnchor.constraint(equalTo: welcomeCard.topAnchor, constant: 20),
            iconImageView.leadingAnchor.constraint(equalTo: welcomeCard.leadingAnchor, constant: 20),
            iconImageView.widthAnchor.constraint(equalToConstant: 40),
            iconImageView.heightAnchor.constraint(equalToConstant: 40),
            
            titleLabel.topAnchor.constraint(equalTo: welcomeCard.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: iconImageView.trailingAnchor, constant: 12),
            titleLabel.trailingAnchor.constraint(equalTo: welcomeCard.trailingAnchor, constant: -20),
            
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            subtitleLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            subtitleLabel.trailingAnchor.constraint(equalTo: welcomeCard.trailingAnchor, constant: -20)
        ])
        
        // Add welcome card to view
        view.addSubview(welcomeCard)
        welcomeCard.translatesAutoresizingMaskIntoConstraints = false
        
        // Configure the sign-in button with modern styling
        signInButton.colorScheme = .light
        signInButton.style = .wide
        signInButton.layer.cornerRadius = 12
        signInButton.clipsToBounds = true
        signInButton.addTarget(self, action: #selector(signInTapped), for: .touchUpInside)
        
        // Create container for sign-in button with animation
        let buttonContainer = UIView()
        buttonContainer.backgroundColor = .clear
        buttonContainer.addSubview(signInButton)
        view.addSubview(buttonContainer)
        
        // Create close button with standard UIKit styling
        let closeButton = UIButton(type: .system)
        closeButton.setTitle("Cancel", for: .normal)
        closeButton.backgroundColor = .systemGray5
        closeButton.setTitleColor(.darkText, for: .normal)
        closeButton.layer.cornerRadius = 10
        closeButton.contentEdgeInsets = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
        closeButton.addTarget(self, action: #selector(closeTapped), for: .touchUpInside)
        view.addSubview(closeButton)
        
        // Setup constraints
        welcomeCard.translatesAutoresizingMaskIntoConstraints = false
        buttonContainer.translatesAutoresizingMaskIntoConstraints = false
        signInButton.translatesAutoresizingMaskIntoConstraints = false
        closeButton.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            // Welcome card constraints
            welcomeCard.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 40),
            welcomeCard.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            welcomeCard.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            welcomeCard.heightAnchor.constraint(equalToConstant: 180),
            
            // Button container constraints
            buttonContainer.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            buttonContainer.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: 60),
            buttonContainer.widthAnchor.constraint(equalToConstant: 250),
            buttonContainer.heightAnchor.constraint(equalToConstant: 60),
            
            // Sign in button constraints
            signInButton.topAnchor.constraint(equalTo: buttonContainer.topAnchor),
            signInButton.leadingAnchor.constraint(equalTo: buttonContainer.leadingAnchor),
            signInButton.trailingAnchor.constraint(equalTo: buttonContainer.trailingAnchor),
            signInButton.bottomAnchor.constraint(equalTo: buttonContainer.bottomAnchor),
            
            // Close button constraints
            closeButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            closeButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16)
        ])
        
        // Apply floating animation to button container
        buttonContainer.applyFloatingAnimation()
    }
    
    @objc private func closeTapped() {
        let error = NSError(domain: "GoogleSignInViewController", code: -1, userInfo: [NSLocalizedDescriptionKey: "User cancelled sign-in"])
        completion?(.failure(error))
        dismiss(animated: true)
    }
    
    @objc private func signInTapped() {
        signIn()
    }
    
    func signIn(completion: ((Result<[String: String], Error>) -> Void)? = nil) {
        self.completion = completion
        
        // Ensure Google Sign-In is properly configured
        guard let clientID = GIDSignIn.sharedInstance.configuration?.clientID else {
            let configError = NSError(domain: "GoogleSignInViewController", code: -1, 
                                    userInfo: [NSLocalizedDescriptionKey: "Google Sign-In not properly configured"])
            print("Google Sign-In configuration error: No client ID configured")
            self.completion?(.failure(configError))
            self.dismiss(animated: true)
            return
        }
        
        print("Starting Google Sign-In with client ID: \(clientID)")
        
        GIDSignIn.sharedInstance.signIn(withPresenting: self) { [weak self] signInResult, error in
            guard let self = self else { return }
            
            if let error = error {
                print("Google Sign-In error: \(error.localizedDescription)")
                // Check for specific error types
                let nsError = error as NSError
                print("Error domain: \(nsError.domain), code: \(nsError.code)")
                if let underlyingError = nsError.userInfo[NSUnderlyingErrorKey] as? NSError {
                    print("Underlying error: \(underlyingError.localizedDescription)")
                }
                self.completion?(.failure(error))
                self.dismiss(animated: true)
                return
            }
            
            guard let signInResult = signInResult else {
                let error = NSError(domain: "GoogleSignInViewController", code: -2, userInfo: [NSLocalizedDescriptionKey: "No sign-in result"])
                self.completion?(.failure(error))
                self.dismiss(animated: true)
                return
            }
            
            guard let idToken = signInResult.user.idToken?.tokenString else {
                let error = NSError(domain: "GoogleSignInViewController", code: -3, userInfo: [NSLocalizedDescriptionKey: "No ID token"])
                self.completion?(.failure(error))
                self.dismiss(animated: true)
                return
            }
            
            let accessToken = signInResult.user.accessToken.tokenString
            
            // Create response dictionary with tokens and user info
            var response: [String: String] = [
                "idToken": idToken,
                "accessToken": accessToken
            ]
            
            // Add user profile information if available
            let user = signInResult.user
            
            // Get all available profile information
            if let profile = user.profile {
                // Full name
                if let name = profile.name {
                    response["displayName"] = name
                }
                
                // Email address
                if let email = profile.email {
                    response["email"] = email
                }
                
                // Given name (first name)
                if let givenName = profile.givenName {
                    response["givenName"] = givenName
                }
                
                // Family name (last name)
                if let familyName = profile.familyName {
                    response["familyName"] = familyName
                }
                
                // Profile picture URLs at different sizes
                if let profilePictureURL = profile.imageURL(withDimension: 96)?.absoluteString {
                    response["photoUrl"] = profilePictureURL
                }
                
                if let profilePictureLargeURL = profile.imageURL(withDimension: 320)?.absoluteString {
                    response["photoUrlLarge"] = profilePictureLargeURL
                }
            }
            
            // Log the retrieved user information
            print("Retrieved user information:")
            print("- Name: \(user.profile?.name ?? "N/A")")
            print("- Email: \(user.profile?.email ?? "N/A")")
            print("- Given Name: \(user.profile?.givenName ?? "N/A")")
            print("- Family Name: \(user.profile?.familyName ?? "N/A")")
            
            // Return the tokens to the caller
            self.completion?(.success(response))
            self.dismiss(animated: true)
        }
    }
    
    // Static method to present the sign-in view controller
    static func present(from viewController: UIViewController, completion: @escaping (Result<[String: String], Error>) -> Void) {
        let signInVC = GoogleSignInViewController()
        signInVC.modalPresentationStyle = .fullScreen
        viewController.present(signInVC, animated: true)
        signInVC.completion = completion
    }
}
