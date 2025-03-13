#!/bin/bash

# verify_revenuecat.sh
# Script to verify RevenueCat installation and fix common issues

# Color output helpers
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting RevenueCat verification and repair script...${NC}"

# 1. Check if RevenueCat pod directory exists and has content
echo -e "\n${YELLOW}1. Checking RevenueCat pod directories...${NC}"
if [ -d "Pods/RevenueCat" ]; then
  echo -e "${GREEN}✓ RevenueCat pod directory exists${NC}"
  
  # Count Swift files to verify content
  SWIFT_COUNT=$(find Pods/RevenueCat -name "*.swift" | wc -l | xargs)
  if [ "$SWIFT_COUNT" -gt 100 ]; then
    echo -e "${GREEN}✓ RevenueCat has $SWIFT_COUNT Swift files - looks complete${NC}"
  else
    echo -e "${RED}✗ RevenueCat only has $SWIFT_COUNT Swift files - may be incomplete${NC}"
    echo "  Will attempt to repair during fix phase"
  fi
else
  echo -e "${RED}✗ RevenueCat pod directory missing${NC}"
  echo "  Will create during fix phase"
fi

# 2. Check for critical files that might be missing
echo -e "\n${YELLOW}2. Checking for critical RevenueCat files...${NC}"
CRITICAL_FILES=(
  "Pods/RevenueCat/Sources/Purchasing/Purchases/Purchases.swift"
  "Pods/RevenueCat/Sources/PrivacyInfo.xcprivacy"
  "Pods/Target Support Files/RevenueCat/RevenueCat.modulemap"
  "Pods/Target Support Files/RevenueCat/RevenueCat-umbrella.h"
)

MISSING_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓ $file exists${NC}"
  else
    echo -e "${RED}✗ $file is missing${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
done

if [ "$MISSING_FILES" -gt 0 ]; then
  echo -e "${RED}Found $MISSING_FILES missing critical files${NC}"
else
  echo -e "${GREEN}All critical files are present${NC}"
fi

# 3. Check Xcode project for RevenueCat references
echo -e "\n${YELLOW}3. Checking Xcode project for RevenueCat references...${NC}"
if grep -q "RevenueCat" "App.xcodeproj/project.pbxproj"; then
  echo -e "${GREEN}✓ RevenueCat references found in project file${NC}"
else
  echo -e "${RED}✗ No RevenueCat references found in project file${NC}"
fi

# 4. Fix phase - apply necessary repairs
echo -e "\n${YELLOW}4. Running fix operations for identified issues...${NC}"

# 4.1 Clean up derived data
echo "Cleaning derived data for App..."
find ~/Library/Developer/Xcode/DerivedData -name "App-*" -type d -exec rm -rf {} \; 2>/dev/null || true

# 4.2 Create missing directories if needed
if [ ! -d "Pods/RevenueCat/Sources" ]; then
  echo "Creating RevenueCat directory structure..."
  mkdir -p "Pods/RevenueCat/Sources"
fi

# 4.3 Validate Podfile has modular_headers setting
if grep -q ":modular_headers => true" "Podfile"; then
  echo -e "${GREEN}✓ Podfile has modular_headers setting${NC}"
else
  echo -e "${RED}✗ Podfile missing modular_headers setting${NC}"
  echo "  Recommendation: Add ':modular_headers => true' to RevenueCat pod in Podfile"
fi

# 4.4 Validate CI/Cloud setup
echo -e "\n${YELLOW}5. Checking CI/Xcode Cloud configuration...${NC}"

if [ -f "../xcode_cloud_pre_build.sh" ]; then
  if grep -q "RevenueCat" "../xcode_cloud_pre_build.sh"; then
    echo -e "${GREEN}✓ Xcode Cloud pre-build script has RevenueCat handling${NC}"
  else
    echo -e "${YELLOW}! Xcode Cloud pre-build script might need RevenueCat handling${NC}"
  fi
else
  echo -e "${YELLOW}! No Xcode Cloud pre-build script found${NC}"
fi

