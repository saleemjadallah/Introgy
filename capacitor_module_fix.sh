#!/bin/bash

# Script to add Capacitor header files directly to node_modules
# This ensures Xcode Cloud can find them at /Volumes/workspace/repository/node_modules

echo "Setting up Capacitor header files in node_modules..."

# Create directories
mkdir -p node_modules/@capacitor/ios/Capacitor/Capacitor

# Copy the standalone header to each required header file in node_modules
for header in "Capacitor.h" "CAPPluginCall.h" "CAPInstanceDescriptor.h" "CAPPlugin.h" "CAPBridgedJSTypes.h" "CAPInstanceConfiguration.h" "CAPBridgedPlugin.h" "CAPPluginMethod.h" "CAPBridgeViewController+CDVScreenOrientationDelegate.h"; do
  cp capacitor_header_standalone.h "node_modules/@capacitor/ios/Capacitor/Capacitor/$header"
  echo "Created $header"
done

echo "Capacitor module setup complete. All required header files have been placed in node_modules/@capacitor/ios/Capacitor/Capacitor/"
echo "These files will be available at /Volumes/workspace/repository/node_modules/@capacitor/ios/Capacitor/Capacitor/ in Xcode Cloud"