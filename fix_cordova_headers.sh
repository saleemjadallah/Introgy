#!/bin/bash

# Script to fix missing Capacitor/Cordova header files in Xcode Cloud
# This script is specifically designed to resolve header file issues with:
# - CDVViewController.h
# - CDVInvokedUrlCommand.h
# - NSDictionary+CordovaPreferences.h
# and other CapacitorCordova header files

echo "Starting Capacitor/Cordova header file fix for Xcode Cloud..."

# Set the base directory
BASE_DIR="$(pwd)"
echo "Base directory: $BASE_DIR"

# Create directories for header files
mkdir -p ios/CapacitorHeaders/CapacitorCordova/Classes/Public
mkdir -p ios/App/Pods/Headers/Public/CapacitorCordova
mkdir -p ios/App/CapacitorHeaders

# Define the node_modules path
NODE_MODULES_PATH="$BASE_DIR/node_modules"
CAPACITOR_IOS_PATH="$NODE_MODULES_PATH/@capacitor/ios"
CORDOVA_PATH="$CAPACITOR_IOS_PATH/CapacitorCordova"
CORDOVA_CLASSES_PATH="$CORDOVA_PATH/CapacitorCordova/Classes/Public"

# Check if node_modules/@capacitor/ios exists
if [ ! -d "$CAPACITOR_IOS_PATH" ]; then
  echo "Error: Capacitor iOS directory not found at $CAPACITOR_IOS_PATH"
  echo "Installing @capacitor/ios..."
  npm install @capacitor/ios
fi

# Check if header files exist in node_modules
if [ ! -f "$CORDOVA_CLASSES_PATH/CDVViewController.h" ]; then
  echo "Error: Cordova header files not found in node_modules"
  echo "Reinstalling Capacitor dependencies..."
  npm install @capacitor/ios @capacitor/core
fi

# Copy CapacitorCordova header files to multiple locations for redundancy
echo "Copying Cordova header files..."

# Copy the main CapacitorCordova.h file
if [ -f "$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h" ]; then
  cp "$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h" ios/CapacitorHeaders/CapacitorCordova/
  cp "$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h" ios/App/CapacitorHeaders/
  cp "$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h" ios/App/Pods/Headers/Public/CapacitorCordova/
  echo "Copied CapacitorCordova.h"
else
  echo "Warning: CapacitorCordova.h not found at expected location"
fi

# Copy all public header files
if [ -d "$CORDOVA_CLASSES_PATH" ]; then
  cp -R "$CORDOVA_CLASSES_PATH/"* ios/CapacitorHeaders/CapacitorCordova/Classes/Public/
  cp -R "$CORDOVA_CLASSES_PATH/"* ios/App/CapacitorHeaders/
  cp -R "$CORDOVA_CLASSES_PATH/"* ios/App/Pods/Headers/Public/CapacitorCordova/
  echo "Copied Cordova Class header files"
else
  echo "Warning: Cordova Classes directory not found"
fi

# Create header search path fix script for Xcode
cat > ios/fix_header_search_paths.rb << 'EOL'
#!/usr/bin/env ruby

require 'xcodeproj'

project_path = ARGV[0] || 'ios/App/App.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Add header search paths to all targets
project.targets.each do |target|
  target.build_configurations.each do |config|
    header_search_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
    
    # Convert to array if it's a string
    header_search_paths = [header_search_paths] if header_search_paths.is_a?(String)
    
    # Add our custom header search paths
    new_paths = [
      '$(SRCROOT)/CapacitorHeaders',
      '$(SRCROOT)/../CapacitorHeaders',
      '$(PODS_ROOT)/Headers/Public/CapacitorCordova',
      '$(SRCROOT)/Pods/Headers/Public/CapacitorCordova',
      '$(SRCROOT)/../../node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public'
    ]
    
    # Add new paths if they don't already exist
    new_paths.each do |path|
      header_search_paths << path unless header_search_paths.include?(path)
    end
    
    config.build_settings['HEADER_SEARCH_PATHS'] = header_search_paths
  end
end

project.save
puts "Updated header search paths in #{project_path}"
EOL

chmod +x ios/fix_header_search_paths.rb

