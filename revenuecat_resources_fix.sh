#!/bin/bash

# Script to add RevenueCat resource bundle files
# This ensures Xcode Cloud can find them in /Volumes/workspace/repository/ios/App/Pods/Target Support Files/RevenueCat

echo "Setting up RevenueCat resource bundle files..."

# Create directory
mkdir -p "ios/App/Pods/Target Support Files/RevenueCat"

# Copy the resource bundle info plist
cp ResourceBundle-RevenueCat-RevenueCat-Info.plist "ios/App/Pods/Target Support Files/RevenueCat/"
echo "Added ResourceBundle-RevenueCat-RevenueCat-Info.plist to ios/App/Pods/Target Support Files/RevenueCat/"

echo "RevenueCat resource bundle files setup complete."
echo "These files will be available at /Volumes/workspace/repository/ios/App/Pods/Target Support Files/RevenueCat/ in Xcode Cloud"