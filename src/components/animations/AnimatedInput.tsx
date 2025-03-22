import { motion } from "framer-motion";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X, Eye, EyeOff } from "lucide-react";

type AnimatedInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
  containerClassName?: string;
};

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isLoading,
      showClearButton,
      onClear,
      containerClassName,
      className,
      onFocus,
      onBlur,
      type,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const clearButton = showClearButton && props.value && !props.disabled && (
      <button
        type="button"
        onClick={onClear}
        className="text-gray-400 hover:text-gray-500 rounded-full p-1 focus:outline-none"
      >
        <X size={16} />
      </button>
    );

    const passwordToggle = isPassword && (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-gray-500 hover:text-gray-700 rounded-full p-1 focus:outline-none"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    );

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

    return (
      <div className={cn("space-y-1", containerClassName)}>
        {label && (
          <label
            className={cn(
              "block text-sm font-medium transition-colors",
              error ? "text-red-600" : "text-gray-700 dark:text-gray-300",
              focused && !error && "text-blue-600 dark:text-blue-400"
            )}
          >
            {label}
          </label>
        )}
        
        <motion.div 
          className={cn(
            "flex items-center relative rounded-md border overflow-hidden transition-all",
            error 
              ? "border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 bg-red-50" 
              : "border-gray-300 dark:border-gray-600 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400",
            focused && !error && "border-blue-400 ring-1 ring-blue-400",
            props.disabled && "opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
          )}
          initial={false}
          animate={
            focused 
              ? { boxShadow: error ? "0 0 0 2px rgba(239, 68, 68, 0.25)" : "0 0 0 2px rgba(59, 130, 246, 0.25)" } 
              : { boxShadow: "none" }
          }
          transition={{ duration: 0.2 }}
        >
          {leftIcon && (
            <div className="pl-3 flex items-center text-gray-500">{leftIcon}</div>
          )}
          
          <input
            ref={ref}
            className={cn(
              "w-full py-2 px-3 text-gray-900 dark:text-gray-100 bg-transparent placeholder:text-gray-400 focus:outline-none",
              leftIcon && "pl-2",
              (rightIcon || isLoading || clearButton || passwordToggle) && "pr-2",
              className
            )}
            type={inputType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          <div className="flex items-center gap-1 pr-3">
            {isLoading && (
              <motion.div
                className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                variants={spinnerVariants}
                animate="animate"
              />
            )}
            
            {clearButton}
            {passwordToggle}
            
            {rightIcon && (
              <div className="text-gray-500">{rightIcon}</div>
            )}
          </div>
        </motion.div>
        
        {(error || hint) && (
          <motion.p
            className={cn(
              "text-xs mt-1",
              error ? "text-red-600" : "text-gray-500 dark:text-gray-400"
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";
