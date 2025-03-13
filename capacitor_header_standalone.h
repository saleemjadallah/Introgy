#ifndef Capacitor_h
#define Capacitor_h

// This file provides minimal header declarations for Capacitor
// It contains declarations for all the missing header files

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

// Required forward declarations
@class CAPPlugin;
@class CAPPluginCall;
@class CAPBridgeViewController;
@class CAPInstanceDescriptor;
@class CAPInstanceConfiguration;

// Capacitor.h
#import <Capacitor/CAPPlugin.h>
#import <Capacitor/CAPPluginCall.h>
#import <Capacitor/CAPBridgedPlugin.h>
#import <Capacitor/CAPPluginMethod.h>
#import <Capacitor/CAPBridgedJSTypes.h>
#import <Capacitor/CAPInstanceDescriptor.h>
#import <Capacitor/CAPInstanceConfiguration.h>

// CAPPluginCall.h
@interface CAPPluginCall : NSObject
- (instancetype)initWithCallbackId:(NSString *)callbackId options:(NSDictionary *)options success:(void (^)(NSDictionary *))success error:(void (^)(NSDictionary *))error;
@property (nonatomic, readonly) NSString *callbackId;
@property (nonatomic, readonly) NSDictionary *options;
- (id)getvalue:(NSString *)key;
- (void)success:(NSDictionary *)data;
- (void)resolve:(id)data;
- (void)reject:(NSString *)message code:(NSString *)code error:(NSError *)error;
@end

// CAPBridgedJSTypes.h
typedef NSString * CAPPluginEventName;

// CAPPluginMethod.h
@interface CAPPluginMethod : NSObject
@property (nonatomic, readonly) NSString *name;
@property (nonatomic, readonly) BOOL runOnMainThread;
@end

// CAPPlugin.h
@interface CAPPlugin : NSObject
@property (nonatomic, weak) CAPBridgeViewController *bridge;
@property (nonatomic, readonly) NSString *pluginId;
@property (nonatomic, readonly) NSString *pluginName;
@property (nonatomic, readonly) BOOL shouldBridgeMethod;
- (void)load;
- (void)addEventListener:(NSString *)eventName listener:(CAPPluginCall *)listener;
- (void)removeEventListener:(NSString *)eventName listener:(CAPPluginCall *)listener;
- (void)notifyListeners:(NSString *)eventName data:(NSDictionary *)data;
@end

// CAPBridgedPlugin.h
@interface CAPBridgedPlugin : NSObject
@property (nonatomic, readonly) NSString *pluginName;
@property (nonatomic, readonly) CAPPlugin *instance;
@property (nonatomic, readonly) NSArray<CAPPluginMethod *> *methods;
- (instancetype)initWithName:(NSString *)name instance:(CAPPlugin *)instance methods:(NSArray<CAPPluginMethod *> *)methods;
@end

// CAPInstanceDescriptor.h
@interface CAPInstanceDescriptor : NSObject
@property (nonatomic, readonly) NSString *appId;
@property (nonatomic, readonly) NSString *appName;
@property (nonatomic, readonly) NSString *webDir;
@property (nonatomic, readonly) NSURL *serverURL;
- (instancetype)initWithAppId:(NSString *)appId appName:(NSString *)appName webDir:(NSString *)webDir serverURL:(NSURL *)serverURL;
@end

// CAPInstanceConfiguration.h
@interface CAPInstanceConfiguration : NSObject
@property (nonatomic, readonly) BOOL limitsNavigationsToAppBoundDomains;
@property (nonatomic, readonly) BOOL allowsLinkPreviews;
@property (nonatomic, readonly) UIScrollViewContentInsetAdjustmentBehavior contentInsetAdjustmentBehavior;
- (instancetype)init;
@end

// CAPBridgeViewController+CDVScreenOrientationDelegate.h
#import <CapacitorCordova/CDVScreenOrientationDelegate.h>

@interface CAPBridgeViewController : UIViewController <CDVScreenOrientationDelegate>
- (void)setStatusBarVisible:(BOOL)visible;
- (void)setStatusBarStyle:(UIStatusBarStyle)style;
- (void)setStatusBarBackgroundColor:(UIColor *)color;
@end

#endif /* Capacitor_h */