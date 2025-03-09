
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeProps } from "./Badge";
import { formatDistanceToNow } from "date-fns";
import { Award, Calendar, CheckCircle2, Circle, LucideIcon } from "lucide-react";
import { Badge as UIBadge } from "@/components/ui/badge";

interface BadgeDetailProps {
  badge: BadgeProps;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeDetail = ({ badge, isOpen, onClose }: BadgeDetailProps) => {
  const { 
    name, 
    description, 
    state, 
    icon, 
    progress, 
    maxProgress, 
    earnedDate, 
    category 
  } = badge;
  
  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const renderProgressIndicator = () => {
    if (state === "locked") {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Circle size={16} />
          <span>Not yet started</span>
        </div>
      );
    }
    
    if (state === "in-progress" && progress !== undefined && maxProgress !== undefined) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.round((progress / maxProgress) * 100))}%` }}
              />
            </div>
            <span className="text-sm font-medium">{progress}/{maxProgress}</span>
          </div>
        </div>
      );
    }
    
    if (state === "achieved" || state === "mastered") {
      return (
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle2 size={16} />
          <span>
            {state === "mastered" ? "Mastered" : "Achieved"}
            {earnedDate && ` ${formatDistanceToNow(earnedDate, { addSuffix: true })}`}
          </span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {name}
            {state === "mastered" && <Award className="h-5 w-5 text-primary" />}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="w-24 h-24 flex items-center justify-center">
            {icon}
          </div>
          
          <UIBadge variant="outline" className="capitalize">
            {formatCategory(category)}
          </UIBadge>
          
          {renderProgressIndicator()}
          
          {earnedDate && state !== "locked" && state !== "in-progress" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>Earned on {earnedDate.toLocaleDateString()}</span>
            </div>
          )}
          
          {state === "mastered" && (
            <div className="text-center text-sm italic text-muted-foreground mt-2 px-4">
              "The true mark of mastery is not just in achievement, but in the journey of self-discovery."
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeDetail;
