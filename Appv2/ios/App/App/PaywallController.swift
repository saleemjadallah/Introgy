import UIKit
import SwiftUI
import RevenueCat
import RevenueCatUI
import Capacitor

@objc public class PaywallController: NSObject {
    private static var hostingController: UIHostingController<PaywallView>?
    
    @objc public static func presentPaywall(from viewController: UIViewController) {
        // Create the SwiftUI view
        let paywallView = PaywallView()
        
        // Create a hosting controller with the SwiftUI view
        let hostingController = UIHostingController(rootView: paywallView)
        self.hostingController = hostingController
        
        // Present the hosting controller modally
        viewController.present(hostingController, animated: true, completion: nil)
    }
    
    @objc public static func dismissPaywall() {
        hostingController?.dismiss(animated: true, completion: nil)
        hostingController = nil
    }
}
