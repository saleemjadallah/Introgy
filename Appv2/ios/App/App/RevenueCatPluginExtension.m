#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(RevenueCatPluginExtension, "RevenueCatPluginExtension",
    CAP_PLUGIN_METHOD(configureWithSharedDefaults, CAPPluginReturnPromise);
)
