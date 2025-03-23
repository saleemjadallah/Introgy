#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// This file is used to define the Capacitor plugins in your app
// Do not modify this file directly - Capacitor will overwrite it
// Instead, use the GoogleAuthPlugin.m or other specific plugin definition files

// Define the Capacitor plugins
CAP_PLUGIN(GoogleAuthPlugin, "GoogleAuth",
    CAP_PLUGIN_METHOD(signIn, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(signInWithSupabase, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(signOut, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(disconnect, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(isSignedIn, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getCurrentUser, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(refresh, CAPPluginReturnPromise);
)