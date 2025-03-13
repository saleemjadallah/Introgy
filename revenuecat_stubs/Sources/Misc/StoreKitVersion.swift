
// Stub file created for build compatibility
import Foundation

// Basic StoreKitVersion enum to satisfy the compiler
enum StoreKitVersion {
    case storeKit1
    case storeKit2
    case default
    
    init?(name: String) {
        switch name {
        case "STOREKIT1":
            self = .storeKit1
        case "STOREKIT2":
            self = .storeKit2
        case "DEFAULT":
            self = .default
        default:
            return nil
        }
    }
}
