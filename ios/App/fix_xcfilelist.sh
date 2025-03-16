#!/bin/bash

# Set up paths
LOCAL_DIR="Pods/Target Support Files/Pods-App"
VOLUMES_DIR="/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App"

# Create local directory if it doesn't exist
mkdir -p "$LOCAL_DIR"

# Create input file list content for Debug
DEBUG_INPUT_CONTENT="${PODS_ROOT}/Target Support Files/Pods-App/Pods-App-frameworks.sh
${BUILT_PRODUCTS_DIR}/Capacitor/Capacitor.framework
${BUILT_PRODUCTS_DIR}/CapacitorApp/CapacitorApp.framework
${BUILT_PRODUCTS_DIR}/CapacitorCordova/Cordova.framework
${BUILT_PRODUCTS_DIR}/CapacitorDevice/CapacitorDevice.framework
${BUILT_PRODUCTS_DIR}/CapacitorLocalNotifications/CapacitorLocalNotifications.framework
${BUILT_PRODUCTS_DIR}/CapacitorPreferences/CapacitorPreferences.framework
${BUILT_PRODUCTS_DIR}/CapacitorSplashScreen/CapacitorSplashScreen.framework
${BUILT_PRODUCTS_DIR}/CapacitorStatusBar/CapacitorStatusBar.framework
${BUILT_PRODUCTS_DIR}/PurchasesHybridCommon/PurchasesHybridCommon.framework
${BUILT_PRODUCTS_DIR}/RevenueCat/RevenueCat.framework
${BUILT_PRODUCTS_DIR}/RevenuecatPurchasesCapacitor/RevenuecatPurchasesCapacitor.framework"

# Create output file list content for Debug
DEBUG_OUTPUT_CONTENT="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/Capacitor.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/CapacitorApp.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/Cordova.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/CapacitorDevice.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/CapacitorLocalNotifications.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/CapacitorPreferences.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/CapacitorSplashScreen.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/CapacitorStatusBar.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/PurchasesHybridCommon.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/RevenueCat.framework
${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/RevenuecatPurchasesCapacitor.framework"

# Write files locally
echo "$DEBUG_INPUT_CONTENT" > "$LOCAL_DIR/Pods-App-frameworks-Debug-input-files.xcfilelist"
echo "$DEBUG_OUTPUT_CONTENT" > "$LOCAL_DIR/Pods-App-frameworks-Debug-output-files.xcfilelist"
echo "$DEBUG_INPUT_CONTENT" > "$LOCAL_DIR/Pods-App-frameworks-Release-input-files.xcfilelist"
echo "$DEBUG_OUTPUT_CONTENT" > "$LOCAL_DIR/Pods-App-frameworks-Release-output-files.xcfilelist"

# Try to create the directory in Volumes path
if [ ! -d "$VOLUMES_DIR" ]; then
  mkdir -p "$VOLUMES_DIR" 2>/dev/null || echo "Could not create directory at $VOLUMES_DIR"
fi

# Try to copy files to Volumes path if it exists
if [ -d "$VOLUMES_DIR" ]; then
  echo "$DEBUG_INPUT_CONTENT" > "$VOLUMES_DIR/Pods-App-frameworks-Debug-input-files.xcfilelist" 2>/dev/null || echo "Could not write to $VOLUMES_DIR/Pods-App-frameworks-Debug-input-files.xcfilelist"
  echo "$DEBUG_OUTPUT_CONTENT" > "$VOLUMES_DIR/Pods-App-frameworks-Debug-output-files.xcfilelist" 2>/dev/null || echo "Could not write to $VOLUMES_DIR/Pods-App-frameworks-Debug-output-files.xcfilelist"
  echo "$DEBUG_INPUT_CONTENT" > "$VOLUMES_DIR/Pods-App-frameworks-Release-input-files.xcfilelist" 2>/dev/null || echo "Could not write to $VOLUMES_DIR/Pods-App-frameworks-Release-input-files.xcfilelist"
  echo "$DEBUG_OUTPUT_CONTENT" > "$VOLUMES_DIR/Pods-App-frameworks-Release-output-files.xcfilelist" 2>/dev/null || echo "Could not write to $VOLUMES_DIR/Pods-App-frameworks-Release-output-files.xcfilelist"
fi

# Add a Run Script build phase to the Xcode project using PlistBuddy
cat > add_build_phase.rb << EOF
#!/usr/bin/env ruby
require 'xcodeproj'

project_path = 'App.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main target
target = project.targets.first

# Check if the script phase already exists
script_phase_exists = target.shell_script_build_phases.any? { |phase| phase.name == "Generate xcfilelist Files" }

unless script_phase_exists
  # Add a new script phase that runs our fix_xcfilelist.sh script
  phase = target.new_shell_script_build_phase("Generate xcfilelist Files")
  phase.shell_script = "sh \"\${SRCROOT}/fix_xcfilelist.sh\""
  phase.shell_path = "/bin/sh"
  
  # Move the phase before the [CP] Embed Pods Frameworks phase
  target.build_phases.each_with_index do |build_phase, index|
    if build_phase.display_name == "[CP] Embed Pods Frameworks"
      target.build_phases.move_from(target.build_phases.count - 1, index)
      break
    end
  end
  
  # Save the changes
  project.save
  puts "Added 'Generate xcfilelist Files' build phase"
else
  puts "Build phase 'Generate xcfilelist Files' already exists"
end
EOF

# Run the Ruby script if Ruby is available
if command -v ruby >/dev/null 2>&1 && command -v gem >/dev/null 2>&1; then
  gem list -i xcodeproj >/dev/null 2>&1 || gem install xcodeproj
  ruby add_build_phase.rb
  rm add_build_phase.rb
else
  echo "Ruby or xcodeproj gem not available, skipping automatic build phase addition"
  echo "Manually add a Run Script build phase in Xcode to run fix_xcfilelist.sh"
fi

echo "xcfilelist files created successfully!" 