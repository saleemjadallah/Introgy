
import React from "react";
import { cn } from "@/lib/utils";

export type BadgeState = "locked" | "in-progress" | "achieved" | "mastered";
export type BadgeCategory = 
  | "self-awareness" 
  | "energy-management" 
  | "social-skill" 
  | "growth" 
  | "app-engagement"
  | "special";

export interface BadgeProps {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  state: BadgeState;
  icon: React.ReactNode;
  progress?: number;
  maxProgress?: number;
  earnedDate?: Date;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const Badge = ({
  name,
  description,
  state = "locked",
  icon,
  progress,
  maxProgress,
  onClick,
  size = "md"
}: BadgeProps) => {
  // Determine the size class for the badge
  const getSizeClass = () => {
    switch (size) {
      case "sm": return "w-12 h-12";
      case "lg": return "w-28 h-28";
      default: return "w-20 h-20"; // medium size
    }
  };
  
  // Determine the background style based on badge state
  const getStateStyle = () => {
    switch (state) {
      case "locked":
        return "bg-muted/40 text-muted-foreground/60";
      case "in-progress":
        return "bg-primary/10 text-primary/80";
      case "achieved":
        return "bg-primary/20 text-primary";
      case "mastered":
        return "bg-gradient-to-br from-primary/30 to-indigo-400/30 text-primary shadow-sm";
      default:
        return "bg-muted/40 text-muted-foreground/60";
    }
  };
  
  // Calculate progress percentage for "in-progress" badges
  const progressPercentage = progress && maxProgress 
    ? Math.min(100, Math.round((progress / maxProgress) * 100)) 
    : 0;
    
  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300",
        getSizeClass(),
        getStateStyle(),
        state === "locked" ? "opacity-50" : "opacity-100",
        state === "mastered" ? "ring-2 ring-primary/40 ring-offset-1" : ""
      )}
      onClick={onClick}
      title={name}
    >
      {/* Badge Icon */}
      <div className={cn(
        "flex items-center justify-center",
        state === "locked" ? "opacity-40" : "opacity-100"
      )}>
        {icon}
      </div>
      
      {/* Progress indicator for "in-progress" badges */}
      {state === "in-progress" && progress !== undefined && maxProgress !== undefined && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute bottom-0 bg-primary/20 w-full"
            style={{ height: `${progressPercentage}%` }}
          />
        </div>
      )}
      
      {/* Mastery effect/glow for "mastered" badges */}
      {state === "mastered" && (
        <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm -z-10" />
      )}
    </div>
  );
};

export default Badge;
