import Foundation
import SwiftUI
import RevenueCat

// Module wrapper to ensure we're using the correct implementation
enum RevenueCatWrapper {
    // Ensure we're accessing the right module when there are conflicts
    static func configurePurchases(withAPIKey apiKey: String, appUserID: String? = nil) {
        Purchases.configure(withAPIKey: apiKey, appUserID: appUserID)
    }
    
    static func getSharedInstance() -> Purchases {
        return Purchases.shared
    }
}
