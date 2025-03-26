
import Foundation
import GoogleSignIn
import UIKit

/// Utility class to verify and debug Google Sign-In configuration
class GoogleAuthVerifier {
    
    /// Performs a series of checks to verify Google Auth is properly set up
    static func verifySetup() {
        print("🧪 Verifying Google Auth Setup")
        
        // Check client ID in Info.plist
        if let clientID = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String {
            print("✅ GIDClientID found in Info.plist: \(clientID)")
            
            // Ensure the client ID is properly formatted
            if clientID.hasSuffix(".apps.googleusercontent.com") {
                print("✅ Client ID format is correct")
            } else {
                print("⚠️ Client ID format may be incorrect (should end with .apps.googleusercontent.com)")
            }
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
                
                // Verify URL scheme format against expected format
                let expectedSchemePrefix = "com.googleusercontent.apps."
                if scheme.hasPrefix(expectedSchemePrefix) {
                    print("✅ Google URL scheme has correct format")
                } else {
                    print("⚠️ Google URL scheme format may be incorrect (should start with com.googleusercontent.apps.)")
                }
            } else {
                print("❌ No Google URL scheme found in Info.plist")
            }
            
            // Check for app custom scheme
            let appSchemes = urlTypes.compactMap { urlType -> String? in
                guard let schemes = urlType["CFBundleURLSchemes"] as? [String] else { return nil }
                return schemes.first(where: { $0 == "introgy" })
            }
            
            if let appScheme = appSchemes.first {
                print("✅ App custom URL scheme found: \(appScheme)")
            } else {
                print("⚠️ No custom app URL scheme 'introgy' found")
            }
        } else {
            print("❌ No URL types found in Info.plist")
        }
        
        // Test Google Sign-In configuration
        configureAndTestGoogleSignIn()
        
        // Check for credentials file
        let credentialsFileName = "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
        if Bundle.main.path(forResource: credentialsFileName.components(separatedBy: ".").first, ofType: "plist") != nil {
            print("✅ Google credentials file found in bundle")
        } else {
            print("⚠️ Google credentials file not found in bundle. This may be fine if using client ID directly.")
        }
        
        print("🧪 Google Auth verification complete")
    }
    
    /// Configure Google Sign-In and test basic functionality
    private static func configureAndTestGoogleSignIn() {
        // Get client ID
        guard let clientID = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String else {
            print("❌ Cannot test Google Sign-In without client ID")
            return
        }
        
        // Configure Google Sign-In
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        print("✅ GoogleSignIn initialized with configuration")
        
        // Check if there's a previous sign-in
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            print("✅ Previous Google Sign-In found")
        } else {
            print("ℹ️ No previous Google Sign-In found (this is normal if the user hasn't signed in yet)")
        }
        
        // Verification for redirect URL
        let redirectURL = getGoogleRedirectURL()
        print("ℹ️ Redirect URL would be: \(redirectURL)")
        
        // Test if URL can be created from the scheme
        if let urlTypes = Bundle.main.object(forInfoDictionaryKey: "CFBundleURLTypes") as? [[String: Any]] {
            for urlType in urlTypes {
                if let schemes = urlType["CFBundleURLSchemes"] as? [String] {
                    for scheme in schemes {
                        let testURL = "\(scheme):/oauth2redirect"
                        if let _ = URL(string: testURL) {
                            print("✅ Can create URL from scheme: \(scheme)")
                        } else {
                            print("❌ Cannot create URL from scheme: \(scheme)")
                        }
                    }
                }
            }
        }
    }
    
    /// Get the redirect URL that should be used for Google Sign-In
    private static func getGoogleRedirectURL() -> String {
        // Always use the consistent format that matches the TypeScript implementation
        // This must match EXACTLY with what's in googleAuthService.ts getRedirectUrl()
        return "com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2:/oauth2redirect"
    }
}
