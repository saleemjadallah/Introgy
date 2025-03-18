#!/bin/bash

# This script helps Xcode Cloud locate the correct project/workspace
# Pre-build script for Xcode Cloud

echo "Setting up build environment for Xcode Cloud..."
echo "Project location: ios/App/App.xcodeproj"
echo "Workspace location: ios/App/App.xcworkspace"

# Make sure permission scripts are executable
find ./ios/App/Pods -name "*.sh" -print0 | xargs -0 chmod +x

echo "Environment setup complete"