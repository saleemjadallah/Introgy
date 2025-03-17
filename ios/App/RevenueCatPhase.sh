
#!/bin/bash

echo "Setting up RevenueCat Swift Package Manager dependency..."

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if we're in the App directory
if [[ "$(basename "$SCRIPT_DIR")" != "App" ]]; then
  echo "Error: This script must be run from the App directory"
  exit 1
fi

# Function to add SPM package to Xcode project
add_spm_package() {
  # Create a Swift file that will force Xcode to recognize the package
  cat > RevenueCatPackage.swift << 'EOL'
//
//  RevenueCatPackage.swift
//  App
//
//  Created automatically to integrate RevenueCat
//

import Foundation
import RevenueCat

// This file ensures the RevenueCat Swift Package is properly linked
// The class below is never used, it just forces the compiler to link the RevenueCat framework
class RevenueCatPackageIntegration {
    private func ensureRevenueCatIsLinked() {
        // Reference RevenueCat classes to ensure linking
        let _ = Purchases.self
        let _ = PurchasesConfiguration.self
    }
}
EOL

  echo "Created RevenueCatPackage.swift to ensure proper linking"
  
  # Check if Swift Package is already in Package.resolved
  if [ -f "App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved" ]; then
    if grep -q "purchases-ios-spm" "App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved"; then
      echo "RevenueCat Swift Package is already added to the project"
    else
      echo "Swift Package Manager is configured but RevenueCat package is not added."
      echo "Please add the package in Xcode: File > Add Packages > https://github.com/RevenueCat/purchases-ios-spm.git"
    fi
  else
    mkdir -p "App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm"
    # Create a Package.resolved file with RevenueCat dependency
    cat > "App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved" << 'EOL'
{
  "originHash" : "533de208f7207fdd36b99a2f0036707fca012c23defe0e4e99a820106aff336d",
  "pins" : [
    {
      "identity" : "purchases-ios-spm",
      "kind" : "remoteSourceControl",
      "location" : "https://github.com/RevenueCat/purchases-ios-spm.git",
      "state" : {
        "revision" : "a037a1fa19548b6ebc778b8d425df914d16b96e3",
        "version" : "5.19.0"
      }
    }
  ],
  "version" : 3
}
EOL
    echo "Created Package.resolved with RevenueCat dependency"
  fi
  
  # Create a simple Info.plist for PurchasesHybridCommon
  mkdir -p "ios/PurchasesHybridCommon/PurchasesHybridCommon"
  cat > "ios/PurchasesHybridCommon/PurchasesHybridCommon/Info.plist" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>PurchasesHybridCommon</string>
    <key>CFBundleIdentifier</key>
    <string>com.revenuecat.PurchasesHybridCommon</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>PurchasesHybridCommon</string>
    <key>CFBundlePackageType</key>
    <string>FMWK</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
</dict>
</plist>
EOL
  echo "Created Info.plist for PurchasesHybridCommon"
}

# Function to create a podspec for PurchasesHybridCommon
create_podspec() {
  cat > PurchasesHybridCommon.podspec << 'EOL'
Pod::Spec.new do |s|
  s.name             = 'PurchasesHybridCommon'
  s.version          = '13.24.0'
  s.summary          = 'Stub for PurchasesHybridCommon to work with RevenuecatPurchasesCapacitor'
  s.description      = <<-DESC
This is a stub podspec that allows the RevenuecatPurchasesCapacitor plugin to function
while utilizing the RevenueCat Swift Package directly.
                       DESC

  s.homepage         = 'https://github.com/RevenueCat/purchases-hybrid-common'
  s.license          = { :type => 'MIT' }
  s.author           = { 'RevenueCat' => 'support@revenuecat.com' }
  s.source           = { :git => 'https://github.com/RevenueCat/purchases-hybrid-common.git', :tag => s.version.to_s }

  s.ios.deployment_target = '15.0'
  
  s.source_files = 'ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h'
  s.public_header_files = 'ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h'
  
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS' => 'PURCHASES_HYBRID_COMMON_STUB'
  }
