import Foundation
import SwiftUI

// This file ensures the RevenueCat frameworks are properly linked
#if canImport(RevenueCat)
import RevenueCat
#endif

#if canImport(RevenueCatUI)
import RevenueCatUI
#endif

// Force the compiler to actually reference the frameworks
struct BuildConfig {
    static func ensureFrameworksAreLinked() {
        #if canImport(RevenueCat)
        // Force reference to RevenueCat to make the linker include it
        _ = Purchases.self
        #endif
        
        #if canImport(RevenueCatUI)
        // Force reference to RevenueCatUI
        if #available(iOS 15.0, *) {
            _ = PaywallFonts.self
        }
        #endif
    }
}
