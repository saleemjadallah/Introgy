import Foundation
import Capacitor
import SafariServices
import AuthenticationServices

// This class extends the CAPBrowserPlugin to intercept auth-related URLs
// and use our in-app browser implementation instead of the default Safari view
public class BrowserPluginPatch: NSObject {
    
    // Swizzle the Browser plugin's open method to intercept auth URLs
    public static func apply() {
        // Find the Browser plugin class
        guard let pluginClass = NSClassFromString("CAPBrowserPlugin") as? NSObject.Type else {
            print("⚠️ Could not find CAPBrowserPlugin class")
            return
        }
        
        // Get the original and swizzled methods
        let originalSelector = NSSelectorFromString("open:")
        let swizzledSelector = NSSelectorFromString("swizzled_open:")
        
        // Add the swizzled method to the class
        let swizzledMethod = class_getInstanceMethod(BrowserPluginPatch.self, #selector(swizzled_open(_:)))
        let originalMethod = class_getInstanceMethod(pluginClass, originalSelector)
        
        if let swizzledMethod = swizzledMethod, let originalMethod = originalMethod {
            if class_addMethod(pluginClass, swizzledSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod)) {
                let replacedMethod = class_getInstanceMethod(pluginClass, swizzledSelector)!
                method_exchangeImplementations(originalMethod, replacedMethod)
                print("🔒 Successfully patched Browser plugin's open method")
            } else {
                print("⚠️ Failed to add swizzled method to Browser plugin class")
            }
        } else {
            print("⚠️ Failed to get methods for swizzling")
        }
    }
    
    // This is the replacement implementation for the Browser plugin's open method
    @objc func swizzled_open(_ call: CAPPluginCall) {
        // Get the URL from the call
        guard let urlString = call.getString("url"), let url = URL(string: urlString) else {
            call.reject("Must provide a valid URL to open")
            return
        }
        
        print("🔒 BrowserPluginPatch: Intercepted Browser.open call for URL: \(urlString)")
        
        // Check if this is an auth-related URL
        if urlString.contains("accounts.google.com") || 
           urlString.contains("oauth") || 
           urlString.contains("auth") || 
           urlString.contains("login") || 
           urlString.contains("signin") || 
           urlString.contains("callback") || 
           urlString.contains("supabase") {
            
            print("🔒 BrowserPluginPatch: Using in-app browser for auth URL")
            
            // Use ASWebAuthenticationSession for iOS 12+ (preferred for auth)
            if #available(iOS 12.0, *) {
                let authSession = ASWebAuthenticationSession(
                    url: url,
                    callbackURLScheme: "introgy",
                    completionHandler: { [weak self] (callbackURL, error) in
                        if let error = error {
                            print("❌ Auth session error: \(error.localizedDescription)")
                            call.reject("Authentication failed: \(error.localizedDescription)")
                            return
                        }
                        
                        if let callbackURL = callbackURL {
                            print("✅ Auth session completed with callback URL: \(callbackURL.absoluteString)")
                            
                            // Process the callback URL
                            if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
                                _ = appDelegate.application(UIApplication.shared, open: callbackURL, options: [:])
                            }
                            
                            // Resolve the call
                            call.resolve()
                        } else {
                            call.resolve()
                        }
                    }
                )
                
                if #available(iOS 13.0, *) {
                    if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
                        authSession.presentationContextProvider = appDelegate
                    }
                }
                
                authSession.start()
            } else {
                // Fallback to SFSafariViewController for older iOS versions
                if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
                    appDelegate.presentInAppBrowser(for: url)
                    call.resolve()
                } else {
                    // If we can't get the AppDelegate, fall back to original implementation
                    self.perform(NSSelectorFromString("originalOpen:"), with: call)
                }
            }
        } else {
            // For non-auth URLs, use the original implementation
            self.perform(NSSelectorFromString("originalOpen:"), with: call)
        }
    }
}
