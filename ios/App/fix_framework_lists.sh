#!/bin/bash

echo "Creating framework file lists in both local and CI environments..."

# Define the frameworks
FRAMEWORKS=(
  "Capacitor"
  "CapacitorApp"
  "CapacitorCordova"
  "CapacitorDevice"
  "CapacitorLocalNotifications"
  "CapacitorPreferences"
  "CapacitorSplashScreen"
  "CapacitorStatusBar"
  "RevenueCat"
  "RevenuecatPurchasesCapacitor"
  "PurchasesHybridCommon"
)

# Create input list
INPUT_LIST="\${PODS_ROOT}/Target Support Files/Pods-App/Pods-App-frameworks.sh"
for framework in "${FRAMEWORKS[@]}"; do
  if [ "$framework" == "CapacitorCordova" ]; then
    INPUT_LIST+="\n\${BUILT_PRODUCTS_DIR}/${framework}/Cordova.framework"
  else
    INPUT_LIST+="\n\${BUILT_PRODUCTS_DIR}/${framework}/${framework}.framework"
  fi
done

# Create output list
OUTPUT_LIST=""
for framework in "${FRAMEWORKS[@]}"; do
  if [ "$framework" == "CapacitorCordova" ]; then
    OUTPUT_LIST+="\${TARGET_BUILD_DIR}/\${FRAMEWORKS_FOLDER_PATH}/Cordova.framework\n"
  else
    OUTPUT_LIST+="\${TARGET_BUILD_DIR}/\${FRAMEWORKS_FOLDER_PATH}/${framework}.framework\n"
  fi
done

# Create local copies first
echo "Creating xcfilelist files locally..."
mkdir -p "Pods/Target Support Files/Pods-App"
echo -e "$INPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-input-files.xcfilelist" 
echo -e "$INPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-input-files.xcfilelist"
echo -e "$OUTPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-output-files.xcfilelist"
echo -e "$OUTPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-output-files.xcfilelist"

# Check if we're running in CI environment (Volumes path exists)
if [ -d "/Volumes/workspace/repository" ]; then
  echo "CI environment detected, creating xcfilelist files in /Volumes path..."
  
  # Create the target directory in the CI volume path
  mkdir -p "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App" 2>/dev/null || {
    echo "Warning: Could not create directory in /Volumes, trying with sudo..."
    sudo mkdir -p "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App" 2>/dev/null || {
      echo "Error: Failed to create directory in /Volumes path even with sudo."
      echo "Will only use local xcfilelist files."
    }
  }
  
  # Check if we successfully created the directory
  if [ -d "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App" ]; then
    # Try without sudo first
    echo -e "$INPUT_LIST" > "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-input-files.xcfilelist" 2>/dev/null
    if [ $? -ne 0 ]; then
      echo "Using sudo to write files in /Volumes path..."
      echo -e "$INPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-input-files.xcfilelist" > /dev/null
      echo -e "$INPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-input-files.xcfilelist" > /dev/null
      echo -e "$OUTPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-output-files.xcfilelist" > /dev/null
      echo -e "$OUTPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-output-files.xcfilelist" > /dev/null
      
      # Set proper permissions if using sudo
      sudo chmod 644 "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/"*.xcfilelist
    else
      # Complete the writes without sudo
      echo -e "$INPUT_LIST" > "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-input-files.xcfilelist"
      echo -e "$OUTPUT_LIST" > "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-output-files.xcfilelist"
      echo -e "$OUTPUT_LIST" > "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-output-files.xcfilelist"
    fi
    echo "Successfully created xcfilelist files in /Volumes path"
  fi
else
  echo "Not running in CI environment, skipping /Volumes path creation"
fi

# Add a build phase to regenerate these files at build time in Xcode project
if [ -f "App.xcodeproj/project.pbxproj" ]; then
  echo "Adding Run Script build phase to regenerate xcfilelist files during build..."
  
  # Check if we have ruby and xcodeproj gem available
  if command -v ruby >/dev/null 2>&1 && command -v gem >/dev/null 2>&1; then
    gem list -i xcodeproj >/dev/null 2>&1 || gem install xcodeproj >/dev/null 2>&1
    
    if gem list -i xcodeproj >/dev/null 2>&1; then
      # Create a temporary Ruby script to add the build phase
      cat > add_build_phase.rb << EOF
#!/usr/bin/env ruby
require 'xcodeproj'

project_path = 'App.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main target
target = project.targets.first

# Check if the script phase already exists
script_phase_exists = target.shell_script_build_phases.any? { |phase| phase.name == "Generate Framework Lists" }

unless script_phase_exists
  # Add a new script phase that runs our fix_framework_lists.sh script
  phase = target.new_shell_script_build_phase("Generate Framework Lists")
  phase.shell_script = "sh \"\${SRCROOT}/fix_framework_lists.sh\""
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
  puts "Added 'Generate Framework Lists' build phase"
else
  puts "Build phase 'Generate Framework Lists' already exists"
end
EOF
      ruby add_build_phase.rb
      rm add_build_phase.rb
    else
      echo "Warning: xcodeproj gem not available, skipping automatic build phase addition"
    fi
  else
    echo "Warning: Ruby not available, skipping automatic build phase addition"
  fi
fi

echo "✅ Framework file lists created successfully"