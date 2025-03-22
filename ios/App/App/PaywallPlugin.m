#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(PaywallPlugin, "PaywallPlugin",
    CAP_PLUGIN_METHOD(presentPaywall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(dismissPaywall, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(checkEntitlements, CAPPluginReturnPromise);
)
