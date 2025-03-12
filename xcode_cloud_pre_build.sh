#!/bin/bash

# Pre-build script for Xcode Cloud
echo "Running pre-build script for Xcode Cloud..."

# Check if we're in Xcode Cloud environment
if [[ ! -z "$CI_XCODE_CLOUD" ]]; then
  echo "Running in Xcode Cloud environment"
  
  # Print working directory for debugging
  echo "Working directory: $(pwd)"
  
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
  
  # Fix permissions
  echo "Setting permissions for script files..."
  find . -name "*.sh" -print0 | xargs -0 chmod +x
  
  echo "Pre-build script completed successfully"
else
  echo "Not running in Xcode Cloud, skipping pre-build steps"
fi