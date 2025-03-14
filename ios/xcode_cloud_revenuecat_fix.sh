#!/bin/bash

# Script to fix RevenueCat issues in Xcode Cloud

echo "Preparing RevenueCat for Xcode Cloud build..."

# Define paths
WORKSPACE_PATH="/Volumes/workspace"
REPO_PATH="${WORKSPACE_PATH}/repository"
DERIVED_PATH="${WORKSPACE_PATH}/DerivedData"
PODS_PATH="${REPO_PATH}/ios/App/Pods"
REVENUECAT_PATH="${PODS_PATH}/RevenueCat"

# 1. Create directories if missing
mkdir -p "${REVENUECAT_PATH}/Sources"

# 2. Ensure build output declarations exist
mkdir -p "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64"
touch "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftmodule"
touch "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftdoc"
touch "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat-Swift.h"

# 3. Add preprocessor definition to disable custom entitlement computation
if [ -f "${PODS_PATH}/Pods.xcodeproj/project.pbxproj" ]; then
  sed -i '' 's/GCC_PREPROCESSOR_DEFINITIONS = /GCC_PREPROCESSOR_DEFINITIONS = RC_DISABLE_CUSTOM_ENTITLEMENTS_COMPUTATION=1 /g' "${PODS_PATH}/Pods.xcodeproj/project.pbxproj"
fi

echo "RevenueCat Xcode Cloud preparation complete"
