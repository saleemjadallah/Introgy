
#!/bin/bash

echo "Fixing RevenueCat installation issues..."

# Set path to derived data
DERIVED_DATA_PATH=~/Library/Developer/Xcode/DerivedData

# Clean derived data related to the app
echo "Cleaning derived data..."
find "$DERIVED_DATA_PATH" -name "App-*" -type d -exec rm -rf {} \; 2>/dev/null || true

# Go to app directory
cd "$(dirname "$0")"

# Clean CocoaPods caches
echo "Cleaning CocoaPods caches..."
rm -rf "${HOME}/Library/Caches/CocoaPods"
rm -rf "${HOME}/.cocoapods/repos"
pod cache clean --all

# Create RevenueCat directory if missing
if [ ! -d "Pods/RevenueCat" ]; then
  echo "Creating missing RevenueCat directory structure..."
  mkdir -p "Pods/RevenueCat/Sources"
fi

# Ensure the script is executable
chmod +x ./RevenueCatPhase.sh

# Clean and reinstall pods
echo "Reinstalling pods..."
pod deintegrate
pod repo update
pod install --verbose

# Verify RevenueCat installation
if [ -d "Pods/RevenueCat" ]; then
  echo "✅ RevenueCat pod successfully installed"
else
  echo "⚠️ RevenueCat pod installation failed. Manual intervention may be required."
fi

echo "Completed RevenueCat build fix!"
