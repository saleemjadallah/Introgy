#!/bin/bash

echo "Downloading RevenueCat framework directly..."

REVENUECAT_VERSION="4.26.1"
TEMP_DIR=$(mktemp -d)
FRAMEWORK_URL="https://github.com/RevenueCat/purchases-ios/releases/download/${REVENUECAT_VERSION}/RevenueCat.xcframework.zip"
TARGET_DIR="Frameworks"

mkdir -p "$TARGET_DIR"

echo "Downloading RevenueCat framework from $FRAMEWORK_URL..."
curl -L "$FRAMEWORK_URL" -o "$TEMP_DIR/RevenueCat.xcframework.zip"

if [ ! -f "$TEMP_DIR/RevenueCat.xcframework.zip" ]; then
  echo "❌ Failed to download RevenueCat framework"
  exit 1
fi

echo "Extracting framework..."
unzip -o "$TEMP_DIR/RevenueCat.xcframework.zip" -d "$TEMP_DIR"

echo "Copying framework to $TARGET_DIR..."
rm -rf "$TARGET_DIR/RevenueCat.xcframework"
cp -R "$TEMP_DIR/RevenueCat.xcframework" "$TARGET_DIR/"

echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

# Verify the framework was successfully extracted
if [ -d "$TARGET_DIR/RevenueCat.xcframework" ]; then
  echo "✅ RevenueCat framework successfully downloaded and extracted to $TARGET_DIR/RevenueCat.xcframework"
  echo "Now you can add this framework to your Xcode project manually if needed."
else
  echo "❌ Failed to extract RevenueCat framework"
  exit 1
fi