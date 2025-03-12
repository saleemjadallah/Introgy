#!/bin/bash

# Navigate to the iOS project directory
cd "$(dirname "$0")/App"

# Make all shell scripts executable
echo "Making all shell scripts executable..."
find . -name "*.sh" -print0 | xargs -0 chmod +x

# Verify Pod frameworks script permissions
FRAMEWORK_SCRIPT="./Pods/Target Support Files/Pods-App/Pods-App-frameworks.sh"
if [ -f "$FRAMEWORK_SCRIPT" ]; then
    echo "Making Pod frameworks script executable..."
    chmod +x "$FRAMEWORK_SCRIPT"
    echo "Frameworks script permission updated successfully"
else
    echo "Warning: Could not find frameworks script at: $FRAMEWORK_SCRIPT"
fi

# Clean derived data
echo "Cleaning derived data for App project..."
rm -rf ~/Library/Developer/Xcode/DerivedData/App-*

echo "Fix completed. Please try building again."