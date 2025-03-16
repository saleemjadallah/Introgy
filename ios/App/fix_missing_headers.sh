#!/bin/bash

# This script is meant to be added as a build phase in Xcode
# It should run before the "Copy Headers" phase

# Get the path to the PurchasesHybridCommon header file
HEADER_PATH="${PODS_ROOT}/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h"
HEADER_DIR="${PODS_ROOT}/PurchasesHybridCommon/ios/PurchasesHybridCommon/PurchasesHybridCommon"
PUBLIC_HEADER_PATH="${PODS_ROOT}/Headers/Public/PurchasesHybridCommon/PurchasesHybridCommon.h"
PUBLIC_HEADER_DIR="${PODS_ROOT}/Headers/Public/PurchasesHybridCommon"

# Create the directory if it doesn't exist
mkdir -p "${HEADER_DIR}"
mkdir -p "${PUBLIC_HEADER_DIR}"

# Create the header file if it doesn't exist
if [ ! -f "${HEADER_PATH}" ]; then
  echo "Creating stub PurchasesHybridCommon.h file at ${HEADER_PATH}"
  
  cat > "${HEADER_PATH}" << EOF
#ifndef PurchasesHybridCommon_h
#define PurchasesHybridCommon_h

// This is a stub header file for PurchasesHybridCommon
// It's used to satisfy build requirements without the actual implementation

#import <Foundation/Foundation.h>

// Define any necessary types or interfaces that might be required
// by RevenuecatPurchasesCapacitor or other dependent code

#endif /* PurchasesHybridCommon_h */
EOF

  # Copy to public headers
  cp "${HEADER_PATH}" "${PUBLIC_HEADER_PATH}"
fi

# Get the path to the RevenueCat HTTPStatusCode.swift file
REVENUECAT_FILE_PATH="${PODS_ROOT}/RevenueCat/Sources/Networking/HTTPClient/HTTPStatusCode.swift"
REVENUECAT_DIR="${PODS_ROOT}/RevenueCat/Sources/Networking/HTTPClient"

# Create the directory if it doesn't exist
mkdir -p "${REVENUECAT_DIR}"

# Create the Swift file if it doesn't exist
if [ ! -f "${REVENUECAT_FILE_PATH}" ]; then
  echo "Creating stub HTTPStatusCode.swift file at ${REVENUECAT_FILE_PATH}"
  
  cat > "${REVENUECAT_FILE_PATH}" << EOF
import Foundation

/// HTTP status codes as per the RFC specifications.
public enum HTTPStatusCode: Int {
    // 100 Informational
    case continue = 100
    case switchingProtocols = 101
    case processing = 102
    
    // 200 Success
    case ok = 200
    case created = 201
    case accepted = 202
    case nonAuthoritativeInformation = 203
    case noContent = 204
    case resetContent = 205
    case partialContent = 206
    case multiStatus = 207
    case alreadyReported = 208
    case imUsed = 226
    
    // 300 Redirection
    case multipleChoices = 300
    case movedPermanently = 301
    case found = 302
    case seeOther = 303
    case notModified = 304
    case useProxy = 305
    case temporaryRedirect = 307
    case permanentRedirect = 308
    
    // 400 Client Error
    case badRequest = 400
    case unauthorized = 401
    case paymentRequired = 402
    case forbidden = 403
    case notFound = 404
    case methodNotAllowed = 405
    case notAcceptable = 406
    case proxyAuthenticationRequired = 407
    case requestTimeout = 408
    case conflict = 409
    case gone = 410
    case lengthRequired = 411
    case preconditionFailed = 412
    case payloadTooLarge = 413
    case uriTooLong = 414
    case unsupportedMediaType = 415
    case rangeNotSatisfiable = 416
    case expectationFailed = 417
    case imATeapot = 418
    case misdirectedRequest = 421
    case unprocessableEntity = 422
    case locked = 423
    case failedDependency = 424
    case upgradeRequired = 426
    case preconditionRequired = 428
    case tooManyRequests = 429
    case requestHeaderFieldsTooLarge = 431
    case unavailableForLegalReasons = 451
    
    // 500 Server Error
    case internalServerError = 500
    case notImplemented = 501
    case badGateway = 502
    case serviceUnavailable = 503
    case gatewayTimeout = 504
    case httpVersionNotSupported = 505
    case variantAlsoNegotiates = 506
    case insufficientStorage = 507
    case loopDetected = 508
    case notExtended = 510
    case networkAuthenticationRequired = 511
    
    /// Whether the status code is in the 100 range.
    public var isInformational: Bool {
        return 100...199 ~= rawValue
    }
    
    /// Whether the status code is in the 200 range.
    public var isSuccess: Bool {
        return 200...299 ~= rawValue
    }
    
    /// Whether the status code is in the 300 range.
    public var isRedirection: Bool {
        return 300...399 ~= rawValue
    }
    
    /// Whether the status code is in the 400 range.
    public var isClientError: Bool {
        return 400...499 ~= rawValue
    }
    
    /// Whether the status code is in the 500 range.
    public var isServerError: Bool {
        return 500...599 ~= rawValue
    }
}
EOF
fi

echo "Stub files created successfully"
exit 0 