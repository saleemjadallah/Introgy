#!/bin/bash

# Run this script with sudo

echo "Setting up all necessary directories and files..."

# Create directory structure
sudo mkdir -p "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"
sudo mkdir -p "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App"

# Create the header file
sudo tee "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h" > /dev/null << 'EOF'
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

# Also create the framework file lists
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
INPUT_LIST="\${PODS_ROOT}/Target Support Files/Pods-App/Pods-App-frameworks.sh"
for framework in "${FRAMEWORKS[@]}"; do
  if [ "$framework" == "CapacitorCordova" ]; then
    INPUT_LIST+="\n\${BUILT_PRODUCTS_DIR}/${framework}/Cordova.framework"
  else
    INPUT_LIST+="\n\${BUILT_PRODUCTS_DIR}/${framework}/${framework}.framework"
  fi
done

# Create output list
OUTPUT_LIST=""
for framework in "${FRAMEWORKS[@]}"; do
  if [ "$framework" == "CapacitorCordova" ]; then
    OUTPUT_LIST+="\${TARGET_BUILD_DIR}/\${FRAMEWORKS_FOLDER_PATH}/Cordova.framework\n"
  else
    OUTPUT_LIST+="\${TARGET_BUILD_DIR}/\${FRAMEWORKS_FOLDER_PATH}/${framework}.framework\n"
  fi
done

# Write the lists to the volume path for both Debug and Release
echo -e "$INPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-input-files.xcfilelist" > /dev/null
echo -e "$INPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-input-files.xcfilelist" > /dev/null
echo -e "$OUTPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-output-files.xcfilelist" > /dev/null
echo -e "$OUTPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-output-files.xcfilelist" > /dev/null

# Set proper permissions for all files
sudo chmod 644 "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h"
sudo chmod 644 "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/"*.xcfilelist

echo "All files created successfully!" 