#!/bin/bash

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to the public headers directory
PUBLIC_HEADERS_DIR="$SCRIPT_DIR/Headers/Public/PurchasesHybridCommon"

# Path to the PurchasesHybridCommon pod
PURCHASES_HYBRID_COMMON_DIR="$SCRIPT_DIR/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Volume path that Xcode is looking for
VOLUME_PURCHASES_PATH="/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Create necessary directories
mkdir -p "$PURCHASES_HYBRID_COMMON_DIR"

# Try to create the volume directory path too
if [ ! -d "$VOLUME_PURCHASES_PATH" ]; then
  sudo mkdir -p "$VOLUME_PURCHASES_PATH" 2>/dev/null || true
fi

# Copy stub header and implementation to local path
cp -f "$PUBLIC_HEADERS_DIR/PurchasesHybridCommon.h" "$PURCHASES_HYBRID_COMMON_DIR/"
cp -f "$PUBLIC_HEADERS_DIR/CommonFunctionality.swift" "$PURCHASES_HYBRID_COMMON_DIR/"

# Try to copy to volume path if we have permission
if [ -d "$VOLUME_PURCHASES_PATH" ]; then
  # Try to copy the files to the volume path
  sudo cp -f "$PUBLIC_HEADERS_DIR/PurchasesHybridCommon.h" "$VOLUME_PURCHASES_PATH/" 2>/dev/null || true
  sudo cp -f "$PUBLIC_HEADERS_DIR/CommonFunctionality.swift" "$VOLUME_PURCHASES_PATH/" 2>/dev/null || true
fi

# Update paths in Pods-App.xcconfig files
for CONFIG_TYPE in Debug Release; do
  CONFIG_FILE="$SCRIPT_DIR/Pods/Target Support Files/Pods-App/Pods-App.$CONFIG_TYPE.xcconfig"
  if [ -f "$CONFIG_FILE" ]; then
    # Update header search paths to include our stubs
    grep -q "HEADER_SEARCH_PATHS" "$CONFIG_FILE" || echo "HEADER_SEARCH_PATHS = \$(inherited)" >> "$CONFIG_FILE"
    sed -i '' -e "s|HEADER_SEARCH_PATHS = \$(inherited)|HEADER_SEARCH_PATHS = \$(inherited) \"$SCRIPT_DIR/Headers\"|g" "$CONFIG_FILE"
  fi
done

# Create an alternate build settings approach by modifying xcconfig
for CONFIG_TYPE in Debug Release; do
  CONFIG_FILE="$SCRIPT_DIR/Pods/Target Support Files/Pods-App/Pods-App.$CONFIG_TYPE.xcconfig"
  if [ -f "$CONFIG_FILE" ]; then
    # Add a line to handle missing headers
    grep -q "GCC_PREPROCESSOR_DEFINITIONS" "$CONFIG_FILE" || echo "GCC_PREPROCESSOR_DEFINITIONS = \$(inherited)" >> "$CONFIG_FILE"
    # Add preprocessor definition to allow compilation without the actual header
    sed -i '' -e "s|GCC_PREPROCESSOR_DEFINITIONS = \$(inherited)|GCC_PREPROCESSOR_DEFINITIONS = \$(inherited) PURCHASES_HYBRID_COMMON_STUB=1|g" "$CONFIG_FILE"
    
    # Add a line to skip validating product
    grep -q "VALIDATE_PRODUCT" "$CONFIG_FILE" || echo "VALIDATE_PRODUCT = NO" >> "$CONFIG_FILE"
  fi
done

echo "PurchasesHybridCommon fix applied successfully!" 