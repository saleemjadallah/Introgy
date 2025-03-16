#!/bin/bash

# Create the target directory in the volume path
sudo mkdir -p "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App"

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

# Write the lists directly to the volume path for both Debug and Release
echo -e "$INPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-input-files.xcfilelist" > /dev/null
echo -e "$INPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-input-files.xcfilelist" > /dev/null
echo -e "$OUTPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-output-files.xcfilelist" > /dev/null
echo -e "$OUTPUT_LIST" | sudo tee "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-output-files.xcfilelist" > /dev/null

# Set proper permissions
sudo chmod 644 "/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/"*.xcfilelist

# Also create copies in the local path
mkdir -p "Pods/Target Support Files/Pods-App"
echo -e "$INPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-input-files.xcfilelist" 
echo -e "$INPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-input-files.xcfilelist"
echo -e "$OUTPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Debug-output-files.xcfilelist"
echo -e "$OUTPUT_LIST" > "Pods/Target Support Files/Pods-App/Pods-App-frameworks-Release-output-files.xcfilelist"

echo "Framework file lists created successfully" 