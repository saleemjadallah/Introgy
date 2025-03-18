#!/bin/bash

# Script to add CapacitorCordova privacy file
# This ensures Xcode Cloud can find it at /Volumes/workspace/repository/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/

echo "Setting up CapacitorCordova privacy file..."

# Create directory
mkdir -p node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova

# Copy the privacy file
cp CapacitorCordova-PrivacyInfo.xcprivacy node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/PrivacyInfo.xcprivacy
echo "Added PrivacyInfo.xcprivacy to node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/"

echo "CapacitorCordova privacy file setup complete."
echo "This file will be available at /Volumes/workspace/repository/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/ in Xcode Cloud"