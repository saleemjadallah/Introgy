import UIKit
import SwiftUI

enum UI {}

extension UI {
    @objc class MainTabBarController: UITabBarController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupAppearance()
        setupViewControllers()
    }
    
    private func setupAppearance() {
        // Set tab bar appearance
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UI.DesignSystem.Colors.background
        
        tabBar.standardAppearance = appearance
        if #available(iOS 15.0, *) {
            tabBar.scrollEdgeAppearance = appearance
        }
        
        // Add shadow
        tabBar.layer.shadowColor = UIColor.black.withAlphaComponent(0.2).cgColor
        tabBar.layer.shadowOffset = CGSize(width: 0, height: -2)
        tabBar.layer.shadowRadius = 4
        tabBar.layer.shadowOpacity = 0.5
    }
    
    private func setupViewControllers() {
        // Create view controllers for each tab
        let homeVC = UIHostingController(rootView: Text("Home"))
        homeVC.tabBarItem = UITabBarItem(
            title: "Home",
            image: UIImage(systemName: "house"),
            selectedImage: UIImage(systemName: "house.fill")
        )
        
        let profileVC = UIHostingController(rootView: Text("Profile"))
        profileVC.tabBarItem = UITabBarItem(
            title: "Profile",
            image: UIImage(systemName: "person"),
            selectedImage: UIImage(systemName: "person.fill")
        )
        
        let settingsVC = UIHostingController(rootView: Text("Settings"))
        settingsVC.tabBarItem = UITabBarItem(
            title: "Settings",
            image: UIImage(systemName: "gear"),
            selectedImage: UIImage(systemName: "gear")
        )
        
        // Set the view controllers
        viewControllers = [homeVC, profileVC, settingsVC]
        
        // Set tab bar colors
        tabBar.tintColor = UI.DesignSystem.Colors.primary
        tabBar.unselectedItemTintColor = UI.DesignSystem.Colors.text.withAlphaComponent(0.5)
    }
}
}
