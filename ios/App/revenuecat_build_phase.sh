#!/bin/bash

echo "Running RevenueCat Build Phase script..."

# Define paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REVENUECAT_SOURCES="$PROJECT_ROOT/revenuecat_sources/Sources"
PODS_DIR="$SCRIPT_DIR/Pods"
TARGET_DIR="$PODS_DIR/RevenueCat/Sources"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy source files
if [ -d "$REVENUECAT_SOURCES" ]; then
    echo "Copying RevenueCat source files..."
    cp -R "$REVENUECAT_SOURCES/"* "$TARGET_DIR/"
    
    # Set permissions
    chmod -R 755 "$TARGET_DIR"
    
    echo "✅ RevenueCat source files copied successfully"
else
    echo "⚠️ RevenueCat source files not found at $REVENUECAT_SOURCES"
    exit 1
fi

# Verify critical files exist
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

echo "✅ All critical files verified"
exit 0 