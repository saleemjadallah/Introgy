import { motion } from "framer-motion";
import React, { ButtonHTMLAttributes, ReactNode, useRef } from "react";
import { SPRING_PRESETS, triggerHapticFeedback } from "@/lib/animationUtils";
import { cn } from "@/lib/utils";

// Types for button variants and sizes
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type AnimatedButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  hapticFeedback?: boolean;
  disableAnimation?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">; // Extend HTML button attributes

export const AnimatedButton = ({
  children,
  variant = "primary",
  size = "default",
  icon,
  iconPosition = "left",
  isLoading = false,
  loadingText,
  className,
  hapticFeedback = true,
  disableAnimation = false,
  fullWidth = false,
  onClick,
  ...props
}: AnimatedButtonProps) => {
  // Create a reference to the button element
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Base styling classes based on variant and size
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-200",
    ghost: "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-200",
    link: "text-blue-600 hover:underline dark:text-blue-400 p-0",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md"
  };

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };

  // Animation variants
  const buttonVariants = {
    tap: disableAnimation ? {} : {
      scale: 0.97,
      transition: SPRING_PRESETS.RESPONSIVE
    },
    hover: disableAnimation ? {} : {
      scale: 1.03,
      transition: SPRING_PRESETS.SUBTLE
    },
    loading: {
      opacity: 0.7
    }
  };

  // Loading spinner animation
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent multiple rapid clicks
    if (isLoading || props.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (hapticFeedback) {
      triggerHapticFeedback();
    }
    
    // Log that the button was clicked for debugging
    console.log('AnimatedButton clicked:', children);
    
    // Call the provided onClick handler if it exists
    if (onClick) {
      // Don't preventDefault here as it might interfere with some functionality
      onClick(e);
    }
  };

  // Create a standard button, rather than trying to merge motion props with button props
  return (
    <motion.div
      className={cn(
        "inline-block", // Use inline-block on wrapper to respect width settings
        fullWidth && "w-full"
      )}
      whileTap={!props.disabled ? "tap" : undefined}
      whileHover={!props.disabled ? "hover" : undefined}
      variants={buttonVariants}
      onTapStart={(e) => {
        // Don't capture tap events, let them pass through to the button
        e.stopPropagation();
      }}
      onClick={(e) => {
        // If the click is directly on the motion div (not bubbled up from button),
        // we want to forward it to the actual button for better UX
        if (!isLoading && !props.disabled && buttonRef.current && e.target !== buttonRef.current) {
          console.log('Motion div clicked, triggering button click');
          buttonRef.current.click();
        }
      }}
    >
      <button
        ref={buttonRef}
        className={cn(
          "relative rounded-lg font-medium transition-colors w-full",
          variantClasses[variant],
          sizeClasses[size],
          isLoading ? "cursor-wait" : props.disabled ? "opacity-60 cursor-not-allowed" : "",
          // Add z-index to ensure button is above motion div for click handling
          "z-10",
          className
        )}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        {...props}
      >
      <div className={cn(
        "flex items-center justify-center gap-2",
        iconPosition === "right" ? "flex-row-reverse" : "flex-row"
      )}>
        {isLoading ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              variants={spinnerVariants}
              animate="animate"
            />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </div>
      </button>
    </motion.div>
  );
};
