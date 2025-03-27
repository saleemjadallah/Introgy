#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// This is just a forward declaration for the Capacitor plugin system
// The actual implementation is in GoogleAuthPlugin.swift
// This approach prevents duplicate symbol errors
NS_ASSUME_NONNULL_BEGIN

@interface GoogleAuthPlugin : CAPPlugin
// No method declarations needed here - they're in the .m file and implemented in Swift
@end

NS_ASSUME_NONNULL_END
