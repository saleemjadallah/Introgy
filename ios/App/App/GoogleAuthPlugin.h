#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin interface
NS_ASSUME_NONNULL_BEGIN

@interface GoogleAuthPlugin : CAPPlugin

// Define all the methods that will be exposed to JavaScript
- (void)signIn:(CAPPluginCall*)call;
- (void)signInWithSupabase:(CAPPluginCall*)call;
- (void)signOut:(CAPPluginCall*)call;
- (void)disconnect:(CAPPluginCall*)call;
- (void)isSignedIn:(CAPPluginCall*)call;
- (void)getCurrentUser:(CAPPluginCall*)call;
- (void)refresh:(CAPPluginCall*)call;
- (void)showSignInButton:(CAPPluginCall*)call;

@end

NS_ASSUME_NONNULL_END
