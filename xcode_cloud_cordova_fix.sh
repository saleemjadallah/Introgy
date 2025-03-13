#!/bin/bash

# Enhanced Cordova header file fix script for Xcode Cloud
echo "Running Cordova header file fix for Xcode Cloud..."

# This script specifically addresses missing header files:
# - CDVViewController.h
# - CDVInvokedUrlCommand.h
# - NSDictionary+CordovaPreferences.h

# Set the base directory
BASE_DIR="$CI_WORKSPACE"
if [ -z "$BASE_DIR" ]; then
  BASE_DIR="$(pwd)"
fi
echo "Base directory: $BASE_DIR"

# Create directories for header files
mkdir -p "$BASE_DIR/ios/App/Pods/Headers/Public/CapacitorCordova"
mkdir -p "$BASE_DIR/ios/CapacitorHeaders/CapacitorCordova/Classes/Public"

# Define source paths
CAPACITOR_IOS_PATH="$BASE_DIR/node_modules/@capacitor/ios"
CORDOVA_PATH="$CAPACITOR_IOS_PATH/CapacitorCordova"
CORDOVA_CLASSES_PATH="$CORDOVA_PATH/CapacitorCordova/Classes/Public"

# Check if node_modules/@capacitor/ios exists
if [ ! -d "$CAPACITOR_IOS_PATH" ]; then
  echo "Error: Capacitor iOS directory not found at $CAPACITOR_IOS_PATH"
  exit 1
fi

# Check if header files exist in node_modules
if [ ! -f "$CORDOVA_CLASSES_PATH/CDVViewController.h" ]; then
  echo "Error: Cordova header files not found at expected location"
  exit 1
fi

echo "Source Cordova header files found at: $CORDOVA_CLASSES_PATH"

# Copy CapacitorCordova header files
echo "Copying Cordova header files..."

# Copy all files from Classes/Public directory
if [ -d "$CORDOVA_CLASSES_PATH" ]; then
  cp -R "$CORDOVA_CLASSES_PATH/"* "$BASE_DIR/ios/App/Pods/Headers/Public/CapacitorCordova/"
  cp -R "$CORDOVA_CLASSES_PATH/"* "$BASE_DIR/ios/CapacitorHeaders/CapacitorCordova/Classes/Public/"
  echo "Copied Cordova Class header files"
else
  echo "Error: Cordova Classes directory not found"
  exit 1
fi

# Copy the main CapacitorCordova.h file
if [ -f "$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h" ]; then
  cp "$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h" "$BASE_DIR/ios/App/Pods/Headers/Public/CapacitorCordova/"
  cp "$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h" "$BASE_DIR/ios/CapacitorHeaders/CapacitorCordova/"
  echo "Copied CapacitorCordova.h"
else
  echo "Warning: CapacitorCordova.h not found at expected location"
fi

# Update Pods xcconfig files to include header search paths
echo "Updating Pods xcconfig files..."

for config in "$BASE_DIR/ios/App/Pods/Target Support Files/Pods-App/"Pods-App.*.xcconfig; do
  echo "Updating $config"
  # Add header search paths if not already present
  if ! grep -q "CapacitorHeaders" "$config"; then
    echo "HEADER_SEARCH_PATHS = \$(inherited) \$(SRCROOT)/../CapacitorHeaders \$(SRCROOT)/Pods/Headers/Public/CapacitorCordova \$(SRCROOT)/../../node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public" >> "$config"
  fi
done

# Function to check for header files
check_cordova_headers() {
  local missing=0
  
  # List of critical Cordova header files
  local header_files=(
    "CDVViewController.h"
    "CDVInvokedUrlCommand.h"
    "NSDictionary+CordovaPreferences.h"
    "CDVPlugin.h"
    "CDVPluginResult.h"
    "CDVCommandDelegate.h"
    "CDVConfigParser.h"
  )
  
  echo "Checking for critical Cordova header files..."
  for header in "${header_files[@]}"; do
    if [ ! -f "$BASE_DIR/ios/App/Pods/Headers/Public/CapacitorCordova/$header" ]; then
      echo "Warning: $header not found in Pods/Headers/Public/CapacitorCordova"
      missing=1
    else
      echo "✓ Found $header"
    fi
  done
  
  if [ $missing -eq 1 ]; then
    echo "Some header files are still missing. Build may fail."
    exit 1
  else
    echo "All critical header files are present."
  fi
}

# Verify header files are properly copied
check_cordova_headers

echo "Cordova header file fix completed successfully!"