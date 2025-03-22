# Google Authentication Implementation Guide

This document explains how Google Sign-In is implemented in the Introgy app and provides troubleshooting information for common issues.

## Implementation Overview

The app uses a hybrid approach to Google authentication:

1. On iOS, it uses the native Google Sign-In SDK through a custom Capacitor plugin
2. On web, it uses Supabase OAuth flow

### Key Components

- **Native iOS Implementation**:
  - `GoogleSignInHandler.swift`: Core handler for Google Sign-In operations
  - `GoogleSignInPlugin.swift`: Capacitor plugin exposing native functionality to JavaScript
  - `GoogleSignInViewController.swift`: UI for the sign-in flow
  - `AppDelegate.swift`: Handles URL callbacks and restores sign-in state

- **JavaScript Implementation**:
  - `nativeGoogleAuth.ts`: Service that manages Google authentication
  - `useGoogleAuth.ts`: React hook for integrating with the auth context

- **Configuration**:
  - `capacitor.config.ts`: Contains client IDs and scopes
  - `Info.plist`: URL schemes and GIDClientID
  - `client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist`: Credentials file

## Client IDs

The app uses two different client IDs:

1. **iOS Client ID**: `308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com`
2. **Web Client ID**: `308656966304-ouvq7u7q9sms8rujjtqpevaqr120vdge.apps.googleusercontent.com`

## Authentication Flow

1. User taps "Sign in with Google" in the app
2. On iOS:
   - Native Google Sign-In UI is presented
   - User authenticates with Google
   - App receives ID token and access token
   - Tokens are exchanged with Supabase

3. On web:
   - Supabase OAuth flow is used
   - User is redirected to Google for authentication
   - Redirected back to app with tokens
   - Supabase handles the token exchange

## Common Issues and Solutions

### 1. Google Sign-In Not Working on iOS

**Symptoms**: Tapping the Google sign-in button does nothing or shows an error.

**Possible Causes and Solutions**:

- **Missing Credentials File**: Ensure `client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist` exists in the project and is included in the build.
  
- **URL Scheme Issue**: Verify URL schemes in Info.plist include `com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2`

- **Plugin Registration Issue**: Check that both plugins are registered properly:
  - `GoogleAuthPlugin` should be registered as "GoogleAuth"
  - `GoogleSignInPlugin` should be registered as "GoogleSignIn"

- **SDK Initialization**: Verify Google Sign-In is initialized in AppDelegate with the correct client ID

### 2. "Requested Path is Invalid" Error

**Symptoms**: Authentication starts but fails with "requested path is invalid" error.

**Solution**:
- Do not specify custom redirect URLs in the Supabase call
- Let Supabase use its default redirect URLs

### 3. Authentication Not Persisting

**Symptoms**: User needs to sign in again every time they open the app.

**Solution**:
- Ensure `restorePreviousSignIn` is called in AppDelegate
- Verify that the `GoogleSignInPlugin` adds an observer for restoration events

## Testing

To test the Google Sign-In flow:

1. Run the app on an iOS device or simulator
2. Tap "Sign in with Google"
3. Complete the authentication flow
4. Verify that the user stays signed in when reopening the app

## Debugging

For debugging authentication issues:

1. Check the Xcode console for detailed logs
2. Look for events with the "📱" prefix for native Google Sign-In logs
3. Use the iOS App Authentication debug page to see detailed token information

## Build Notes

To ensure Google Sign-In works properly in production builds:

1. Run `ensure_google_credentials.sh` during the build process
2. Make sure the Google credentials plist file is included in the Xcode project
3. Verify that the URL schemes are properly configured

## References

- [Google Sign-In for iOS Documentation](https://developers.google.com/identity/sign-in/ios/start)
- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Capacitor Deep Linking Guide](https://capacitorjs.com/docs/apis/app#handling-deep-links)