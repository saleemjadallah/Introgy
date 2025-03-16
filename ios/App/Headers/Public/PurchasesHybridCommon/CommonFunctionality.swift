//
//  CommonFunctionality.swift
//  PurchasesHybridCommon
//
//  Stub implementation
//

import Foundation
import RevenueCat

@objc public class CommonFunctionality: NSObject {
    
    @objc public static func configureSDK(apiKey: String,
                                          appUserID: String?,
                                          observerMode: Bool,
                                          userDefaultsSuiteName: String?,
                                          useAmazon: Bool,
                                          platformFlavor: String?,
                                          platformFlavorVersion: String?,
                                          dangerousSettings: [String: Any]?) {
        var builder = Configuration.Builder(withAPIKey: apiKey)
            .with(appUserID: appUserID)
            .with(observerMode: observerMode)
            .with(userDefaultsSuiteName: userDefaultsSuiteName)
        
        if useAmazon {
            builder = builder.with(storeKit2Setting: .storeKit2Disabled) // Amazon doesn't support StoreKit 2
                .with(store: .amazon)
        }
        
        if let platformFlavor = platformFlavor, let platformFlavorVersion = platformFlavorVersion {
            builder = builder.with(platformInfo: PlatformInfo(flavor: platformFlavor, version: platformFlavorVersion))
        }
        
        Purchases.configure(with: builder.build())
    }
} 