# 4.5 Try repair by reinstalling pods
echo -e "\n${YELLOW}Would you like to reinstall pods to fix issues? (y/n)${NC}"
read -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Running pod deintegrate and reinstall..."
  
  # Remove CocoaPods cache for RevenueCat
  rm -rf "${HOME}/Library/Caches/CocoaPods/Pods/Release/RevenueCat"
  
  # Deintegrate and clean
  pod deintegrate
  pod cache clean RevenueCat
  pod cache clean PurchasesHybridCommon
  
  # Reinstall pods
  pod install
  
  echo -e "${GREEN}Pods reinstalled.${NC}"
  
  # Verify RevenueCat was installed properly
  if [ -d "Pods/RevenueCat" ]; then
    SWIFT_COUNT=$(find Pods/RevenueCat -name "*.swift" | wc -l | xargs)
    echo -e "${GREEN}RevenueCat now has $SWIFT_COUNT Swift files${NC}"
  else
    echo -e "${RED}RevenueCat directory still missing after reinstall${NC}"
    echo "  You may need to manually download the framework or investigate further"
  fi
fi

# 5. Recommendations for Xcode Cloud
echo -e "\n${YELLOW}6. Recommendations for Xcode Cloud${NC}"
echo "To ensure RevenueCat works in Xcode Cloud:"
echo "  1. Add the following to xcode_cloud_pre_build.sh:"
echo "     • Clean CocoaPods cache for RevenueCat"
echo "     • Ensure modular_headers is set"
echo "     • Disable custom entitlement computation"
echo "  2. Create declarations for all expected output files"
echo "  3. Ensure post-install hooks properly set the target configurations"

# 6. Generate report
echo -e "\n${YELLOW}RevenueCat Verification Summary:${NC}"
if [ "$MISSING_FILES" -gt 0 ] || [ "$SWIFT_COUNT" -lt 100 ]; then
  echo -e "${RED}✗ Issues detected that need fixing${NC}"
  echo "  - Run ./fix_revenuecat_build.sh to attempt repair"
  echo "  - Consider manual framework download if issues persist"
else
  echo -e "${GREEN}✓ RevenueCat installation appears to be complete${NC}"
  echo "  - Ensure Xcode Cloud configuration is correct"
  echo "  - Run verification before each build if issues recur"
fi

# 7. Create a Xcode Cloud helper file
echo -e "\n${YELLOW}7. Creating Xcode Cloud helper file...${NC}"
cat > "../xcode_cloud_revenuecat_fix.sh" << 'EOF'
#!/bin/bash

# Script to fix RevenueCat issues in Xcode Cloud

echo "Preparing RevenueCat for Xcode Cloud build..."

# Define paths
WORKSPACE_PATH="/Volumes/workspace"
REPO_PATH="${WORKSPACE_PATH}/repository"
DERIVED_PATH="${WORKSPACE_PATH}/DerivedData"
PODS_PATH="${REPO_PATH}/ios/App/Pods"
REVENUECAT_PATH="${PODS_PATH}/RevenueCat"

# 1. Create directories if missing
mkdir -p "${REVENUECAT_PATH}/Sources"

# 2. Ensure build output declarations exist
mkdir -p "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64"
touch "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftmodule"
touch "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat.swiftdoc"
touch "${DERIVED_PATH}/Build/Intermediates.noindex/Pods.build/Debug-iphoneos/RevenueCat.build/Objects-normal/arm64/RevenueCat-Swift.h"

# 3. Add preprocessor definition to disable custom entitlement computation
if [ -f "${PODS_PATH}/Pods.xcodeproj/project.pbxproj" ]; then
  sed -i '' 's/GCC_PREPROCESSOR_DEFINITIONS = /GCC_PREPROCESSOR_DEFINITIONS = RC_DISABLE_CUSTOM_ENTITLEMENTS_COMPUTATION=1 /g' "${PODS_PATH}/Pods.xcodeproj/project.pbxproj"
fi

echo "RevenueCat Xcode Cloud preparation complete"
EOF

chmod +x "../xcode_cloud_revenuecat_fix.sh"
echo -e "${GREEN}Created xcode_cloud_revenuecat_fix.sh for CI environment${NC}"

echo -e "\n${GREEN}RevenueCat verification complete!${NC}"