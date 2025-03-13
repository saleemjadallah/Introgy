#!/bin/bash

# Script to copy RevenueCat stub files to the Pods directory
# This should be run at the very beginning of the CI build process

# Source and destination directories
SRC_DIR="revenuecat_stubs/Sources"
DEST_DIR="/Volumes/workspace/repository/ios/App/Pods/RevenueCat/Sources"

echo "Copying RevenueCat stub files from $SRC_DIR to $DEST_DIR"

# Make sure destination directory exists
mkdir -p "$DEST_DIR"

# Copy all files, maintaining directory structure
cp -R "$SRC_DIR"/* "$DEST_DIR"

# Verify the copy operation
COPIED_FILES=$(find "$DEST_DIR" -type f -name "*.swift" | wc -l)
echo "✅ Copied $COPIED_FILES RevenueCat stub files to Pods directory"

# Create Swift module files in build directory
mkdir -p "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64"
touch "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftdoc"
touch "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftmodule"
touch "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat-Swift.h" 
touch "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftinterface"

# Also create for Release configuration
mkdir -p "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/ArchiveIntermediates/App/IntermediateBuildFilesPath/Pods.build/Release-iphoneos/RevenueCat.build/Objects-normal/arm64"
touch "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/ArchiveIntermediates/App/IntermediateBuildFilesPath/Pods.build/Release-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftdoc"
touch "/Volumes/workspace/DerivedData/Build/Intermediates.noindex/ArchiveIntermediates/App/IntermediateBuildFilesPath/Pods.build/Release-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftmodule"

echo "✅ Created RevenueCat Swift module files in build directories"

exit 0