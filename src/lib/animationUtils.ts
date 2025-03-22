// Animation utility functions and constants

// Check if user prefers reduced motion
export const checkReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  return query.matches;
};

// Standard animation durations
export const ANIMATION_DURATION = {
  FAST: 0.15,
  NORMAL: 0.3,
  SLOW: 0.5,
  VERY_SLOW: 0.8
};

// Spring presets for different animation feels
export const SPRING_PRESETS = {
  GENTLE: {
    type: "spring",
    stiffness: 170,
    damping: 26
  },
  BOUNCY: {
    type: "spring",
    stiffness: 300,
    damping: 10
  },
  RESPONSIVE: {
    type: "spring",
    stiffness: 400,
    damping: 40
  },
  SUBTLE: {
    type: "spring",
    stiffness: 120,
    damping: 20
  }
};

// Common animation variants
export const VARIANTS = {
  FADE_IN: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  SLIDE_UP: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  SLIDE_DOWN: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  SCALE_UP: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  SCALE_DOWN: {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 }
  }
};

// Staggered children animation
export const staggerChildren = (staggerTime: number = 0.05) => ({
  visible: {
    transition: {
      staggerChildren: staggerTime
    }
  }
});

// For iOS-like spring effect
export const iosSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

// For haptic feedback (when browser supports it)
export const triggerHapticFeedback = (
  pattern: number | number[] = 10
) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// Animation props based on motion preference
export const getAnimationProps = (animate: boolean = true) => {
  if (!animate || checkReducedMotion()) {
    return { 
      initial: undefined,
      animate: undefined,
      exit: undefined,
      transition: { duration: 0 }
    };
  }
  
  return null; // Return null to use default animation props
};

// Delay execution - useful for timed animations
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
