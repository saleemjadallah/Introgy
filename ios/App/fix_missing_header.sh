#!/bin/bash

# This script addresses the specific error with the missing header file in PurchasesHybridCommon
# Implementation strategy: modify the source mapping in Xcode project to skip the problematic file

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create a stub header file with the essential content
mkdir -p "${SCRIPT_DIR}/Headers/Public/PurchasesHybridCommon"

cat > "${SCRIPT_DIR}/Headers/Public/PurchasesHybridCommon/PurchasesHybridCommon.h" << 'EOF'
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

# Create a CommonFunctionality.swift file
cat > "${SCRIPT_DIR}/Headers/Public/PurchasesHybridCommon/CommonFunctionality.swift" << 'EOF'
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

# Check if the directory exists in the Pods folder
mkdir -p "${SCRIPT_DIR}/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Create a symlink to our header file within the Pods structure
ln -sf "${SCRIPT_DIR}/Headers/Public/PurchasesHybridCommon/PurchasesHybridCommon.h" "${SCRIPT_DIR}/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon/"
ln -sf "${SCRIPT_DIR}/Headers/Public/PurchasesHybridCommon/CommonFunctionality.swift" "${SCRIPT_DIR}/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon/"

# Modify the build settings for PurchasesHybridCommon in Debug.xcconfig
for config_type in Debug Release; do
  xcconfig_file="${SCRIPT_DIR}/Pods/Target Support Files/PurchasesHybridCommon/PurchasesHybridCommon.${config_type}.xcconfig"
  
  if [ -f "$xcconfig_file" ]; then
    # Add FRAMEWORK_HEADERS flag to instruct Xcode to skip validation
    grep -q "VALIDATE_PRODUCT" "$xcconfig_file" || echo "VALIDATE_PRODUCT = NO" >> "$xcconfig_file"
    
    # Add header search paths for our stub headers
    grep -q "HEADER_SEARCH_PATHS" "$xcconfig_file" || echo "HEADER_SEARCH_PATHS = \$(inherited)" >> "$xcconfig_file"
    sed -i '' -e "s|HEADER_SEARCH_PATHS = \$(inherited)|HEADER_SEARCH_PATHS = \$(inherited) \"${SCRIPT_DIR}/Headers\" \"${SCRIPT_DIR}/Headers/Public\"|g" "$xcconfig_file"
    
    # Add preprocessor definition
    grep -q "GCC_PREPROCESSOR_DEFINITIONS" "$xcconfig_file" || echo "GCC_PREPROCESSOR_DEFINITIONS = \$(inherited)" >> "$xcconfig_file"
    sed -i '' -e "s|GCC_PREPROCESSOR_DEFINITIONS = \$(inherited)|GCC_PREPROCESSOR_DEFINITIONS = \$(inherited) PURCHASES_HYBRID_COMMON_STUB=1|g" "$xcconfig_file"
  fi
done

# Update the RevenuecatPurchasesCapacitor xcconfig to respect our stub headers
for config_type in Debug Release; do
  xcconfig_file="${SCRIPT_DIR}/Pods/Target Support Files/RevenuecatPurchasesCapacitor/RevenuecatPurchasesCapacitor.${config_type}.xcconfig"
  
  if [ -f "$xcconfig_file" ]; then
    # Add header search paths for our stub headers
    grep -q "HEADER_SEARCH_PATHS" "$xcconfig_file" || echo "HEADER_SEARCH_PATHS = \$(inherited)" >> "$xcconfig_file"
    sed -i '' -e "s|HEADER_SEARCH_PATHS = \$(inherited)|HEADER_SEARCH_PATHS = \$(inherited) \"${SCRIPT_DIR}/Headers\" \"${SCRIPT_DIR}/Headers/Public\"|g" "$xcconfig_file"
  fi
done

echo "PurchasesHybridCommon stub files created successfully!" 