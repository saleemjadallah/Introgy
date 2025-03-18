import Foundation
import Capacitor

// Import through wrapper to handle module conflicts
#if canImport(RevenueCat)
import RevenueCat
#endif

@objc public class RevenueCatConfig: NSObject {
    // RevenueCat API key
    private static let apiKey = "appa9175f8b57"
    
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
