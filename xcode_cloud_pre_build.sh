#!/bin/bash

# Enhanced pre-build script for Xcode Cloud
echo "Running enhanced pre-build script for Xcode Cloud..."

# Check if we're in Xcode Cloud environment
if [[ ! -z "$CI_XCODE_CLOUD" ]]; then
  echo "Running in Xcode Cloud environment"
  
  # Print working directory for debugging
  echo "Working directory: $(pwd)"

  # Install npm dependencies
  echo "Installing npm dependencies..."
  npm ci
  
  # Build the web application
  echo "Building web application..."
  npm run build
  
  # Run Capacitor sync to ensure iOS platform is properly configured
  echo "Running Capacitor sync..."
  npx cap sync ios
  
  # Fix for CapacitorCordova header files
  echo "Copying CapacitorCordova header files..."
  mkdir -p ios/App/Headers/CapacitorCordova
  cp -R node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public/* ios/App/Headers/CapacitorCordova/
  cp node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/CapacitorCordova.h ios/App/Headers/CapacitorCordova/
  echo "CapacitorCordova header files copied"
  
  # Create symbolic links to header files in Pods directory
  echo "Creating symbolic links for header files..."
  mkdir -p ios/App/Pods/Headers/Public/CapacitorCordova
  ln -sf ../../../Headers/CapacitorCordova/* ios/App/Pods/Headers/Public/CapacitorCordova/
  
  # Fix for RevenueCat plugin files
  echo "Setting up RevenueCat plugin files..."
  cp -R node_modules/@revenuecat/purchases-capacitor/ios/Plugin ios/App/RevenuecatPurchasesCapacitor/
  echo "RevenueCat plugin files copied"
  
  # Navigate to iOS directory
  cd ios || exit 1
  echo "Changed to iOS directory: $(pwd)"
  
  # Install CocoaPods if needed
  if ! command -v pod &> /dev/null; then
    echo "CocoaPods not found. Installing..."
    gem install cocoapods
  fi
  
  echo "CocoaPods version: $(pod --version)"
  
  # Install pods
  cd App || exit 1
  echo "Changed to App directory: $(pwd)"
  pod install || exit 1
  echo "CocoaPods installation completed"
  
  # Fix permissions for script files
  echo "Setting permissions for script files..."
  find . -name "*.sh" -print0 | xargs -0 chmod +x
  
  echo "Enhanced pre-build script completed successfully"
else
  echo "Not running in Xcode Cloud, skipping pre-build steps"
fi