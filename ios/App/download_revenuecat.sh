#!/bin/bash

echo "Downloading RevenueCat source files..."

# Define directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
REVENUECAT_SOURCES_DIR="$WORKSPACE_DIR/revenuecat_sources"
TEMP_DIR="/tmp/revenuecat_download"

# Create directories
mkdir -p "$TEMP_DIR"
mkdir -p "$REVENUECAT_SOURCES_DIR"

# Download RevenueCat SDK
echo "Downloading RevenueCat SDK..."
curl -L "https://github.com/RevenueCat/purchases-ios/archive/refs/tags/5.19.0.zip" -o "$TEMP_DIR/revenuecat.zip"

# Unzip and copy files
echo "Extracting files..."
unzip -q "$TEMP_DIR/revenuecat.zip" -d "$TEMP_DIR"
cp -R "$TEMP_DIR/purchases-ios-5.19.0/Sources" "$REVENUECAT_SOURCES_DIR/"

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ RevenueCat source files downloaded successfully"
exit 0