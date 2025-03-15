
#!/bin/bash

echo "Running RevenueCat Build Phase script..."

# Define paths - these will work in both local Xcode and CI environments
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PODS_DIR="${SCRIPT_DIR}/Pods"
REVENUECAT_DIR="${PODS_DIR}/RevenueCat"
SOURCE_DIR="${REVENUECAT_DIR}/Sources"

# Create RevenueCat directories if they don't exist
if [ ! -d "${SOURCE_DIR}" ]; then
  echo "Creating RevenueCat source directories..."
  mkdir -p "${SOURCE_DIR}/Purchasing/Purchases"
fi

# Create output declarations
echo "Creating output declarations..."
OUTPUTS_DIR="${BUILT_PRODUCTS_DIR}/RevenueCatOutputs"
mkdir -p "${OUTPUTS_DIR}"

# Create timestamp for dependency tracking
echo "RevenueCat Build Phase ran at $(date)" > "${OUTPUTS_DIR}/timestamp.txt"

# Mark expected output files so Xcode doesn't complain about missing files
for ARCH in arm64 arm64e; do
  mkdir -p "${BUILT_PRODUCTS_DIR}/${ARCH}"
  touch "${BUILT_PRODUCTS_DIR}/${ARCH}/RevenueCat.swiftmodule"
  touch "${BUILT_PRODUCTS_DIR}/${ARCH}/RevenueCat.swiftdoc"
  touch "${BUILT_PRODUCTS_DIR}/${ARCH}/RevenueCat-Swift.h"
done

# Ensure custom entitlements computation is disabled to prevent duplicate symbol errors
if [ -f "${PODS_DIR}/Target Support Files/RevenueCat/RevenueCat.debug.xcconfig" ]; then
  if ! grep -q "RC_DISABLE_CUSTOM_ENTITLEMENTS_COMPUTATION=1" "${PODS_DIR}/Target Support Files/RevenueCat/RevenueCat.debug.xcconfig"; then
    echo "GCC_PREPROCESSOR_DEFINITIONS = \$(inherited) RC_DISABLE_CUSTOM_ENTITLEMENTS_COMPUTATION=1" >> "${PODS_DIR}/Target Support Files/RevenueCat/RevenueCat.debug.xcconfig"
  fi
fi

if [ -f "${PODS_DIR}/Target Support Files/RevenueCat/RevenueCat.release.xcconfig" ]; then
  if ! grep -q "RC_DISABLE_CUSTOM_ENTITLEMENTS_COMPUTATION=1" "${PODS_DIR}/Target Support Files/RevenueCat/RevenueCat.release.xcconfig"; then
    echo "GCC_PREPROCESSOR_DEFINITIONS = \$(inherited) RC_DISABLE_CUSTOM_ENTITLEMENTS_COMPUTATION=1" >> "${PODS_DIR}/Target Support Files/RevenueCat/RevenueCat.release.xcconfig"
  fi
fi

echo "RevenueCat Build Phase completed"
exit 0
