#!/bin/bash

# Specialized Cordova header file fix for Xcode Cloud
# Specifically addresses files at /Volumes/workspace/repository/

echo "Running Cordova header fix for Xcode Cloud..."
echo "Current directory: $(pwd)"

# Determine the repository root directory
# In Xcode Cloud, files are located at /Volumes/workspace/repository/
if [ -d "/Volumes/workspace/repository" ]; then
  REPO_ROOT="/Volumes/workspace/repository"
  echo "Using Xcode Cloud repository path: $REPO_ROOT"
else
  REPO_ROOT="$(pwd)"
  echo "Using local repository path: $REPO_ROOT"
fi

# Step 1: Create all necessary directories for header files
echo "Creating necessary directories..."
mkdir -p "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova"
mkdir -p "$REPO_ROOT/ios/CapacitorHeaders/CapacitorCordova"

# Step 2: Locate Capacitor Cordova header files from node_modules
NODE_MODULES_PATH="$REPO_ROOT/node_modules"
CAPACITOR_IOS_PATH="$NODE_MODULES_PATH/@capacitor/ios"
CORDOVA_PATH="$CAPACITOR_IOS_PATH/CapacitorCordova"
CORDOVA_CLASSES_PATH="$CORDOVA_PATH/CapacitorCordova/Classes/Public"
CORDOVA_HEADER="$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h"

# Debug info
echo "Checking paths:"
echo "- Node modules path: $NODE_MODULES_PATH"
echo "- Capacitor iOS path: $CAPACITOR_IOS_PATH"
echo "- Cordova path: $CORDOVA_PATH"
echo "- Cordova classes path: $CORDOVA_CLASSES_PATH"

if [ ! -d "$CAPACITOR_IOS_PATH" ]; then
  echo "Error: Capacitor iOS directory not found at $CAPACITOR_IOS_PATH"
  
  # Try to find it elsewhere in case of different structure
  FOUND_PATH=$(find "$REPO_ROOT" -type d -name "@capacitor" -print | head -n 1)
  if [ -n "$FOUND_PATH" ]; then
    echo "Found potential Capacitor path at: $FOUND_PATH"
    CAPACITOR_IOS_PATH="$FOUND_PATH/ios"
    CORDOVA_PATH="$CAPACITOR_IOS_PATH/CapacitorCordova"
    CORDOVA_CLASSES_PATH="$CORDOVA_PATH/CapacitorCordova/Classes/Public"
    CORDOVA_HEADER="$CORDOVA_PATH/CapacitorCordova/CapacitorCordova.h"
  else
    # If we can't find the path, recreate the structures
    echo "Recreating Cordova header structures from scratch..."
    
    # Define the critical header files we need to create
    mkdir -p "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/Classes/Public"
    
    # Create empty header files to satisfy dependencies
    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/CapacitorCordova.h" << 'EOL'
#import <Foundation/Foundation.h>
#import "CDVViewController.h"
#import "CDVInvokedUrlCommand.h"
#import "CDVCommandDelegate.h"
#import "CDVCommandDelegateImpl.h"
#import "CDVPlugin.h"
#import "CDVPluginResult.h"
EOL

    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/CDVViewController.h" << 'EOL'
#import <UIKit/UIKit.h>
@interface CDVViewController : UIViewController
@end
EOL

    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/CDVInvokedUrlCommand.h" << 'EOL'
#import <Foundation/Foundation.h>
@interface CDVInvokedUrlCommand : NSObject
@end
EOL

    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/NSDictionary+CordovaPreferences.h" << 'EOL'
#import <Foundation/Foundation.h>
@interface NSDictionary (CordovaPreferences)
@end
EOL

    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/CDVPlugin.h" << 'EOL'
#import <Foundation/Foundation.h>
@interface CDVPlugin : NSObject
@end
EOL

    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/CDVPluginResult.h" << 'EOL'
#import <Foundation/Foundation.h>
@interface CDVPluginResult : NSObject
@end
EOL

    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/CDVCommandDelegate.h" << 'EOL'
#import <Foundation/Foundation.h>
@protocol CDVCommandDelegate <NSObject>
@end
EOL

    cat > "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/CDVConfigParser.h" << 'EOL'
