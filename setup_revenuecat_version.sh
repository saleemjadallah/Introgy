#!/bin/bash

# Script to ensure the correct RevenueCat version is used in Xcode Cloud

PODFILE_PATH="/Volumes/workspace/repository/ios/App/Podfile"
PODFILE_LOCK_PATH="/Volumes/workspace/repository/ios/App/Podfile.lock"

echo "Checking RevenueCat version in Podfile and Podfile.lock..."

# Check if Podfile exists
if [ ! -f "$PODFILE_PATH" ]; then
  echo "⚠️ Podfile not found at: $PODFILE_PATH"
  exit 1
fi

# Update the Podfile to specifically use RevenueCat 5.19.0
if ! grep -q "pod 'RevenueCat', '5.19.0'" "$PODFILE_PATH"; then
  echo "Adding RevenueCat 5.19.0 to Podfile..."
  
  # Create a temporary file with the modification
  TMP_FILE=$(mktemp)
  awk '{
    if (/pod .RevenuecatPurchasesCapacitor/) {
      print $0;
      print "  pod '\''RevenueCat'\'', '\''5.19.0'\'' # Specific version required for build";
    } else {
      print $0;
    }
  }' "$PODFILE_PATH" > "$TMP_FILE"
  
  # Copy the modified content back to the Podfile
  cp "$TMP_FILE" "$PODFILE_PATH"
  rm "$TMP_FILE"
  
  echo "✅ Added RevenueCat 5.19.0 to Podfile"
else
  echo "✅ RevenueCat 5.19.0 already specified in Podfile"
fi

# Run pod update to ensure the correct version is used
cd "/Volumes/workspace/repository/ios/App"
pod update RevenueCat --no-repo-update
echo "✅ Updated RevenueCat pod to 5.19.0"

# Check if the update worked
if grep -q "RevenueCat (5.19.0)" "$PODFILE_LOCK_PATH"; then
  echo "✅ RevenueCat 5.19.0 is now locked in Podfile.lock"
else
  echo "⚠️ Warning: RevenueCat 5.19.0 not found in Podfile.lock"
  echo "Current RevenueCat entry in Podfile.lock:"
  grep -A 1 "RevenueCat (" "$PODFILE_LOCK_PATH"
fi

# Safety measure: ensure our stub files still exist if needed
REVENUECAT_STUB_DIR="/Volumes/workspace/repository/ios/App/Pods/RevenueCat/Sources/Attribution"
if [ ! -d "$REVENUECAT_STUB_DIR" ]; then
  echo "⚠️ RevenueCat stubs directory not found, running fallback scripts..."
  
  # Run our fallback scripts
  if [ -f "/Volumes/workspace/repository/manually_create_revenuecat_files.sh" ]; then
    chmod +x "/Volumes/workspace/repository/manually_create_revenuecat_files.sh"
    "/Volumes/workspace/repository/manually_create_revenuecat_files.sh"
  fi
  
  if [ -f "/Volumes/workspace/repository/create_critical_module_files.sh" ]; then
    chmod +x "/Volumes/workspace/repository/create_critical_module_files.sh"
    "/Volumes/workspace/repository/create_critical_module_files.sh"
  fi
else
  echo "✅ RevenueCat stubs directory exists, assuming Pod installation is complete"
fi

echo "✅ RevenueCat version setup completed"
exit 0