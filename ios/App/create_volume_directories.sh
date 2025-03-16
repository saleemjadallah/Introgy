#!/bin/bash

# This script needs to be run with sudo permissions once to create the necessary directory structure
# Example: sudo ./create_volume_directories.sh

# Volume paths
VOLUME_BASE="/Volumes/workspace/repository/ios/App"
VOLUME_PODS_DIR="$VOLUME_BASE/Pods"
VOLUME_PURCHASES_PATH="$VOLUME_PODS_DIR/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"
VOLUME_TARGET_SUPPORT_PATH="$VOLUME_PODS_DIR/Target Support Files/Pods-App"

# Create all necessary directories
mkdir -p "$VOLUME_PURCHASES_PATH"
mkdir -p "$VOLUME_TARGET_SUPPORT_PATH"

# Set permissions to allow writing without sudo
chmod -R 777 "$VOLUME_BASE"

echo "Volume directories created successfully at $VOLUME_BASE"
echo "You can now run the normal build without sudo." 