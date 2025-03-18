import Foundation
import Capacitor

// Import through wrapper to handle module conflicts
#if canImport(RevenueCat)
import RevenueCat
#endif

@objc(RevenueCatPluginExtension)
public class RevenueCatPluginExtension: CAPPlugin {
    @objc override public func load() {
        // Plugin is loaded
    }
    
    @objc func configureWithSharedDefaults(_ call: CAPPluginCall) {
        guard let apiKey = call.getString("apiKey") else {
            call.reject("API key is required")
            return
        }
        
        let appUserID = call.getString("appUserID")
        
        // Use our custom configuration with shared UserDefaults
        RevenueCatConfig.configureWithSharedUserDefaults(apiKey: apiKey, appUserID: appUserID)
        
        call.resolve()
    }
}
