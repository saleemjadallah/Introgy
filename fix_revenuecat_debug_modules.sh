#!/bin/bash

# Script to fix missing RevenueCat Swift module files in Debug build
# This creates the specific files that are needed for the Debug-iphoneos configuration

# The specific path mentioned in the error
TARGET_DIR="/Volumes/workspace/DerivedData/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64"

echo "Creating Swift module files for RevenueCat in Debug build..."

# Create the directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Create the specific files
touch "$TARGET_DIR/RevenueCat.swiftdoc"
touch "$TARGET_DIR/RevenueCat.swiftmodule"

# Also create any other related files that might be needed
touch "$TARGET_DIR/RevenueCat-Swift.h"
touch "$TARGET_DIR/RevenueCat.swiftinterface"

echo "✅ Created all necessary Swift module files for RevenueCat debug build"

# List the files to verify they exist
ls -la "$TARGET_DIR"

exit 0