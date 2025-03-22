import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AnimatedProgressProps = {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
  showWaveEffect?: boolean;
  pulseOnChange?: boolean;
  celebrateOnMax?: boolean;
  height?: number; // height in pixels
};

export const AnimatedProgress = ({ 
  value, 
  className, 
  barClassName,
  showWaveEffect = true, 
  pulseOnChange = true,
  celebrateOnMax = true,
  height = 10
}: AnimatedProgressProps) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  useEffect(() => {
    if (value !== prevValue) {
      if (pulseOnChange) {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 500);
      }
      
      if (celebrateOnMax && value === 100 && prevValue !== 100) {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 2000);
      }
      
      setPrevValue(value);
    }
  }, [value, prevValue, pulseOnChange, celebrateOnMax]);

  // Wave animation for the progress bar
  const waveVariants = {
    animate: {
      x: ["-100%", "0%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 5,
          ease: "linear"
        }
      }
    }
  };

  // Pulse animation when value changes
  const pulseVariants = {
    idle: { 
      opacity: 1 
    },
    pulse: {
      opacity: [1, 0.7, 1],
      transition: { 
        duration: 0.5,
        times: [0, 0.5, 1]
      }
    }
  };

  // Celebration animation when reaching 100%
  const celebrationVariants = {
    idle: { 
      scale: 1,
      opacity: 1
    },
    celebrate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.9, 1],
      transition: { 
        duration: 1,
        repeat: 1,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className={cn(
        "w-full bg-white/20 rounded-full overflow-hidden", 
        className
      )}
      style={{ height }}
      variants={celebrationVariants}
      animate={isCelebrating ? "celebrate" : "idle"}
    >
      <motion.div 
        className={cn("h-full relative", barClassName)}
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={isPulsing ? 
          { width: `${value}%`, ...pulseVariants.pulse } : 
          { width: `${value}%` }
        }
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        variants={pulseVariants}
      >
        {showWaveEffect && (
          <motion.div 
            className="absolute inset-0 w-[200%] h-full opacity-30"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              backgroundSize: "50% 100%",
              backgroundRepeat: "repeat"
            }}
            variants={waveVariants}
            animate="animate"
          />
        )}
      </motion.div>
    </motion.div>
  );
};
