#!/bin/bash

# Create the exact directory path where the header is being searched
mkdir -p "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Create the header file directly at the location
cat > "/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h" << 'EOF'
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

echo "Header file created at exact required location" 