# Testing Google Sign-In with Deep Linking

This guide will help you test the updated Google sign-in flow with deep linking in your iOS app.

## Prerequisites

1. Make sure you've updated the Supabase authentication settings as described in `supabase-auth-settings.md`.
2. Build and run the app on your iOS device or simulator.

## Testing Steps

### 1. Clear Existing Sessions

- If you're already signed in, sign out first.
- Clear Safari cookies and website data in iOS Settings to ensure a clean test.

### 2. Enable Debug Logging

- In Safari on your Mac, enable the Web Inspector for your iOS device:
  - On your iOS device: Settings > Safari > Advanced > Web Inspector
  - On your Mac: Safari > Preferences > Advanced > Show Develop menu in menu bar
  - Connect your iOS device to your Mac and open Safari
  - In Safari's Develop menu, select your device and the web view to inspect

### 3. Test the Sign-In Flow

1. Open the app on your iOS device
2. Tap the Google sign-in button
3. The app should open Safari with the Google sign-in page
4. Complete the Google sign-in process
5. Safari should redirect back to your app using the custom URL scheme
6. The app should process the deep link and sign you in automatically

### 4. Check the Logs

- Monitor the console logs in Safari's Web Inspector
- Look for messages related to deep link handling and authentication
- Check for any errors or warnings

### 5. Troubleshooting

If you're still having issues:

1. **URL Scheme Registration**: Verify that the URL scheme is properly registered in Info.plist
   - Open Xcode and check the Info.plist file in your iOS project
   - Ensure there's a URL Types entry with the URL Scheme set to "introgy"

2. **Capacitor Configuration**: Verify the Capacitor configuration
   - Check that the custom URL scheme is properly configured in capacitor.config.ts

3. **Supabase Redirect URLs**: Verify that the redirect URLs are properly configured in Supabase
   - Check that both `https://introgy.ai/auth/callback` and `introgy://auth/callback` are added to the allowed redirect URLs

4. **Google OAuth Configuration**: Verify that the Google OAuth configuration is correct
   - Check that the redirect URIs include `https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback`

5. **App Delegate**: Check the AppDelegate.swift file
   - Ensure it properly handles deep links with the "introgy" scheme

## Next Steps

If you're still experiencing issues after following these steps, try the following:

1. Add more detailed logging to the deep link handling code
2. Check if the app is receiving the deep link but failing to process it correctly
3. Verify that the Supabase authentication flow is working correctly

Remember that deep linking can be tricky to debug, especially on iOS. Be patient and methodical in your testing.
