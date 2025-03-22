import SwiftUI
import RevenueCat

struct PaywallView: View {
    @State private var showPaywall = false
    
    var body: some View {
        VStack {
            Text("Introgy App Content")
            
            Button("Show Paywall") {
                showPaywall = true
            }
        }
        .modifier(PaywallViewModifier(isPresented: $showPaywall))
    }
}

// Custom paywall modifier without RelenueCatUI dependency
struct PaywallViewModifier: ViewModifier {
    @Binding var isPresented: Bool
    
    func body(content: Content) -> some View {
        content
            .sheet(isPresented: $isPresented) {
                CustomPaywallView(isPresented: $isPresented)
            }
    }
}

struct PaywallView_Previews: PreviewProvider {
    static var previews: some View {
        PaywallView()
    }
}
