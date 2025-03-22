import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Animation variants for card
const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30, 
      mass: 1
    }
  },
  tap: { 
    scale: 1.02,
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30
    }
  },
  hover: { 
    scale: 1.01,
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
    transition: { 
      type: "tween", 
      ease: "easeOut", 
      duration: 0.2 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    transition: { 
      duration: 0.2 
    } 
  }
};

type AnimatedCardProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  delay?: number;
  isInteractive?: boolean;
  animate?: "standard" | "reduced";
};

export const AnimatedCard = ({ 
  children, 
  onClick, 
  className, 
  delay = 0, 
  isInteractive = true,
  animate = "standard"
}: AnimatedCardProps) => {
  // Skip animations if reduced motion is requested
  const animationProps = animate === "reduced" ? {} : {
    variants: cardVariants,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    whileHover: isInteractive ? "hover" : undefined,
    whileTap: isInteractive ? "tap" : undefined,
    transition: { delay }
  };

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
};
