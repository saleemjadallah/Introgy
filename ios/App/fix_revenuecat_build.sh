#!/bin/bash

echo "Fixing RevenueCat duplicate symbols issue..."

# Set path to derived data
DERIVED_DATA_PATH=~/Library/Developer/Xcode/DerivedData

# Clean derived data related to the app
echo "Cleaning derived data..."
find "$DERIVED_DATA_PATH" -name "App-*" -type d -exec rm -rf {} \; 2>/dev/null || true

# Go to app directory
cd "$(dirname "$0")"

# Ensure the script is executable
chmod +x ./RevenueCatPhase.sh

# Clean and reinstall pods
echo "Reinstalling pods..."
pod deintegrate
pod install

echo "Completed RevenueCat build fix!"