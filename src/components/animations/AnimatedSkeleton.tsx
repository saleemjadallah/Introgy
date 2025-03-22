import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/accessibilityUtils";

type SkeletonVariant = "text" | "circular" | "rectangular" | "card" | "avatar" | "button";

type AnimatedSkeletonProps = {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
  count?: number;
  gap?: number;
};

export const AnimatedSkeleton = ({
  variant = "text",
  width,
  height,
  className,
  animated = true,
  count = 1,
  gap = 0.5
}: AnimatedSkeletonProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Default dimensions based on variant
  let defaultWidth: string | number = "100%";
  let defaultHeight: string | number = 16;
  let defaultRadius = "0.25rem";
  
  switch (variant) {
    case "circular":
      defaultWidth = 48;
      defaultHeight = 48;
      defaultRadius = "50%";
      break;
    case "rectangular":
      defaultHeight = 100;
      break;
    case "card":
      defaultHeight = 200;
      defaultRadius = "0.5rem";
      break;
    case "avatar":
      defaultWidth = 40;
      defaultHeight = 40;
      defaultRadius = "50%";
      break;
    case "button":
      defaultWidth = 120;
      defaultHeight = 36;
      defaultRadius = "0.375rem";
      break;
  }
  
  // Use provided dimensions or defaults
  const finalWidth = width ?? defaultWidth;
  const finalHeight = height ?? defaultHeight;
  
  // Animation variants
  const shimmerAnimation = animated && !prefersReducedMotion
    ? {
        background: ["#f0f0f0", "#e0e0e0", "#f0f0f0"],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }
      }
    : {};
  
  // Create multiple skeleton elements if count > 1
  if (count > 1) {
    return (
      <div className={cn("flex flex-col", `gap-${gap}`)}>
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "bg-gray-200 dark:bg-gray-700",
              className
            )}
            style={{
              width: finalWidth,
              height: finalHeight,
              borderRadius: defaultRadius
            }}
            animate={shimmerAnimation}
          />
        ))}
      </div>
    );
  }
  
  return (
    <motion.div
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        className
      )}
      style={{
        width: finalWidth,
        height: finalHeight,
        borderRadius: defaultRadius
      }}
      animate={shimmerAnimation}
    />
  );
};

// Specialized skeleton components for common use cases
export const TextSkeleton = (props: Omit<AnimatedSkeletonProps, "variant">) => (
  <AnimatedSkeleton variant="text" {...props} />
);

export const AvatarSkeleton = (props: Omit<AnimatedSkeletonProps, "variant">) => (
  <AnimatedSkeleton variant="avatar" {...props} />
);

export const CardSkeleton = (props: Omit<AnimatedSkeletonProps, "variant">) => (
  <AnimatedSkeleton variant="card" {...props} />
);

// Predefined skeleton layouts
export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <AvatarSkeleton width={64} height={64} />
      <div className="space-y-2 flex-1">
        <TextSkeleton width="70%" height={24} />
        <TextSkeleton width="40%" height={14} />
      </div>
    </div>
    <TextSkeleton count={3} />
  </div>
);

export const CardListSkeleton = ({ items = 3 }: { items?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <CardSkeleton key={index} height={120} />
    ))}
  </div>
);
