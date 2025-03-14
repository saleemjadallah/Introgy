#!/bin/bash

echo "Starting RevenueCat fix for Xcode Cloud..."

WORKSPACE_DIR="/Volumes/workspace/repository"
IOS_DIR="$WORKSPACE_DIR/ios/App"
PODS_DIR="$IOS_DIR/Pods"
REVENUECAT_DIR="$PODS_DIR/RevenueCat"
SOURCES_DIR="$REVENUECAT_DIR/Sources"

# Create necessary directories
mkdir -p "$SOURCES_DIR"

# Copy RevenueCat source files from the repository
echo "Copying RevenueCat source files..."
cp -R "$WORKSPACE_DIR/revenuecat_sources/Sources/"* "$SOURCES_DIR/"

# Verify files were copied
if [ -d "$SOURCES_DIR/Purchasing" ] && [ -d "$SOURCES_DIR/Attribution" ]; then
    echo "✅ RevenueCat source files copied successfully"
else
    echo "⚠️ Failed to copy RevenueCat source files"
    exit 1
fi

# Set correct permissions
chmod -R 755 "$SOURCES_DIR"

echo "RevenueCat fix completed"
exit 0 