#import "cordova_header_standalone.h"

// Stub implementation file to satisfy linking for CapacitorCordova headers
// This file only needs to exist to prevent linker errors, it doesn't need to contain real implementations

@implementation CDVViewController
@end

@implementation CDVInvokedUrlCommand
- (instancetype)initWithArguments:(NSArray*)arguments
                       callbackId:(NSString*)callbackId
                        className:(NSString*)className
                       methodName:(NSString*)methodName {
    self = [super init];
    return self;
}
@end

@implementation CDVPluginResult
+ (instancetype)resultWithStatus:(int)statusOrdinal {
    return [[self alloc] init];
}

+ (instancetype)resultWithStatus:(int)statusOrdinal messageAsString:(NSString*)theMessage {
    return [[self alloc] init];
}

+ (instancetype)resultWithStatus:(int)statusOrdinal messageAsArray:(NSArray*)theMessage {
    return [[self alloc] init];
}

+ (instancetype)resultWithStatus:(int)statusOrdinal messageAsDictionary:(NSDictionary*)theMessage {
    return [[self alloc] init];
}
@end

@implementation CDVPlugin
@end

@implementation NSDictionary (CordovaPreferences)
- (id)cordovaPreferencesObject:(NSString*)key {
    return nil;
}
@end

@implementation CDVConfigParser
- (void)parse:(NSString*)path {
}
@end

@implementation CDVCommandDelegateImpl
- (void)sendPluginResult:(CDVPluginResult*)result callbackId:(NSString*)callbackId {
}
@end