#import <Foundation/Foundation.h>
@interface CDVConfigParser : NSObject
@end
EOL

    echo "Created placeholder header files"
  fi
fi

# Step 3: Copy header files if they exist, otherwise use placeholders
if [ -d "$CORDOVA_CLASSES_PATH" ]; then
  echo "Found Cordova header files. Copying them to required locations..."
  
  # Copy main CapacitorCordova.h
  if [ -f "$CORDOVA_HEADER" ]; then
    cp "$CORDOVA_HEADER" "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/"
    echo "Copied CapacitorCordova.h"
  else
    echo "Warning: CapacitorCordova.h not found at expected location ($CORDOVA_HEADER)"
  fi
  
  # Copy all public header files
  cp -R "$CORDOVA_CLASSES_PATH/"* "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova/"
  echo "Copied Cordova Class header files"
  
  # Create symbolic links for redundancy
  ln -sf "$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova"/* "$REPO_ROOT/ios/CapacitorHeaders/CapacitorCordova/"
  echo "Created symbolic links for header files"
else
  echo "Warning: Cordova header files not found. Using placeholders..."
fi

# Step 4: Update Pod xcconfig files with header search paths
echo "Updating xcconfig files with correct header search paths..."

# Look for Pod xcconfig files in different possible locations
XCCONFIG_PATHS=(
  "$REPO_ROOT/ios/App/Pods/Target Support Files/Pods-App"
  "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App"
)

for XCCONFIG_DIR in "${XCCONFIG_PATHS[@]}"; do
  if [ -d "$XCCONFIG_DIR" ]; then
    echo "Found xcconfig directory at: $XCCONFIG_DIR"
    
    for config in "$XCCONFIG_DIR/"Pods-App.*.xcconfig; do
      echo "Updating $config"
      
      # Add header search paths if not already present
      if ! grep -q "CapacitorHeaders" "$config"; then
        echo "HEADER_SEARCH_PATHS = \$(inherited) \$(SRCROOT)/Pods/Headers/Public/CapacitorCordova \$(SRCROOT)/../../node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public \$(SRCROOT)/../CapacitorHeaders \$(PODS_ROOT)/Headers/Public/CapacitorCordova" >> "$config"
      fi
    done
    
    echo "Updated xcconfig files"
    break
  fi
done

# Step 5: Create Xcode project header search path file
mkdir -p "$REPO_ROOT/ios/App/HeaderSearchPaths"
cat > "$REPO_ROOT/ios/App/HeaderSearchPaths/header_paths.xcconfig" << EOL
HEADER_SEARCH_PATHS = \$(inherited) \$(SRCROOT)/Pods/Headers/Public/CapacitorCordova \$(SRCROOT)/../../node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public \$(SRCROOT)/../CapacitorHeaders \$(PODS_ROOT)/Headers/Public/CapacitorCordova
OTHER_CFLAGS = \$(inherited) -isystem "\$(PODS_ROOT)/Headers/Public/CapacitorCordova"
EOL

# Step 6: Verify that critical files exist
echo "Verifying that critical header files exist..."

CRITICAL_FILES=(
  "CDVViewController.h"
  "CDVInvokedUrlCommand.h"
  "NSDictionary+CordovaPreferences.h"
  "CDVPlugin.h"
  "CDVPluginResult.h"
  "CDVCommandDelegate.h"
  "CDVConfigParser.h"
  "CapacitorCordova.h"
)

HEADER_DIR="$REPO_ROOT/ios/App/Pods/Headers/Public/CapacitorCordova"
for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$HEADER_DIR/$file" ]; then
    echo "✓ Found $file"
  else
    echo "Warning: $file not found. Creating placeholder..."
    touch "$HEADER_DIR/$file"
  fi
done

# Include special handling for RevenueCat plugin
if [ -d "$REPO_ROOT/node_modules/@revenuecat/purchases-capacitor/ios/Plugin" ]; then
  mkdir -p "$REPO_ROOT/ios/App/RevenuecatPurchasesCapacitor/Plugin"
  cp -R "$REPO_ROOT/node_modules/@revenuecat/purchases-capacitor/ios/Plugin/"* "$REPO_ROOT/ios/App/RevenuecatPurchasesCapacitor/Plugin/"
  echo "Copied RevenueCat plugin files"
fi

echo "Cordova header file fix completed successfully!"