import UIKit
import Capacitor
import RevenueCat
import Foundation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func testFoundation() {
        // 1. String manipulation
        let testString = "Hello, Foundation!"
        print("1. String Tests:")
        print("   - Original: \(testString)")
        print("   - Uppercase: \(testString.uppercased())")
        print("   - Contains 'Foundation': \(testString.contains("Foundation"))")
        
        // 2. Date handling
        let now = Date()
        let formatter = DateFormatter()
        formatter.dateStyle = .full
        formatter.timeStyle = .medium
        print("\n2. Date Tests:")
        print("   - Current date: \(formatter.string(from: now))")
        
        // 3. File management
        let fileManager = FileManager.default
        let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        print("\n3. File Management Tests:")
        print("   - Documents directory: \(documentsPath.path)")
        
        // 4. JSON processing
        let jsonData: [String: Any] = ["name": "Test User", "age": 30]
        do {
            let jsonString = try JSONSerialization.data(withJSONObject: jsonData)
            print("\n4. JSON Tests:")
            print("   - JSON data created successfully: \(String(data: jsonString, encoding: .utf8) ?? "failed")")
        } catch {
            print("   - JSON serialization failed: \(error)")
        }
        
        // 5. URLSession test
        print("\n5. URLSession Test:")
        let url = URL(string: "https://api.github.com")!
        let task = URLSession.shared.dataTask(with: url) { (data, response, error) in
            if let error = error {
                print("   - Network request failed: \(error)")
                return
            }
            if let httpResponse = response as? HTTPURLResponse {
                print("   - Network request succeeded with status code: \(httpResponse.statusCode)")
            }
        }
        task.resume()
        
        print("\nFoundation framework test completed! Check console for results.")
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize RevenueCat with proper configuration
        Purchases.logLevel = .debug
        
        // Use the same API key that's in the capacitor.config.ts
        let apiKey = "appl_wHXBFRFAOUUpWRqauPXyZEUElmq"
        
        // Configure with standard options
        Purchases.configure(withAPIKey: apiKey)
        
        // Run Foundation tests
        testFoundation()
        
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
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
