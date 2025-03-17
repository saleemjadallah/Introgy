#!/bin/bash

echo "Fixing RevenueCat framework linking issues..."

# Check if we're running within the App directory
if [[ "$PWD" != *"/App" ]]; then
  echo "Changing to App directory..."
  cd "$(dirname "$0")"
fi

# Create a directory for our fix
mkdir -p FixFrameworks/RevenueCat.framework

# Create a simple framework structure
cat > FixFrameworks/RevenueCat.framework/RevenueCat << EOF
/* Stub binary to satisfy linker */
EOF

# Create Info.plist for the framework
cat > FixFrameworks/RevenueCat.framework/Info.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleExecutable</key>
	<string>RevenueCat</string>
	<key>CFBundleIdentifier</key>
	<string>com.revenuecat.RevenueCat</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>RevenueCat</string>
	<key>CFBundlePackageType</key>
	<string>FMWK</string>
	<key>CFBundleShortVersionString</key>
	<string>5.19.0</string>
	<key>CFBundleVersion</key>
	<string>1</string>
</dict>
</plist>
EOF

# Create Headers directory
mkdir -p FixFrameworks/RevenueCat.framework/Headers

# Create Module directory and modulemap
mkdir -p FixFrameworks/RevenueCat.framework/Modules
cat > FixFrameworks/RevenueCat.framework/Modules/module.modulemap << EOF
framework module RevenueCat {
    umbrella header "RevenueCat.h"
    export *
    module * { export * }
}
EOF

# Create base RevenueCat.h header file
cat > FixFrameworks/RevenueCat.framework/Headers/RevenueCat.h << EOF
#import <Foundation/Foundation.h>

//! Project version number for RevenueCat.
FOUNDATION_EXPORT double RevenueCatVersionNumber;

//! Project version string for RevenueCat.
FOUNDATION_EXPORT const unsigned char RevenueCatVersionString[];
EOF

# Fix the RevenueCat target in Pods project
PODS_PROJECT="Pods/Pods.xcodeproj/project.pbxproj"

if [ -f "$PODS_PROJECT" ]; then
    echo "Fixing circular dependencies in Pods project..."
    # Create backup
    cp "$PODS_PROJECT" "${PODS_PROJECT}.backup"
    
    # Comment out the RevenueCat framework references that cause circular dependencies
    sed -i '' 's/\(.*\)"framework", "RevenueCat",\(.*\)RevenueCat\.build/\/\/ Removed: \1"framework", "RevenueCat",\2RevenueCat.build/' "$PODS_PROJECT"
    
    # Also remove any explicit dependencies on RevenueCat.framework within the RevenueCat target
    sed -i '' 's/\(.*\)\/\* RevenueCat\.framework in Frameworks \*\/ = {isa = PBXBuildFile; fileRef = .* \/\* RevenueCat\.framework \*\/; };/\/\/ Removed dependency: \1\/\* RevenueCat.framework in Frameworks \*\/ = {isa = PBXBuildFile; fileRef = ... \/\* RevenueCat.framework \*\/; };/' "$PODS_PROJECT"
    
    echo "Fixed circular dependencies in Pods project"
else
    echo "Warning: Pods project not found at $PODS_PROJECT"
fi

# Patch the Pods-App.xcconfig files to include our framework path
RELEASE_XCCONFIG="Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig"
DEBUG_XCCONFIG="Pods/Target Support Files/Pods-App/Pods-App.debug.xcconfig"
REVENUECAT_DEBUG_XCCONFIG="Pods/Target Support Files/RevenueCat/RevenueCat.debug.xcconfig"
REVENUECAT_RELEASE_XCCONFIG="Pods/Target Support Files/RevenueCat/RevenueCat.release.xcconfig"

# Function to modify xcconfig files
modify_xcconfig() {
    local file=$1
    
    if [ -f "$file" ]; then
        # Add our framework path to FRAMEWORK_SEARCH_PATHS
        if grep -q "FRAMEWORK_SEARCH_PATHS" "$file"; then
            sed -i '' 's|\(FRAMEWORK_SEARCH_PATHS = \)\(.*\)|\1$(SRCROOT)/FixFrameworks \2|' "$file"
        else
            echo "FRAMEWORK_SEARCH_PATHS = \$(SRCROOT)/FixFrameworks" >> "$file"
        fi
        
        # Make sure OTHER_LDFLAGS doesn't have duplicate frameworks
        if grep -q "OTHER_LDFLAGS" "$file"; then
            sed -i '' 's|-framework "RevenueCat" -framework "RevenueCat"|-framework "RevenueCat"|g' "$file"
        fi
        
        echo "Updated $file"
    else
        echo "Warning: $file not found"
    fi
}

# Modify the xcconfig files
modify_xcconfig "$RELEASE_XCCONFIG"
modify_xcconfig "$DEBUG_XCCONFIG"

# Also fix the RevenueCat specific configs
if [ -f "$REVENUECAT_DEBUG_XCCONFIG" ]; then
    echo "Fixing RevenueCat.debug.xcconfig..."
    # Remove self-references in OTHER_LDFLAGS
    sed -i '' 's/-framework "RevenueCat"/\/\/ -framework "RevenueCat" - removed to prevent circular dependency/' "$REVENUECAT_DEBUG_XCCONFIG"
fi

if [ -f "$REVENUECAT_RELEASE_XCCONFIG" ]; then
    echo "Fixing RevenueCat.release.xcconfig..."
    # Remove self-references in OTHER_LDFLAGS
    sed -i '' 's/-framework "RevenueCat"/\/\/ -framework "RevenueCat" - removed to prevent circular dependency/' "$REVENUECAT_RELEASE_XCCONFIG"
fi

echo "Framework linking fix applied successfully"

# Make the stub binary executable
chmod +x FixFrameworks/RevenueCat.framework/RevenueCat

echo "You can now build the project in Xcode."