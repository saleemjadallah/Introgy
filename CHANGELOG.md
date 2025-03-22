# Changelog

All notable changes to the Introgy app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New suite of animated UI/UX components for enhanced user experience
  - AnimatedButton: Interactive buttons with spring animations, haptic feedback, and loading states
  - AnimatedCard: Cards with hover/press animations and elevation changes
  - AnimatedInput: Form fields with animated focus states and transition effects
  - AnimatedProgress: Fluid progress indicators with wave animations and pulse effects
  - AnimatedSkeleton: Content loading placeholders with shimmer effects
  - AnimatedSwitch: Toggle switches with smooth transitions and haptic feedback
  - AnimatedTabBar: Enhanced tab navigation with icon animations and transitions
  - AnimatedToast: Toast notifications with entrance/exit animations and auto-dismiss
  - AnimatedTransition: Page and content transition effects
- Utility files for animation and accessibility support
  - animationUtils.ts: Shared animation constants and functions
  - accessibilityUtils.ts: Helpers for respecting user motion preferences

### Changed
- Migrated from native iOS UI components to web-based animations via Capacitor
- Updated AppDelegate.swift to properly support Capacitor integration
- Enhanced build process to properly handle web assets

### Removed
- Native iOS UI components that were replaced by web-based animations:
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

### Fixed
- AppDelegate.swift integration with Capacitor
- Google Sign-In handling in AppDelegate
- Native UI component references in the iOS app

## [1.0.0] - Initial Release
- Initial release of Introgy app
