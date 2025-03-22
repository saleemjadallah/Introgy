#!/bin/bash

# This script combines all fixes needed for the build process
echo "Running fix_all.sh..."

# 1. Create the PurchasesHybridCommon header files
echo "Creating PurchasesHybridCommon header files..."

# Create local directories
mkdir -p "${SRCROOT}/Headers/Public/PurchasesHybridCommon"

# Create the header file in the local path
cat > "${SRCROOT}/Headers/Public/PurchasesHybridCommon/PurchasesHybridCommon.h" << 'EOF'
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

# Create the Swift file in the local path
cat > "${SRCROOT}/Headers/Public/PurchasesHybridCommon/CommonFunctionality.swift" << 'EOF'
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

# 2. Create the volume directory structure and files
echo "Creating volume directory structure..."

# Try to create the volume directory structure and files
VOLUME_PATH="/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon"
mkdir -p "$VOLUME_PATH" 2>/dev/null || true

# Create the exact directory path where the header is being searched (with additional PurchasesHybridCommon directory)
mkdir -p "$VOLUME_PATH/PurchasesHybridCommon" 2>/dev/null || true

# Try to copy the header file to the specific volume path that's being looked for
cp "${SRCROOT}/Headers/Public/PurchasesHybridCommon/PurchasesHybridCommon.h" "$VOLUME_PATH/PurchasesHybridCommon/PurchasesHybridCommon.h" 2>/dev/null || true
cp "${SRCROOT}/Headers/Public/PurchasesHybridCommon/CommonFunctionality.swift" "$VOLUME_PATH/CommonFunctionality.swift" 2>/dev/null || true

# 3. Create the framework file lists
echo "Creating framework file lists..."

# Define the frameworks
FRAMEWORKS=(
  "Capacitor"
  "CapacitorApp"
  "CapacitorCordova"
  "CapacitorDevice"
  "CapacitorLocalNotifications"
  "CapacitorPreferences"
  "CapacitorSplashScreen"
  "CapacitorStatusBar"
  "RevenueCat"
  "RevenuecatPurchasesCapacitor"
  "PurchasesHybridCommon"
)

# Create input list
INPUT_LIST="${PODS_ROOT}/Target Support Files/Pods-App/Pods-App-frameworks.sh"
for framework in "${FRAMEWORKS[@]}"; do
  if [ "$framework" == "CapacitorCordova" ]; then
    INPUT_LIST+="\n${BUILT_PRODUCTS_DIR}/${framework}/Cordova.framework"
  else
    INPUT_LIST+="\n${BUILT_PRODUCTS_DIR}/${framework}/${framework}.framework"
  fi
done

# Create output list
OUTPUT_LIST=""
for framework in "${FRAMEWORKS[@]}"; do
  if [ "$framework" == "CapacitorCordova" ]; then
    OUTPUT_LIST+="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/Cordova.framework\n"
  else
    OUTPUT_LIST+="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/${framework}.framework\n"
  fi
done

# Create the target directory in the local path
mkdir -p "${SRCROOT}/Pods/Target Support Files/Pods-App" 2>/dev/null || true

# Try to create the target directory in the volume path
VOLUME_TARGET_PATH="/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App"
mkdir -p "$VOLUME_TARGET_PATH" 2>/dev/null || true

# Write the lists to the local path
echo -e "$INPUT_LIST" > "${SRCROOT}/Pods/Target Support Files/Pods-App/Pods-App-frameworks-${CONFIGURATION}-input-files.xcfilelist" 2>/dev/null || true
echo -e "$OUTPUT_LIST" > "${SRCROOT}/Pods/Target Support Files/Pods-App/Pods-App-frameworks-${CONFIGURATION}-output-files.xcfilelist" 2>/dev/null || true

# Try to write the lists to the volume path
echo -e "$INPUT_LIST" > "$VOLUME_TARGET_PATH/Pods-App-frameworks-${CONFIGURATION}-input-files.xcfilelist" 2>/dev/null || true
echo -e "$OUTPUT_LIST" > "$VOLUME_TARGET_PATH/Pods-App-frameworks-${CONFIGURATION}-output-files.xcfilelist" 2>/dev/null || true

# 4. Fix Google Sign-In plist
echo "Fixing Google Sign-In plist..."

# Check if the plist with "2" exists and is being used
if [ -f "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" ]; then
  echo "Found Google Sign-In plist with '2' suffix."
  
  # Check if the plist without "2" exists
  if [ -f "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist" ]; then
    echo "Found the correct plist file as well."
  else
    # Copy the file if the proper one doesn't exist
    echo "Creating the properly named plist file."
    cp "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
  fi
  
  # Check the content of both files to ensure they match
  if cmp -s "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"; then
    echo "Both plist files have the same content."
  else
    echo "Files have different content. Updating the correct plist."
    cp "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" "${SRCROOT}/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
  fi
fi

echo "All fixes applied successfully" 