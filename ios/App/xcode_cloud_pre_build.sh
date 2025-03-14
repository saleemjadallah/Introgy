#!/bin/bash

echo "Starting Xcode Cloud pre-build script..."

WORKSPACE_DIR="/Volumes/workspace/repository"
IOS_DIR="$WORKSPACE_DIR/ios/App"
REVENUECAT_SOURCES="$WORKSPACE_DIR/revenuecat_sources/Sources"
PODS_DIR="$IOS_DIR/Pods"
TARGET_DIR="$PODS_DIR/RevenueCat/Sources"

# Create necessary directories
mkdir -p "$TARGET_DIR"

# Ensure RevenueCat source files are present
if [ ! -d "$REVENUECAT_SOURCES" ]; then
    echo "⚠️ RevenueCat sources not found, downloading..."
    
    # Create temp directory
    TEMP_DIR="/tmp/revenuecat_download"
    mkdir -p "$TEMP_DIR"
    
    # Download RevenueCat SDK
    curl -L "https://github.com/RevenueCat/purchases-ios/archive/refs/tags/5.19.0.zip" -o "$TEMP_DIR/revenuecat.zip"
    
    # Extract files
    unzip -q "$TEMP_DIR/revenuecat.zip" -d "$TEMP_DIR"
    
    # Create sources directory and copy files
    mkdir -p "$REVENUECAT_SOURCES"
    cp -R "$TEMP_DIR/purchases-ios-5.19.0/Sources/"* "$REVENUECAT_SOURCES/"
    
    # Cleanup
    rm -rf "$TEMP_DIR"
fi

# Copy source files to Pods directory
echo "Copying RevenueCat source files to Pods directory..."
cp -R "$REVENUECAT_SOURCES/"* "$TARGET_DIR/"

# Set permissions
chmod -R 755 "$TARGET_DIR"

# Verify critical files
CRITICAL_FILES=(
    "Purchasing/Purchases/Purchases.swift"
    "Attribution/AttributionFetcher.swift"
    "Error Handling/Assertions.swift"
    "Logging/Strings/AnalyticsStrings.swift"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$TARGET_DIR/$file" ]; then
        echo "⚠️ Critical file missing: $file"
        exit 1
    fi
done

echo "✅ RevenueCat files successfully prepared for Xcode Cloud build"
exit 0 