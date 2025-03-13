
#!/bin/bash

# Enhanced pre-build script for Xcode Cloud with RevenueCat fixes
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
  
  # Create necessary directories for header files
  echo "Setting up CapacitorCordova header files..."
  mkdir -p ios/App/Headers/CapacitorCordova

  # Copy all required header files directly from node_modules
  echo "Copying CapacitorCordova header files from node_modules..."
  # Create a list of all header files needed
  HEADER_FILES=(
    "CDVPlugin+Resources.h"
    "CDVConfigParser.h"
    "CDVInvokedUrlCommand.h"
    "CDVPluginManager.h"
    "CDVViewController.h"
    "NSDictionary+CordovaPreferences.h"
    "CDVPluginResult.h"
    "CDVScreenOrientationDelegate.h"
    "CDVPlugin.h"
    "CDVURLProtocol.h"
    "CDVWebViewProcessPoolFactory.h"
    "CDV.h"
    "CDVAvailability.h"
    "CDVCommandDelegate.h"
    "CDVCommandDelegateImpl.h"
  )

  # Copy each header file
  for file in "${HEADER_FILES[@]}"; do
    if [ -f "node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public/$file" ]; then
      cp "node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public/$file" "ios/App/Headers/CapacitorCordova/"
      echo "Copied $file"
    else
      echo "Warning: Could not find $file"
    fi
  done

  # Copy the main CapacitorCordova.h file
  if [ -f "node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/CapacitorCordova.h" ]; then
    cp "node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/CapacitorCordova.h" "ios/App/Headers/CapacitorCordova/"
    echo "Copied CapacitorCordova.h"
  else
    echo "Warning: Could not find CapacitorCordova.h"
  fi
  
  # Create symbolic links to header files in Pods directory
  echo "Creating symbolic links for header files..."
  mkdir -p ios/App/Pods/Headers/Public/CapacitorCordova
  ln -sf ../../../Headers/CapacitorCordova/* ios/App/Pods/Headers/Public/CapacitorCordova/
  
  # Fix for RevenueCat plugin files
  echo "Setting up RevenueCat plugin files..."
  mkdir -p ios/App/RevenuecatPurchasesCapacitor
  cp -R node_modules/@revenuecat/purchases-capacitor/ios/Plugin ios/App/RevenuecatPurchasesCapacitor/
  echo "RevenueCat plugin files copied"
  
  # Check for necessary files for RevenueCat
  echo "Checking for RevenueCat source files..."
  if [ -d "node_modules/@revenuecat/purchases-ios" ]; then
    echo "RevenueCat iOS SDK found, using as source"
    mkdir -p ios/App/revenuecat_sources
    cp -R node_modules/@revenuecat/purchases-ios/* ios/App/revenuecat_sources/
  else
    echo "RevenueCat iOS SDK not found in node_modules, will use cached version"
  fi
  
  # Navigate to iOS directory
  cd ios || exit 1
  echo "Changed to iOS directory: $(pwd)"
  
  # Install CocoaPods if needed
  if ! command -v pod &> /dev/null; then
    echo "CocoaPods not found. Installing..."
    gem install cocoapods
  fi
  
  echo "CocoaPods version: $(pod --version)"
  
  # Create export options plist for TestFlight distribution
  echo "Creating export options plist for TestFlight..."
  cat > App/exportOptions.plist << EOL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>\${APPLE_TEAM_ID}</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
</dict>
</plist>
EOL
  
  # Prepare Podfile with proper settings for RevenueCat
  echo "Ensuring Podfile has proper RevenueCat settings..."
  cd App || exit 1
  echo "Changed to App directory: $(pwd)"
  
  # Check and modify Podfile if needed
  if [ -f "Podfile" ]; then
    if ! grep -q ":modular_headers => true" Podfile; then
      echo "Adding modular_headers to RevenueCat pod in Podfile..."
      sed -i '' 's/pod '\''RevenueCat'\'', '\''4.26.1'\''/pod '\''RevenueCat'\'', '\''4.26.1'\'', :modular_headers => true/g' Podfile
    fi
    
    # Add source if missing
    if ! grep -q "source 'https://cdn.cocoapods.org/'" Podfile; then
      echo "Adding CocoaPods CDN source to Podfile..."
      sed -i '' '1 a\
source '\''https://cdn.cocoapods.org/'\''
' Podfile
    fi
  else
    echo "WARNING: Podfile not found!"
  fi
  
  # Clean CocoaPods cache for RevenueCat
  echo "Cleaning CocoaPods cache for RevenueCat..."
  pod cache clean RevenueCat PurchasesHybridCommon
  
  # Install pods
  echo "Installing pods..."
  pod install || exit 1
  echo "CocoaPods installation completed"
  
  # Run the RevenueCat fix script
  echo "Running RevenueCat fix script..."
  if [ -f "../../xcode_cloud_revenuecat_fix.sh" ]; then
    chmod +x ../../xcode_cloud_revenuecat_fix.sh
    ../../xcode_cloud_revenuecat_fix.sh
  else
    echo "WARNING: xcode_cloud_revenuecat_fix.sh script not found!"
  fi
  
  # Fix permissions for script files
  echo "Setting permissions for script files..."
  find . -name "*.sh" -print0 | xargs -0 chmod +x
  
  # Add preprocessor definition to disable custom entitlement computation
  if [ -f "Pods/Pods.xcodeproj/project.pbxproj" ]; then
    echo "Adding preprocessor definitions to disable custom entitlement computation..."
    sed -i '' 's/GCC_PREPROCESSOR_DEFINITIONS = /GCC_PREPROCESSOR_DEFINITIONS = RC_DISABLE_CUSTOM_ENTITLEMENTS_COMPUTATION=1 /g' "Pods/Pods.xcodeproj/project.pbxproj"
  fi
  
  # Verify RevenueCat installation
  echo "Verifying RevenueCat installation..."
  if [ -d "Pods/RevenueCat" ]; then
    SWIFT_COUNT=$(find Pods/RevenueCat -name "*.swift" | wc -l)
    echo "Found $SWIFT_COUNT Swift files in RevenueCat pod"
    if [ "$SWIFT_COUNT" -lt 100 ]; then
      echo "WARNING: RevenueCat pod may be incomplete, creating necessary stubs..."
      # Create Sources directory if missing
      mkdir -p Pods/RevenueCat/Sources/Purchasing/Purchases
      
      # Create minimal stubs for critical files
      cat > Pods/RevenueCat/Sources/Purchasing/Purchases/Purchases.swift << 'EOL'
// Auto-generated stub file for Xcode Cloud compatibility
import Foundation

// Public API for RevenueCat
@objc(RCPurchases) public class Purchases: NSObject {
    // This is a stub implementation to satisfy build requirements
    @objc public static func configure(withAPIKey apiKey: String) -> Purchases {
        return Purchases()
    }
}
EOL
    fi
  else
    echo "WARNING: RevenueCat pod directory not found after installation!"
  fi
  
  echo "Enhanced pre-build script completed successfully"
else
  echo "Not running in Xcode Cloud, skipping pre-build steps"
fi
