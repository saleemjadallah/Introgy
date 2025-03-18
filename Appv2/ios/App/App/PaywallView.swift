import SwiftUI

// Import through wrapper to handle module conflicts
#if canImport(RevenueCat)
import RevenueCat
#endif

#if canImport(RevenueCatUI)
import RevenueCatUI
// Define a typealias to avoid naming conflicts with our own PaywallView
typealias RevenueCatPaywallView = RevenueCatUI.PaywallView
#endif

struct PaywallView: View {
    @State private var showPaywall = false
    
    var body: some View {
        VStack {
            Text("Introgy App Content")
            
            Button("Show Paywall") {
                showPaywall = true
            }
        }
        // Use a conditional to avoid build errors if RevenueCatUI isn't available
        .modifier(PaywallViewModifier(isPresented: $showPaywall))
    }
}

// This modifier allows us to conditionally use RevenueCatUI
struct PaywallViewModifier: ViewModifier {
    @Binding var isPresented: Bool
    
    func body(content: Content) -> some View {
        content
            #if canImport(RevenueCatUI)
            .sheet(isPresented: $isPresented) {
                if #available(iOS 15.0, *) {
                    RevenueCatPaywallView(offering: .current, displayCloseButton: true)
                        .onPurchaseCompleted { customerInfo in
                            print("Purchase completed: \(customerInfo.entitlements)")
                            isPresented = false
                        }
                        .onRestoreCompleted { customerInfo in
                            print("Purchases restored: \(customerInfo.entitlements)")
                            isPresented = false
                        }
                } else {
                    // Fallback for older iOS versions
                    Text("Upgrade to iOS 15 or later to access the paywall")
                }
            }
            #endif
    }
}

struct PaywallView_Previews: PreviewProvider {
    static var previews: some View {
        PaywallView()
    }
}
