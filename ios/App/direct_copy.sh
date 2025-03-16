#!/bin/bash
# Simple script to copy files directly to the volume path

# Create the volume directory
sudo mkdir -p "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Create the PurchasesHybridCommon.h file directly
sudo tee "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon.h" > /dev/null << 'EOF'
//
//  PurchasesHybridCommon.h
//  PurchasesHybridCommon
//
//  Created for RevenueCat
//

#import <Foundation/Foundation.h>
#import <RevenueCat/RevenueCat.h>

//! Project version number for PurchasesHybridCommon.
FOUNDATION_EXPORT double PurchasesHybridCommonVersionNumber;

//! Project version string for PurchasesHybridCommon.
FOUNDATION_EXPORT const unsigned char PurchasesHybridCommonVersionString[];

// This is a stub header to allow compilation without PurchasesHybridCommon
EOF

# Create the CommonFunctionality.swift file directly
sudo tee "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/CommonFunctionality.swift" > /dev/null << 'EOF'
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
            builder = builder.with(storeKit2Setting: .storeKit2Disabled)
                .with(store: .amazon)
        }
        
        if let platformFlavor = platformFlavor, let platformFlavorVersion = platformFlavorVersion {
            builder = builder.with(platformInfo: PlatformInfo(flavor: platformFlavor, version: platformFlavorVersion))
        }
        
        Purchases.configure(with: builder.build())
    }
}
EOF

echo "Files created directly in the volume path." 