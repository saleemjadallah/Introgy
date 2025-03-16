#!/bin/bash

# Create the volume directory structure
mkdir -p "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon"

# Create the header file directly in the volume path
cat > "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon.h" << 'EOF'
//
//  PurchasesHybridCommon.h
//  PurchasesHybridCommon
//
//  Created for RevenueCat
//

#import <Foundation/Foundation.h>
#import <RevenueCat/RevenueCat.h>

//! Project version number for PurchasesHybridCommon.
FOUNDATION_EXPORT double PurchasesHybridCommonVersionNumber;

//! Project version string for PurchasesHybridCommon.
FOUNDATION_EXPORT const unsigned char PurchasesHybridCommonVersionString[];

// This is a stub header to allow compilation without PurchasesHybridCommon
EOF

# Also create a copy in the local path
mkdir -p "${SRCROOT}/Headers/Public/PurchasesHybridCommon"
cp "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon.h" "${SRCROOT}/Headers/Public/PurchasesHybridCommon/PurchasesHybridCommon.h"

echo "PurchasesHybridCommon.h created successfully in both paths" 