#!/bin/bash

# This script needs to be run with sudo
# It copies the stub files from the local path to the volume path

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Volume path
VOLUME_PATH="/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Create the volume directory
sudo mkdir -p "$VOLUME_PATH"

# Copy the files
sudo cp "${SCRIPT_DIR}/Headers/Public/PurchasesHybridCommon/PurchasesHybridCommon.h" "$VOLUME_PATH/"
sudo cp "${SCRIPT_DIR}/Headers/Public/PurchasesHybridCommon/CommonFunctionality.swift" "$VOLUME_PATH/"

# Set permissions
sudo chmod 644 "$VOLUME_PATH/PurchasesHybridCommon.h"
sudo chmod 644 "$VOLUME_PATH/CommonFunctionality.swift"

echo "Files copied to volume path successfully!" 