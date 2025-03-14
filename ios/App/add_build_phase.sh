#!/bin/bash

echo "Adding RevenueCat Build Phase to Xcode project..."

# Add the build phase script to the project
/usr/libexec/PlistBuddy -c "Add :buildPhases:0:shellScript string '\"${SRCROOT}/revenuecat_build_phase.sh\"'" App.xcodeproj/project.pbxproj
/usr/libexec/PlistBuddy -c "Add :buildPhases:0:shellPath string /bin/sh" App.xcodeproj/project.pbxproj
/usr/libexec/PlistBuddy -c "Add :buildPhases:0:name string RevenueCat Build Phase" App.xcodeproj/project.pbxproj
/usr/libexec/PlistBuddy -c "Add :buildPhases:0:isa string PBXShellScriptBuildPhase" App.xcodeproj/project.pbxproj

echo "✅ Build phase added successfully" 