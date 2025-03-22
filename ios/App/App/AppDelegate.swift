import UIKit
import Capacitor
import GoogleSignIn
import SwiftUI
import RevenueCat

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Create window with standard Capacitor setup
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Initialize RevenueCat with proper configuration
        Purchases.logLevel = .debug
        // Use the same API key that's in the capacitor.config.ts
        let apiKey = "appl_wHXBFRFAOUUpWRqauPXyZEUElmq"
        // Configure with standard options
        Purchases.configure(withAPIKey: apiKey)
        
        // Configure Google Sign-In
        let clientID = "308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com"
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        
        // Attempt to restore the user's sign-in state
        GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
            if let user = user {
                print("User is already signed in with Google: \(user.profile?.email ?? "Unknown")")
            } else if let error = error {
                print("Failed to restore Google Sign-In: \(error.localizedDescription)")
            }
        }
        
        // Initialize Capacitor web view - this will load your web content
        let viewController = CAPBridgeViewController.init()
        let navController = UINavigationController(rootViewController: viewController)
        navController.navigationBar.isHidden = true
        
        window?.rootViewController = navController
        window?.makeKeyAndVisible()
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Log the URL for debugging
        print("📱 AppDelegate: Received URL: \(url.absoluteString)")
        
        // Handle Google Sign-In callbacks first
        if GIDSignIn.sharedInstance.handle(url) {
            print("📱 URL handled by Google Sign-In")
            return true
        }
        
        // Special handling for Supabase auth URLs with unusual formats
        let urlString = url.absoluteString
        if urlString.contains("access_token=") && urlString.contains("refresh_token=") {
            print("📱 Detected Supabase auth callback URL")
            
            // Extract parameters from URL
            if let accessToken = extractParameter(from: urlString, param: "access_token"),
               let refreshToken = extractParameter(from: urlString, param: "refresh_token"),
               let expiresIn = extractParameter(from: urlString, param: "expires_in") {
                
                print("📱 Successfully extracted auth tokens from URL")
                
                // Build a proper callback URL
                let callbackUrl = "introgy://auth/callback?access_token=\(accessToken)&refresh_token=\(refreshToken)&expires_in=\(expiresIn)"
                
                if let properUrl = URL(string: callbackUrl) {
                    // Let Capacitor handle this properly formatted URL
                    return ApplicationDelegateProxy.shared.application(app, open: properUrl, options: options)
                }
            }
        }
        
        // Then let Capacitor handle the rest
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }
    
    // Helper function to extract parameters from URLs
    private func extractParameter(from urlString: String, param: String) -> String? {
        guard let range = urlString.range(of: "\(param)=") else {
            return nil
        }
        
        let start = range.upperBound
        let remaining = urlString[start...]
        
        if let end = remaining.range(of: "&")?.lowerBound {
            return String(remaining[..<end])
        } else {
            return String(remaining)
        }
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
