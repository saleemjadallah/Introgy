#!/bin/bash

# Script to add RevenueCat PrivacyInfo.xcprivacy file
# This ensures Xcode Cloud can find it at /Volumes/workspace/repository/ios/App/Pods/RevenueCat/Sources/

echo "Setting up RevenueCat privacy file..."

# Create directory
mkdir -p ios/App/Pods/RevenueCat/Sources

# Copy the privacy file
cp PrivacyInfo.xcprivacy ios/App/Pods/RevenueCat/Sources/
echo "Added PrivacyInfo.xcprivacy to ios/App/Pods/RevenueCat/Sources/"

echo "RevenueCat privacy file setup complete."
echo "This file will be available at /Volumes/workspace/repository/ios/App/Pods/RevenueCat/Sources/ in Xcode Cloud"