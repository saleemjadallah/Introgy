# Introgy iOS App

## Recent Updates

### Animation Components Upgrade (March 2025)
- Added a suite of animated UI components in the web app using Framer Motion
- Removed native iOS UI components in favor of web-based animations
- Fixed AppDelegate.swift to properly support Capacitor and Google Sign-In

### Native UI Cleanup
Native UI components have been removed from the project as they've been replaced by web-based animations that will be rendered through Capacitor. The following components were removed:

- AnimatedCardView
- AnimatedCardViewRepresentable
- AnimatedDialog  
- AnimatedProgressView
- AnimatedTabBar
- AnimationUtilities
- DesignSystem
- MainTabBarController
- ModernButtonStyle
- SocialBatteryView
- TransitionManager
- UIViewExtensions

A backup of these files was created at `NativeUIBackup_[timestamp]` in case they need to be referenced in the future.

### AppDelegate.swift Updates
The AppDelegate.swift file has been updated to properly support Capacitor integration along with Google Sign-In and RevenueCat. The key changes include:

1. Fixed method signatures for application launch and URL handling
2. Ensured proper initialization of Google Sign-In
3. Maintained compatibility with RevenueCat for in-app purchases

## Building the App
1. Make sure the web assets are built:
   ```
   npm run build
   ```

2. Sync the Capacitor project:
   ```
   npx cap sync ios
   ```

3. Open the project in Xcode:
   ```
   npx cap open ios
   ```

4. Build and run the app from Xcode

## Troubleshooting
If you encounter build issues:
1. Check that all pods are installed correctly
2. Verify that the AppDelegate.swift file matches the current Capacitor version
3. Ensure Google Sign-In configuration is correct
4. Check RevenueCat API key in configuration
