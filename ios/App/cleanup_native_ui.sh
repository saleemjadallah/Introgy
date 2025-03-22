#!/bin/bash

# This script safely removes native UI components that have been replaced with web animations

# Directory where native UI components are stored
UI_DIR="$(pwd)/App"

# Check if we're in the right directory
if [ ! -d "$UI_DIR" ]; then
  echo "Error: This script must be run from the ios/App directory"
  exit 1
fi

# Components to remove - these match the ones from the screenshot
COMPONENTS=(
  "AnimatedCardView"
  "AnimatedCardViewRepresentable"
  "AnimatedDialog"
  "AnimatedProgressView"
  "AnimatedTabBar"
  "AnimationUtilities"
  "DesignSystem"
  "MainTabBarController"
  "ModernButtonStyle"
  "SocialBatteryView"
  "TransitionManager"
  "UIViewExtensions"
)

# Create a backup directory
BACKUP_DIR="$UI_DIR/NativeUIBackup_$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Function to find and backup a component
backup_component() {
  local component="$1"
  local files=($(find "$UI_DIR" -name "${component}*.swift" -o -name "${component}*.xib" -o -name "${component}*.storyboard"))
  
  if [ ${#files[@]} -eq 0 ]; then
    echo "  - No files found for $component"
    return
  fi
  
  echo "  - Backing up $component files:"
  for file in "${files[@]}"; do
    local rel_path=${file#$UI_DIR/}
    local backup_path="$BACKUP_DIR/$rel_path"
    local backup_dir=$(dirname "$backup_path")
    
    mkdir -p "$backup_dir"
    cp "$file" "$backup_path"
    echo "    - $(basename "$file") → $backup_dir"
  done
}

# Backup all components
echo "Backing up native UI components..."
for component in "${COMPONENTS[@]}"; do
  backup_component "$component"
done

# Confirm before removing
echo ""
echo "All components have been backed up to $BACKUP_DIR"
echo "Would you like to proceed with removing these components? (y/n)"
read -r confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Operation cancelled. Components have been backed up but not removed."
  exit 0
fi

# Remove components
echo "Removing native UI components..."
for component in "${COMPONENTS[@]}"; do
  local files=($(find "$UI_DIR" -name "${component}*.swift" -o -name "${component}*.xib" -o -name "${component}*.storyboard"))
  
  if [ ${#files[@]} -eq 0 ]; then
    continue
  fi
  
  echo "  - Removing $component files:"
  for file in "${files[@]}"; do
    rm "$file"
    echo "    - Removed $(basename "$file")"
  done
done

echo ""
echo "Done! Native UI components have been removed."
echo "If you need to restore them, they are available in the backup directory: $BACKUP_DIR"