# Function to check for header files
check_header_files() {
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
    if [ ! -f "ios/App/Pods/Headers/Public/CapacitorCordova/$header" ]; then
      echo "Warning: $header not found in Pods/Headers/Public/CapacitorCordova"
      missing=1
    else
      echo "✓ Found $header"
    fi
  done
  
  if [ $missing -eq 1 ]; then
    echo "Some header files are still missing. Additional action may be required."
  else
    echo "All critical header files present."
  fi
}

# Fix Pods project references (used by Xcode Cloud)
fix_pods_project_xcconfig() {
  if [ -f "ios/App/Pods/Target Support Files/Pods-App/Pods-App.debug.xcconfig" ]; then
    # Add header search paths to xcconfig files
    for config in ios/App/Pods/Target\ Support\ Files/Pods-App/Pods-App.*.xcconfig; do
      echo "Updating $config"
      # Add header search paths if not already present
      if ! grep -q "CapacitorHeaders" "$config"; then
        echo "HEADER_SEARCH_PATHS = \$(inherited) \$(SRCROOT)/../CapacitorHeaders \$(SRCROOT)/CapacitorHeaders \$(PODS_ROOT)/Headers/Public/CapacitorCordova" >> "$config"
      fi
    done
    echo "Updated Pod xcconfig files"
  else
    echo "Warning: Pods xcconfig files not found"
  fi
}

# Apply the header search path fix
echo "Applying header search path fix..."
if command -v ruby >/dev/null 2>&1; then
  if gem list -i xcodeproj >/dev/null 2>&1; then
    ruby ios/fix_header_search_paths.rb
  else
    echo "Ruby xcodeproj gem not found. Header search paths must be manually updated."
  fi
else
  echo "Ruby not found. Header search paths must be manually updated."
fi

# Fix the Pods xcconfig files
fix_pods_project_xcconfig

# Verify header files are properly copied
check_header_files

echo "Cordova header file fix completed!"
echo "If you still encounter issues in Xcode Cloud, add these scripts to your pre-build step."

# Create a pre-build script specifically for Xcode Cloud
cat > xcode_cloud_header_fix.sh << 'EOL'
#!/bin/bash

echo "Running Xcode Cloud header fix..."

# Create directories
mkdir -p $CI_WORKSPACE/ios/App/Pods/Headers/Public/CapacitorCordova

# Copy header files from node_modules directly
if [ -d "$CI_WORKSPACE/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public" ]; then
  cp -R $CI_WORKSPACE/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public/* $CI_WORKSPACE/ios/App/Pods/Headers/Public/CapacitorCordova/
  cp $CI_WORKSPACE/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/CapacitorCordova.h $CI_WORKSPACE/ios/App/Pods/Headers/Public/CapacitorCordova/
  echo "Copied header files from node_modules"
else
  echo "Error: Could not find Capacitor Cordova header files in node_modules"
  exit 1
fi

# Add header search paths to Xcode build settings
cat > $CI_WORKSPACE/add_header_search_paths.rb << 'RUBYEOF'
#!/usr/bin/env ruby

project_path = ENV['CI_WORKSPACE'] + '/ios/App/App.xcodeproj'
require 'xcodeproj'

begin
  project = Xcodeproj::Project.open(project_path)
  project.targets.each do |target|
    target.build_configurations.each do |config|
      header_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
      header_paths = [header_paths] if header_paths.is_a?(String)
      
      new_paths = [
        '$(SRCROOT)/Pods/Headers/Public/CapacitorCordova',
        '$(PODS_ROOT)/Headers/Public/CapacitorCordova',
        '$(SRCROOT)/../../node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public'
      ]
      
      new_paths.each do |path|
        header_paths << path unless header_paths.include?(path)
      end
      
      config.build_settings['HEADER_SEARCH_PATHS'] = header_paths
    end
  end
  
  project.save
  puts "Successfully updated header search paths in Xcode project"
rescue => e
  puts "Error updating Xcode project: #{e.message}"
  exit 1
end
RUBYEOF

if command -v ruby >/dev/null 2>&1 && gem list -i xcodeproj >/dev/null 2>&1; then
  ruby $CI_WORKSPACE/add_header_search_paths.rb
  echo "Updated header search paths in Xcode project"
else
  echo "Warning: Ruby xcodeproj gem not available. Header search paths not updated."
fi

echo "Xcode Cloud header fix completed"
EOL

chmod +x xcode_cloud_header_fix.sh

echo "Created special Xcode Cloud header fix script: xcode_cloud_header_fix.sh"
echo "Include this script in your Xcode Cloud workflow pre-build step."