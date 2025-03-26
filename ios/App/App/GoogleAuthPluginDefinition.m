#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// This registers our plugin with Capacitor
CAP_PLUGIN(GoogleAuthPlugin, "GoogleAuth",
          CAP_PLUGIN_METHOD(signIn, CAPPluginReturnPromise);
          CAP_PLUGIN_METHOD(signInWithSupabase, CAPPluginReturnPromise);
          CAP_PLUGIN_METHOD(signOut, CAPPluginReturnPromise);
          CAP_PLUGIN_METHOD(refresh, CAPPluginReturnPromise);
          CAP_PLUGIN_METHOD(getUser, CAPPluginReturnPromise);
)
