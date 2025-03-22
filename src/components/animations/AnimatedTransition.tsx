import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

// Animation variants for page/content transitions
const pageTransitionVariants = {
  initial: {
    opacity: 0,
    x: 10
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// Fade transition variants
const fadeVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Scale fade transition variants
const scaleFadeVariants = {
  initial: {
    opacity: 0,
    scale: 0.96
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

type TransitionType = "slide" | "fade" | "scaleFade";

type AnimatedTransitionProps = {
  children: ReactNode;
  isVisible?: boolean;
  type?: TransitionType;
  transitionKey?: string | number;
  delay?: number;
  className?: string;
  animate?: "standard" | "reduced";
};

export const AnimatedTransition = ({
  children,
  isVisible = true,
  type = "slide",
  transitionKey,
  delay = 0,
  className,
  animate = "standard"
}: AnimatedTransitionProps) => {
  // Choose the right animation variant based on type
  let variants;
  switch (type) {
    case "slide":
      variants = pageTransitionVariants;
      break;
    case "fade":
      variants = fadeVariants;
      break;
    case "scaleFade":
      variants = scaleFadeVariants;
      break;
    default:
      variants = pageTransitionVariants;
  }

  // Skip animations if reduced motion is requested
  const animationProps = animate === "reduced" ? {} : {
    variants,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: { delay }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={transitionKey}
          className={className}
          {...animationProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
