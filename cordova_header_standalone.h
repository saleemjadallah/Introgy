#ifndef CapacitorCordova_h
#define CapacitorCordova_h

// This file provides minimal header declarations for CapacitorCordova
// It is used as a fallback when the original headers cannot be found

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

// CDVViewController
@interface CDVViewController : UIViewController
@end

// CDVInvokedUrlCommand
@interface CDVInvokedUrlCommand : NSObject
- (instancetype)initWithArguments:(NSArray*)arguments
                       callbackId:(NSString*)callbackId
                        className:(NSString*)className
                       methodName:(NSString*)methodName;
@property (nonatomic, readonly) NSArray* arguments;
@property (nonatomic, readonly) NSString* callbackId;
@property (nonatomic, readonly) NSString* className;
@property (nonatomic, readonly) NSString* methodName;
@end

// CDVPluginResult
@interface CDVPluginResult : NSObject
+ (instancetype)resultWithStatus:(int)statusOrdinal;
+ (instancetype)resultWithStatus:(int)statusOrdinal messageAsString:(NSString*)theMessage;
+ (instancetype)resultWithStatus:(int)statusOrdinal messageAsArray:(NSArray*)theMessage;
+ (instancetype)resultWithStatus:(int)statusOrdinal messageAsDictionary:(NSDictionary*)theMessage;
@end

// CDVCommandDelegate
@protocol CDVCommandDelegate <NSObject>
- (void)sendPluginResult:(CDVPluginResult*)result callbackId:(NSString*)callbackId;
@optional
- (id)getCommandInstance:(NSString*)pluginName;
@end

// CDVPlugin
@interface CDVPlugin : NSObject
@property (nonatomic, weak) id <CDVCommandDelegate> commandDelegate;
@property (nonatomic, weak) CDVViewController* viewController;
@end

// NSDictionary+CordovaPreferences
@interface NSDictionary (CordovaPreferences)
- (id)cordovaPreferencesObject:(NSString*)key;
@end

// CDVConfigParser
@interface CDVConfigParser : NSObject
- (void)parse:(NSString*)path;
@end

// CDVCommandDelegateImpl
@interface CDVCommandDelegateImpl : NSObject <CDVCommandDelegate>
@end

#endif /* CapacitorCordova_h */