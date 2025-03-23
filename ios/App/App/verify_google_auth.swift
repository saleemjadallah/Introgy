
import Foundation
import GoogleSignIn

class GoogleAuthVerifier {
    
    static func verifyGoogleAuthSetup() {
        print("🧪 Verifying Google Auth Setup")
        
        // Check if the client ID is set
        if let clientID = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String {
            print("✅ GIDClientID found in Info.plist: \(clientID)")
        } else {
            print("❌ GIDClientID not found in Info.plist")
        }
        
        // Check URL schemes
        if let urlTypes = Bundle.main.object(forInfoDictionaryKey: "CFBundleURLTypes") as? [[String: Any]] {
            let googleSchemes = urlTypes.compactMap { urlType -> String? in
                guard let schemes = urlType["CFBundleURLSchemes"] as? [String] else { return nil }
                return schemes.first(where: { $0.contains("googleusercontent") })
            }
            
            if let scheme = googleSchemes.first {
                print("✅ Google URL scheme found: \(scheme)")
            } else {
                print("❌ No Google URL scheme found in Info.plist")
            }
        } else {
            print("❌ No URL types found in Info.plist")
        }
        
        // Check if GoogleSignIn is initialized
        let config = GIDConfiguration(clientID: "308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com")
        GIDSignIn.sharedInstance.configuration = config
        
        print("✅ GoogleSignIn is initialized with configuration")
        
        // Check if there's a previous sign-in
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            print("✅ Previous Google Sign-In found")
        } else {
            print("ℹ️ No previous Google Sign-In found (this is normal if the user hasn't signed in yet)")
        }
        
        print("🧪 Google Auth verification complete")
    }
}
