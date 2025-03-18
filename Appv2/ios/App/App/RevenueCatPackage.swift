import Foundation
import SwiftUI

// This file ensures we can properly access RevenueCat packages
// Define typealias to help with module confusion
#if canImport(RevenueCat)
import RevenueCat
#endif

#if canImport(RevenueCatUI)
import RevenueCatUI
#endif

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
