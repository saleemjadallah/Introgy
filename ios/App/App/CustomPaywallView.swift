import SwiftUI
import RevenueCat

// Extension to convert UIKit animations to SwiftUI
extension Animation {
    static var floatingAnimation: Animation {
        Animation.easeInOut(duration: 2.0).repeatForever(autoreverses: true)
    }
}

// Custom implementation without RevenueCatUI dependency
struct CustomPaywallView: View {
    @Binding var isPresented: Bool
    @State private var offerings: Offerings?
    @State private var selectedPackage: Package?
    @State private var isLoading = true
    @State private var errorMessage = ""
    
    var body: some View {
        NavigationView {
            ZStack {
                // Standard background color
                Color(.systemBackground)
                    .ignoresSafeArea()
                
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(1.5)
                        .frame(width: 60, height: 60)
                } else if !errorMessage.isEmpty {
                    VStack(spacing: 16) {
                        Text("Error")
                            .font(.headline)
                            .foregroundColor(.red)
                        
                        Text(errorMessage)
                            .font(.subheadline)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                        Button(action: {
                            loadOfferings()
                        }) {
                            Text("Try Again")
                                .fontWeight(.medium)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                        }
                    }
                } else {
                    packagesView
                }
            }
            .navigationTitle("Upgrade to Premium")
            .navigationBarItems(trailing: Button("Close") {
                withAnimation {
                    isPresented = false
                }
            })
            .onAppear {
                loadOfferings()
            }
        }
    }
    
    private var packagesView: some View {
        VStack {
            if let offerings = offerings, let packages = offerings.current?.availablePackages {
                ScrollView {
                    VStack(spacing: 20) {
                        Text("Choose Your Plan")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(Color.blue)
                            .padding(.top)
                        
                        ForEach(packages, id: \.identifier) { package in
                            packageView(package: package)
                                .onTapGesture {
                                    selectedPackage = package
                                    makePurchase(package: package)
                                }
                        }
                        
                        Button("Restore Purchases") {
                            restorePurchases()
                        }
                        .padding()
                    }
                    .padding()
                }
            } else {
                Text("No packages available")
                    .font(.title2)
                    .padding()
            }
        }
    }
    
    private func packageView(package: Package) -> some View {
        VStack(alignment: .leading) {
            Text(package.storeProduct.localizedTitle)
                .font(.headline)
            
            Text(package.storeProduct.localizedDescription)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .padding(.vertical, 4)
            
            HStack {
                Text(package.storeProduct.localizedPriceString)
                    .font(.title3)
                    .bold()
                
                Spacer()
                
                Text("Select")
                    .padding(.horizontal, 20)
                    .padding(.vertical, 8)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    private func loadOfferings() {
        isLoading = true
        errorMessage = ""
        
        Purchases.shared.getOfferings { (offerings, error) in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    errorMessage = error.localizedDescription
                    return
                }
                
                self.offerings = offerings
            }
        }
    }
    
    private func makePurchase(package: Package) {
        isLoading = true
        
        Purchases.shared.purchase(package: package) { (transaction, customerInfo, error, userCancelled) in
            DispatchQueue.main.async {
                isLoading = false
                
                if userCancelled {
                    return
                }
                
                if let error = error {
                    errorMessage = error.localizedDescription
                    return
                }
                
                if customerInfo?.entitlements.all["premium"]?.isActive == true {
                    isPresented = false
                }
            }
        }
    }
    
    private func restorePurchases() {
        isLoading = true
        
        Purchases.shared.restorePurchases { (customerInfo, error) in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    errorMessage = error.localizedDescription
                    return
                }
                
                if customerInfo.entitlements.all["premium"]?.isActive == true {
                    isPresented = false
                } else {
                    errorMessage = "No purchases to restore"
                }
            }
        }
    }
}