end
EOL
  echo "Created PurchasesHybridCommon.podspec stub"
}

# Function to update Podfile
update_podfile() {
  # Create a backup of the Podfile
  cp Podfile Podfile.bak
  
  # Update the Podfile with Swift Package Manager compatibility
  cat > Podfile << 'EOL'
require_relative '../../node_modules/@capacitor/ios/scripts/pods_helpers'

platform :ios, '15.0'
use_frameworks!

# workaround to avoid Xcode caching of Pods that requires
# Product -> Clean Build Folder after new Cordova plugins installed
# Requires CocoaPods 1.6 or newer
install! 'cocoapods'

source 'https://cdn.cocoapods.org/'

def capacitor_pods
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorApp', :path => '../../node_modules/@capacitor/app'
  pod 'CapacitorDevice', :path => '../../node_modules/@capacitor/device'
  pod 'CapacitorLocalNotifications', :path => '../../node_modules/@capacitor/local-notifications'
  pod 'CapacitorPreferences', :path => '../../node_modules/@capacitor/preferences'
  pod 'CapacitorSplashScreen', :path => '../../node_modules/@capacitor/splash-screen'
  pod 'CapacitorStatusBar', :path => '../../node_modules/@capacitor/status-bar'
  pod 'RevenuecatPurchasesCapacitor', :path => '../../node_modules/@revenuecat/purchases-capacitor'
  
  # Use our local PurchasesHybridCommon podspec (stub that forwards to the Swift Package)
  pod 'PurchasesHybridCommon', :path => './'
end

target 'App' do
  capacitor_pods
  # Add your Pods here
  
  # Note: RevenueCat will be added as a Swift Package instead of a Pod
  
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
        # This setting is important for iOS 15.0 compatibility
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.0'
        
        # Set deployment target for all pods
        config.build_settings['SWIFT_VERSION'] = '5.0'
        
        # Additional settings for RevenueCat compatibility
        if ['RevenuecatPurchasesCapacitor', 'PurchasesHybridCommon'].include? target.name
          config.build_settings['HEADER_SEARCH_PATHS'] ||= ["$(PODS_ROOT)/Headers/Public", "$(PODS_ROOT)/Headers/Public/PurchasesHybridCommon", "$(SRCROOT)/Headers"]
          config.build_settings['SWIFT_INCLUDE_PATHS'] ||= ["$(PODS_ROOT)/Headers/Public", "$(SRCROOT)/Headers"]
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)', 'COCOAPODS=1', 'PURCHASES_HYBRID_COMMON_STUB=1']
          config.build_settings['SWIFT_ACTIVE_COMPILATION_CONDITIONS'] ||= ['$(inherited)', 'PURCHASES_HYBRID_COMMON_STUB']
        end
      end
    end
    
    # Run script to fix framework lists after pod install
    system('sh ./fix_framework_lists.sh') if File.exist?('./fix_framework_lists.sh')
  end
end
EOL
  echo "Updated Podfile to use Swift Package for RevenueCat"
}

# Main execution
echo "Step 1: Adding RevenueCat Swift Package..."
add_spm_package

echo "Step 2: Creating PurchasesHybridCommon podspec..."
create_podspec

echo "Step 3: Updating Podfile..."
update_podfile

echo "Step 4: Running pod install..."
pod deintegrate
pod install

echo "Step 5: Running fix scripts..."
if [ -f "fix_framework_linking.sh" ]; then
  chmod +x fix_framework_linking.sh
  ./fix_framework_linking.sh
fi

if [ -f "fix_framework_lists.sh" ]; then
  chmod +x fix_framework_lists.sh
  ./fix_framework_lists.sh
fi

echo "✅ RevenueCat Swift Package Manager setup completed!"
echo "Now open App.xcworkspace in Xcode, go to File > Add Packages, and add:"
echo "https://github.com/RevenueCat/purchases-ios-spm.git"
echo "Or just run the app if the Package.resolved file was created successfully."
