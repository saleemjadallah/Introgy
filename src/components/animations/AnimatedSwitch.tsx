import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { triggerHapticFeedback } from "@/lib/animationUtils";

type AnimatedSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  enableHaptics?: boolean;
  labelPosition?: "left" | "right";
};

export const AnimatedSwitch = ({
  checked,
  onChange,
  size = "md",
  label,
  description,
  disabled = false,
  className,
  enableHaptics = true,
  labelPosition = "right"
}: AnimatedSwitchProps) => {
  const id = useId();
  
  // Define size-specific properties
  const sizes = {
    sm: {
      switch: "w-8 h-4",
      knob: "w-3 h-3",
      knobTranslate: 16,
      text: "text-sm"
    },
    md: {
      switch: "w-11 h-6",
      knob: "w-5 h-5",
      knobTranslate: 20,
      text: "text-base"
    },
    lg: {
      switch: "w-14 h-7",
      knob: "w-6 h-6",
      knobTranslate: 28,
      text: "text-lg"
    }
  };
  
  const handleToggle = () => {
    if (disabled) return;
    
    if (enableHaptics) {
      triggerHapticFeedback();
    }
    
    onChange(!checked);
  };
  
  const currentSize = sizes[size];
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        labelPosition === "left" ? "flex-row-reverse" : "flex-row",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <motion.button
        role="switch"
        aria-checked={checked}
        id={id}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
        onClick={handleToggle}
        className={cn(
          "relative rounded-full flex items-center p-0.5 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600",
          currentSize.switch
        )}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled}
      >
        <motion.span
          className={cn(
            "rounded-full bg-white shadow-sm",
            currentSize.knob
          )}
          initial={false}
          animate={{
            x: checked ? currentSize.knobTranslate : 0,
            boxShadow: checked 
              ? "0 2px 4px rgba(0, 0, 0, 0.2)" 
              : "0 1px 2px rgba(0, 0, 0, 0.1)"
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
        
        {/* Ripple effect when toggling */}
        {checked && (
          <motion.span
            className="absolute inset-0 rounded-full bg-blue-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
      
      {(label || description) && (
        <div 
          className={cn(
            "flex flex-col",
            disabled && "cursor-not-allowed"
          )}
          onClick={disabled ? undefined : handleToggle}
        >
          {label && (
            <span 
              id={`${id}-label`}
              className={cn(
                "font-medium text-gray-900 dark:text-gray-100",
                currentSize.text
              )}
            >
              {label}
            </span>
          )}
          
          {description && (
            <span 
              id={`${id}-description`}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
