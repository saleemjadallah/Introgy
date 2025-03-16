#!/bin/bash

# Use the full path
FULL_PATH="$HOME/Desktop/Introgy-main"

# Create the local directory structure
mkdir -p "$FULL_PATH/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"

# Create the header file in the local path
cat > "$FULL_PATH/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h" << 'EOF'
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

# Also create in a user-accessible path (just to be safe)
USER_PATH="$HOME/Volumes/workspace/repository/ios/App/Pods/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"
mkdir -p "$USER_PATH"
tee "$USER_PATH/PurchasesHybridCommon.h" > /dev/null << 'EOF'
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

echo "Header files created in both local and user-accessible paths" 