import Foundation
import Capacitor
import RevenueCat

@objc public class RevenueCatConfig: NSObject {
    // RevenueCat API key
    // Project ID: ee1736f9
    private static let apiKey = "appl_kZAgCVDouEyJrUniScsiiNfrDYu"
    
    // Replace with your actual app group identifier
    // Format should be "group.your.bundle.identifier"
    private static let appGroupIdentifier = "group.com.introgy.app"
    
    @objc public static func configureWithSharedUserDefaults(apiKey: String = apiKey, appUserID: String?) {
        let configuration = Configuration.Builder(withAPIKey: apiKey)
            .with(appUserID: appUserID)
            .with(userDefaults: UserDefaults(suiteName: appGroupIdentifier))
            .build()
        
        Purchases.configure(with: configuration)
        Purchases.logLevel = .debug
    }
    
    @objc public static func configureForExtension(apiKey: String = apiKey) {
        // For use in extensions when you don't have access to the user ID
        let configuration = Configuration.Builder(withAPIKey: apiKey)
            .with(userDefaults: UserDefaults(suiteName: appGroupIdentifier))
            .build()
        
        Purchases.configure(with: configuration)
        Purchases.logLevel = .debug
    }
}
