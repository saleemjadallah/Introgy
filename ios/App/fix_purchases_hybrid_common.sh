#!/bin/bash

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to the public headers directory
PUBLIC_HEADERS_DIR="$SCRIPT_DIR/Headers/Public/PurchasesHybridCommon"

# Path to the PurchasesHybridCommon pod
PURCHASES_HYBRID_COMMON_DIR="$SCRIPT_DIR/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Create necessary directories
mkdir -p "$PURCHASES_HYBRID_COMMON_DIR"

# Copy stub header and implementation
cp -f "$PUBLIC_HEADERS_DIR/PurchasesHybridCommon.h" "$PURCHASES_HYBRID_COMMON_DIR/"
cp -f "$PUBLIC_HEADERS_DIR/CommonFunctionality.swift" "$PURCHASES_HYBRID_COMMON_DIR/"

# Update paths in Pods-App.xcconfig files
for CONFIG_TYPE in Debug Release; do
  CONFIG_FILE="$SCRIPT_DIR/Pods/Target Support Files/Pods-App/Pods-App.$CONFIG_TYPE.xcconfig"
  if [ -f "$CONFIG_FILE" ]; then
    # Update header search paths to include our stubs
    grep -q "HEADER_SEARCH_PATHS" "$CONFIG_FILE" || echo "HEADER_SEARCH_PATHS = \$(inherited)" >> "$CONFIG_FILE"
    sed -i '' -e "s|HEADER_SEARCH_PATHS = \$(inherited)|HEADER_SEARCH_PATHS = \$(inherited) \"$SCRIPT_DIR/Headers\"|g" "$CONFIG_FILE"
  fi
done

echo "PurchasesHybridCommon fix applied successfully!" 