# Introgy UI Animation Components

This directory contains a collection of reusable animated UI components designed to enhance the user experience of the Introgy app with modern, iOS-inspired animations and interactions.

## Animation Components

### AnimatedButton
A button component with enhanced interaction feedback:
- Spring animations on tap and hover
- Haptic feedback support
- Loading state with animated spinner
- Support for icons and various sizes/variants

### AnimatedCard
A card component with interactive animations:
- Spring animations for hover and tap states
- Elevation changes with dynamic shadows
- Scale and opacity transitions

### AnimatedInput
An enhanced input field with animation effects:
- Focus/blur animations with smooth transitions
- Support for icons, error states, and loading indicators
- Password visibility toggle with animations
- Clear button functionality

### AnimatedProgress
A progress indicator with fluid animations:
- Wave animation effect for a modern look
- Pulse animations on value changes
- Celebration animations when reaching 100%
- Customizable colors and heights

### AnimatedSkeleton
Loading skeleton components for content placeholders:
- Shimmer effect animations
- Variants for different content types (text, card, avatar)
- Support for accessibility preferences
- Predefined layout patterns

### AnimatedSwitch
A toggle switch with smooth transitions:
- Spring animations for the toggle state
- Haptic feedback support
- Ripple effect on activation
- Customizable sizes and label positions

### AnimatedTabBar
A modern tab bar with enhanced navigation:
- Smooth transitions between active states
- Icon swapping animations
- Haptic feedback on selection
- Floating animation effect

### AnimatedToast
A toast notification component with clean transitions:
- Entrance and exit animations
- Countdown timer with progress indication
- Support for different notification types
- Auto-close functionality

### AnimatedTransition
A utility component for page and content transitions:
- Multiple transition types (slide, fade, scale)
- Support for reduced motion preferences
- AnimatePresence integration

## Utility Files

### animationUtils.ts
Utilities for animation control and consistency:
- Spring presets for different animation feels
- Standard durations and easing functions
- Haptic feedback utilities
- Reduced motion preference detection

### accessibilityUtils.ts
Utilities for ensuring animations respect accessibility preferences:
- Reduced motion detection
- Accessible duration scaling
- Haptic feedback pattern support

## Usage

Import components directly from the animations directory:

```tsx
import { 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedProgress 
} from '@/components/animations';
```

Example usage:

```tsx
<AnimatedButton 
  variant="primary"
  size="md"
  hapticFeedback={true}
  onClick={handleClick}
>
  Click Me
</AnimatedButton>
```

All animation components automatically respect user's motion preferences and provide accessible alternatives when needed.
