// Accessibility Utilities for Animations

/**
 * Hook to check if the user has requested reduced motion
 * This is important for accessibility and user preferences
 */
export const useReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    return query.matches;
  } catch (e) {
    // If the browser doesn't support the API, default to false
    return false;
  }
};

/**
 * Get animation properties based on user's motion preferences
 * 
 * @param standardProps - Animation properties for standard motion
 * @param reducedProps - Animation properties for reduced motion
 * @returns - The appropriate animation properties based on user preferences
 */
export const getAccessibleAnimationProps = <T>(
  standardProps: T,
  reducedProps: Partial<T> = {}
): T => {
  if (typeof window === 'undefined') return standardProps;
  
  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return prefersReducedMotion 
      ? { ...standardProps, ...reducedProps } 
      : standardProps;
  } catch (e) {
    // Fallback to standard animation properties
    return standardProps;
  }
};

/**
 * Animation duration scaling based on user preferences
 * 
 * @param duration - The standard duration in seconds
 * @returns - The accessible duration based on user preferences
 */
export const getAccessibleDuration = (duration: number): number => {
  if (typeof window === 'undefined') return duration;
  
  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return prefersReducedMotion 
      ? Math.min(duration * 0.5, 0.1) // Reduce duration for reduced motion users, max 0.1s
      : duration;
  } catch (e) {
    // Fallback to standard duration
    return duration;
  }
};

/**
 * Checks if the browser supports haptic feedback API
 */
export const supportsHaptics = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Type for different haptic patterns
 */
export type HapticPattern = 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy';

/**
 * Trigger haptic feedback with different patterns based on context
 * 
 * @param pattern - The haptic pattern to use
 * @returns - Whether the haptic feedback was triggered
 */
export const triggerAccessibleHaptics = (pattern: HapticPattern = 'light'): boolean => {
  if (!supportsHaptics()) return false;
  
  // Define haptic patterns (in milliseconds)
  const patterns = {
    success: [10, 30, 10],     // Short - long - short
    warning: [30, 50, 30],     // Medium - long - medium
    error: [50, 30, 50, 30],   // Long - short - long - short
    light: [10],               // Very short tap
    medium: [30],              // Short tap
    heavy: [50]                // Stronger tap
  };
  
  try {
    navigator.vibrate(patterns[pattern]);
    return true;
  } catch (e) {
    return false;
  }
};
