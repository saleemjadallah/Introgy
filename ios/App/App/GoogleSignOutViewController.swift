import UIKit
import GoogleSignIn
import Capacitor

class GoogleSignOutViewController: UIViewController {
    
    private let signOutButton = UIButton(type: .system)
    private var completion: ((Bool, Error?) -> Void)? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    private func setupView() {
        // Use standard background color
        view.backgroundColor = .systemBackground
        
        // Configure the sign-out button
        signOutButton.setTitle("Sign Out from Google", for: .normal)
        signOutButton.backgroundColor = .systemGray6
        signOutButton.setTitleColor(.black, for: .normal)
        signOutButton.layer.cornerRadius = 8
        
        // Add the button to the view
        view.addSubview(signOutButton)
        
        // Center the button
        signOutButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            signOutButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            signOutButton.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            signOutButton.widthAnchor.constraint(equalToConstant: 230),
            signOutButton.heightAnchor.constraint(equalToConstant: 48)
        ])
        
        // Add target action for the button
        signOutButton.addTarget(self, action: #selector(signOutTapped), for: .touchUpInside)
        
        // Add a close button
        let closeButton = UIButton(type: .system)
        closeButton.setTitle("Cancel", for: .normal)
        closeButton.addTarget(self, action: #selector(closeTapped), for: .touchUpInside)
        
        view.addSubview(closeButton)
        closeButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            closeButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            closeButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16)
        ])
        
        // Add user info if available
        if let currentUser = GIDSignIn.sharedInstance.currentUser {
            let userInfoLabel = UILabel()
            userInfoLabel.textAlignment = .center
            userInfoLabel.numberOfLines = 0
            
            var userInfoText = "Signed in as:"
            
            // Display full name if available
            if let name = currentUser.profile?.name {
                userInfoText += "\n\(name)"
            }
            
            // Display email
            if let email = currentUser.profile?.email {
                userInfoText += "\n\(email)"
            }
            
            // Display given name and family name if available
            if let givenName = currentUser.profile?.givenName, let familyName = currentUser.profile?.familyName {
                userInfoText += "\nName: \(givenName) \(familyName)"
            }
            
            userInfoLabel.text = userInfoText
            
            view.addSubview(userInfoLabel)
            userInfoLabel.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                userInfoLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                userInfoLabel.bottomAnchor.constraint(equalTo: signOutButton.topAnchor, constant: -20),
                userInfoLabel.leadingAnchor.constraint(greaterThanOrEqualTo: view.leadingAnchor, constant: 20),
                userInfoLabel.trailingAnchor.constraint(lessThanOrEqualTo: view.trailingAnchor, constant: -20)
            ])
            
            // Add profile image if available (using larger dimension for better quality)
            if let imageURL = currentUser.profile?.imageURL(withDimension: 320) {
                let imageView = UIImageView()
                imageView.contentMode = .scaleAspectFit
                imageView.layer.cornerRadius = 40
                imageView.clipsToBounds = true
                
                // Load image asynchronously
                DispatchQueue.global().async {
                    if let data = try? Data(contentsOf: imageURL),
                       let image = UIImage(data: data) {
                        DispatchQueue.main.async {
                            imageView.image = image
                        }
                    }
                }
                
                view.addSubview(imageView)
                imageView.translatesAutoresizingMaskIntoConstraints = false
                NSLayoutConstraint.activate([
                    imageView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                    imageView.bottomAnchor.constraint(equalTo: userInfoLabel.topAnchor, constant: -20),
                    imageView.widthAnchor.constraint(equalToConstant: 80),
                    imageView.heightAnchor.constraint(equalToConstant: 80)
                ])
            }
        }
    }
    
    @objc private func closeTapped() {
        completion?(false, nil)
        dismiss(animated: true)
    }
    
    @IBAction func signOutTapped(sender: Any) {
        GIDSignIn.sharedInstance.signOut()
        
        // Notify completion handler
        completion?(true, nil)
        
        // Show confirmation and dismiss
        let alert = UIAlertController(
            title: "Signed Out",
            message: "You have been successfully signed out from Google.",
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            self?.dismiss(animated: true)
        })
        
        present(alert, animated: true)
    }
    
    // Static method to present the sign-out view controller
    static func present(from viewController: UIViewController, completion: @escaping (Bool, Error?) -> Void) {
        let signOutVC = GoogleSignOutViewController()
        signOutVC.modalPresentationStyle = .fullScreen
        viewController.present(signOutVC, animated: true)
        signOutVC.completion = completion
    }
}
