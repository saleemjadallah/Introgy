import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedTabBarProps = {
  items: {
    icon: ReactNode;
    activeIcon?: ReactNode;
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const AnimatedTabBar = ({ items, value, onChange, className }: AnimatedTabBarProps) => {
  // For haptic feedback simulation
  const triggerHapticFeedback = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(5); // Light haptic pulse
    }
  };

  return (
    <motion.div 
      className={cn(
        "fixed bottom-0 left-0 right-0 h-20 pt-1 pb-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-around items-center px-2",
        "shadow-[0_-2px_10px_rgba(0,0,0,0.03)]",
        className
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {items.map((item) => (
        <TabBarItem 
          key={item.value}
          {...item}
          isActive={value === item.value}
          onSelect={() => {
            onChange(item.value);
            triggerHapticFeedback();
          }}
        />
      ))}
    </motion.div>
  );
};

type TabBarItemProps = {
  icon: ReactNode;
  activeIcon?: ReactNode;
  label: string;
  value: string;
  isActive: boolean;
  onSelect: () => void;
};

const TabBarItem = ({ icon, activeIcon, label, isActive, onSelect }: TabBarItemProps) => {
  const [isHovering, setIsHovering] = useState(false);

  // To handle proper animation timing of icons
  const [isRenderingActive, setIsRenderingActive] = useState(isActive);
  
  useEffect(() => {
    if (isActive) {
      setIsRenderingActive(true);
    } else {
      // Delay setting to false to allow animation to complete
      const timer = setTimeout(() => setIsRenderingActive(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <motion.button
      className="relative flex flex-col items-center justify-center h-full flex-1"
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={onSelect}
    >
      <motion.div 
        className="relative"
        animate={{ 
          y: isActive ? -5 : 0,
          scale: isActive ? 1.1 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div 
          className={cn(
            "transition-colors duration-300",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
          animate={{ opacity: isRenderingActive ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        
        {activeIcon && (
          <motion.div 
            className="text-primary absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isRenderingActive ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeIcon}
          </motion.div>
        )}
      </motion.div>

      <motion.span 
        className={cn(
          "text-xs mt-1 transition-colors duration-300",
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        )}
        animate={{ opacity: isHovering || isActive ? 1 : 0.7 }}
      >
        {label}
      </motion.span>
      
      {isActive && (
        <motion.div
          className="absolute -bottom-0 w-10 h-1 bg-primary rounded-t-full"
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
