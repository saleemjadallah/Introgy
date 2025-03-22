import Foundation
import Capacitor
import RevenueCat

@objc(PaywallPlugin)
public class PaywallPlugin: CAPPlugin {
    @objc override public func load() {
        // Plugin is loaded
    }
    @objc func presentPaywall(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            PaywallController.presentPaywall(from: self.bridge?.viewController ?? UIViewController())
            call.resolve()
        }
    }
    
    @objc func dismissPaywall(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            PaywallController.dismissPaywall()
            call.resolve()
        }
    }
    
    @objc func checkEntitlements(_ call: CAPPluginCall) {
        Purchases.shared.getCustomerInfo { (customerInfo, error) in
            if let error = error {
                call.reject(error.localizedDescription)
                return
            }
            
            guard let customerInfo = customerInfo else {
                call.reject("Failed to retrieve customer info")
                return
            }
            
            // Check for "Single Purchase" entitlement
            let entitlements = customerInfo.entitlements.active
            let hasPremium = entitlements["Single Purchase"] != nil
            
            call.resolve([
                "hasPremium": hasPremium,
                "entitlements": entitlements.map { $0.key }
            ])
        }
    }
}
