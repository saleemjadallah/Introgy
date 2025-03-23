
import Foundation
import GoogleSignIn

/// Utility class to verify and debug Google Sign-In configuration
class GoogleAuthVerifier {
    
    /// Performs a series of checks to verify Google Auth is properly set up
    static func verifySetup() {
        print("🧪 Verifying Google Auth Setup")
        
        // Check client ID in Info.plist
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
        if let clientID = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String {
            let config = GIDConfiguration(clientID: clientID)
            GIDSignIn.sharedInstance.configuration = config
            print("✅ GoogleSignIn initialized with configuration")
        } else {
            print("❌ Cannot initialize GoogleSignIn without client ID")
        }
        
        // Check if there's a previous sign-in
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            print("✅ Previous Google Sign-In found")
        } else {
            print("ℹ️ No previous Google Sign-In found (this is normal if the user hasn't signed in yet)")
        }
        
        // Check for credentials file
        let credentialsFileName = "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
        if Bundle.main.path(forResource: credentialsFileName.components(separatedBy: ".").first, ofType: "plist") != nil {
            print("✅ Google credentials file found in bundle")
        } else {
            print("❌ Google credentials file not found in bundle")
        }
        
        print("🧪 Google Auth verification complete")
    }
}
