#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN macro.
CAP_PLUGIN(GoogleAuthPlugin, "GoogleAuth",
           CAP_PLUGIN_METHOD(signIn, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(signInWithSupabase, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(signOut, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(disconnect, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(isSignedIn, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCurrentUser, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(refresh, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(showSignInButton, CAPPluginReturnPromise);
)
