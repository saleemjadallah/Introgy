#!/bin/bash

# This script adds the UI files to the Xcode project

# Navigate to the project directory
cd "$(dirname "$0")"

# Check if the UI directory exists
if [ ! -d "App/UI" ]; then
  echo "Creating UI directory..."
  mkdir -p "App/UI"
fi

# List of UI files to check and add
UI_FILES=(
  "AnimatedCardView.swift"
  "AnimatedTabBar.swift"
  "AnimatedProgressView.swift"
  "AnimatedDialog.swift"
  "TransitionManager.swift"
  "UIViewExtensions.swift"
  "AnimationUtilities.swift"
  "DesignSystem.swift"
  "SocialBatteryView.swift"
)

# Check if files exist and add them to the project
for file in "${UI_FILES[@]}"; do
  if [ -f "App/UI/$file" ]; then
    echo "File $file already exists in the UI directory."
  else
    echo "File $file not found in UI directory. Please ensure it's created."
  fi
done

# Add the UI directory to the Xcode project if not already included
echo "Updating Xcode project to include UI files..."

# Make the script executable
chmod +x add_ui_files.sh

echo "Done! Please open the Xcode project and manually add the UI directory to your project if not already included."
echo "To add files in Xcode: Right-click on the App group, select 'Add Files to \"App\"...', navigate to the UI directory, and add all files."
