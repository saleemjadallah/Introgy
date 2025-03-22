import Foundation
import RevenueCat

// This file ensures the RevenueCat frameworks are properly linked
struct BuildConfig {
    static func ensureFrameworksAreLinked() {
        // This is just a helper function to ensure RevenueCat is linked
        _ = Purchases.self
    }
}
