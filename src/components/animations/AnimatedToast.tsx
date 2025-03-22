import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ToastType = "default" | "success" | "warning" | "error" | "info";

type AnimatedToastProps = {
  title: string;
  description?: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
  icon?: ReactNode;
  className?: string;
};

const toastVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const AnimatedToast = ({
  title,
  description,
  type = "default",
  isVisible,
  onClose,
  autoCloseDelay = 5000,
  icon,
  className
}: AnimatedToastProps) => {
  const [progress, setProgress] = useState(100);
  
  // Effect to handle auto-close
  useEffect(() => {
    if (!isVisible) return;
    
    const startTime = Date.now();
    const endTime = startTime + autoCloseDelay;
    
    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / autoCloseDelay) * 100;
      
      setProgress(newProgress);
      
      if (newProgress <= 0) {
        clearInterval(progressInterval);
        onClose();
      }
    }, 16); // ~60fps
    
    return () => clearInterval(progressInterval);
  }, [isVisible, autoCloseDelay, onClose]);
  
  // Get color class based on type
  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800";
    }
  };
  
  // Get icon color class
  const getIconColorClass = () => {
    switch (type) {
      case "success": return "text-green-500 dark:text-green-400";
      case "warning": return "text-amber-500 dark:text-amber-400";
      case "error": return "text-red-500 dark:text-red-400";
      case "info": return "text-blue-500 dark:text-blue-400";
      default: return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md z-50",
            "rounded-lg shadow-lg border p-4",
            "backdrop-blur-sm",
            getColorClasses(),
            className
          )}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-start gap-3">
            {icon && (
              <div className={cn("flex-shrink-0 mt-0.5", getIconColorClass())}>
                {icon}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
              {description && (
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{description}</p>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 
                        hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gray-400 dark:bg-gray-500"
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
