# Google Authentication Implementation for iOS

This document explains how the Google Authentication has been implemented in the iOS version of the app.

## Overview

The app uses a hybrid approach for Google authentication:
- **iOS**: Uses native Google Sign-In SDK directly via a custom Capacitor plugin
- **Web/Android**: Uses browser-based OAuth flow via Supabase

## Configuration

The Google Sign-In configuration uses:
- Client ID: `308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com`
- URL Scheme: `com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2`
- Bundle ID: `ai.introgy.app`

## Key Files

1. **Native Plugin Implementation**:
   - `/ios/App/App/GoogleAuthPlugin.swift` - Main plugin implementation
   - `/ios/App/App/GoogleAuthPlugin.m` - Plugin registration
   - `/ios/App/App/GoogleSignInViewController.swift` - UI for sign-in
   - `/ios/App/App/GoogleSignOutViewController.swift` - UI for sign-out

2. **JavaScript Integration**:
   - `/src/services/nativeGoogleAuth.ts` - Platform detection and routing
   - `/src/contexts/auth/authService.ts` - Authentication service
   - `/src/hooks/useGoogleAuth.ts` - React hook

3. **Configuration**:
   - `/ios/App/App/Info.plist` - URL schemes and permissions
   - `/capacitor.config.ts` - Capacitor plugin settings
   - `/ios/App/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist` - Google credentials

## Testing Instructions

To test the Google Sign-In implementation:

1. **Verify Configuration**:
   ```bash
   cd ios/App/App
   ./ensure_google_credentials.sh
   ```
   This script checks all configuration files and ensures they are set up correctly.

2. **Build and Run**:
   - Build and run the app on a real iOS device (not simulator)
   - Navigate to the sign-in screen
   - Tap the Google Sign-In button
   - The native Google Sign-In UI should appear (not a browser window)
   - After signing in, verify that you are successfully authenticated

3. **Debug Mode**:
   - The implementation includes extensive debug logs
   - Look for log messages with the 📱 emoji prefix
   - Check for any authentication-related errors

## Troubleshooting

If Google Sign-In doesn't work:

1. **Check URL Schemes**:
   - Ensure the URL scheme is correctly registered in `Info.plist`
   - The URL scheme should be: `com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2`

2. **Check Plugin Registration**:
   - Verify that `plugin.m` includes the `GoogleAuthPlugin` registration

3. **Check Credentials**:
   - Run `ensure_google_credentials.sh` to verify all credentials
   - Ensure the Google credentials plist file exists and has correct values

4. **Check URL Handling**:
   - In `AppDelegate.swift`, verify that the Google Sign-In URL handling is working
   - Check logs for any URL-related errors

## Implementation Notes

- The implementation separates the authentication flow between iOS and web/Android
- On iOS, it uses the native Google Sign-In SDK through a custom Capacitor plugin
- The native implementation provides better security and user experience on iOS
- After Google authentication, tokens are passed to Supabase for session management

## Security Considerations

- ID tokens and access tokens are passed securely through the native plugin
- No tokens are stored in local storage, only in memory during the authentication process
- URL schemes are protected against hijacking by proper bundle ID verification

## Future Improvements

- Add more detailed error reporting to the UI
- Enhance token refresh handling
- Improve sign-out experience
- Add additional sign-in methods
