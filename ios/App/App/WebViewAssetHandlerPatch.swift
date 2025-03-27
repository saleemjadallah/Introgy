import Foundation
import MobileCoreServices
import UniformTypeIdentifiers
import Capacitor

// This class patches the WebViewAssetHandler to use modern UTType APIs instead of deprecated ones
public class WebViewAssetHandlerPatch: NSObject {
    
    public static func apply() {
        // Replace the mimeTypeForExtension method
        guard let originalClass = NSClassFromString("CAPWebViewAssetHandler") as? NSObject.Type else {
            print("⚠️ Could not find CAPWebViewAssetHandler class")
            return
        }
        
        // Get the original method
        let originalSelector = NSSelectorFromString("mimeTypeForExtension:")
        guard let originalMethod = class_getInstanceMethod(originalClass, originalSelector) else {
            print("⚠️ Could not find mimeTypeForExtension: method")
            return
        }
        
        // Store the original implementation
        let originalImplementation = method_getImplementation(originalMethod)
        let originalTypeEncoding = method_getTypeEncoding(originalMethod)
        
        // Create a new implementation
        let newImplementation: @convention(block) (NSObject, String) -> String = { (_, pathExtension) in
            // First try to get the MIME type from the modern UTType API
            if #available(iOS 14.0, *) {
                if let pathExtension = pathExtension as String?, !pathExtension.isEmpty,
                   let utType = UTType(filenameExtension: pathExtension) {
                    if let mimeType = utType.preferredMIMEType {
                        return mimeType
                    }
                }
            }
            
            // Fall back to the original implementation
            let originalFunction = unsafeBitCast(originalImplementation, to: (@convention(c) (NSObject, Selector, String) -> String).self)
            return originalFunction(originalClass as! NSObject, originalSelector, pathExtension)
        }
        
        // Replace the implementation
        let newIMP = imp_implementationWithBlock(newImplementation)
        method_setImplementation(originalMethod, newIMP)
        
        print("🔧 Successfully patched WebViewAssetHandler to use modern UTType APIs")
    }
}
