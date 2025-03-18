
import { BadgeData, badgesData } from "@/data/badgesData";
import { toast } from "sonner";
import { BadgeState } from "@/components/badges/Badge";

// Function to check if a badge should be awarded
export const checkBadgeEligibility = (
  action: string, 
  count: number = 1, 
  userId: string = "guest"
): BadgeData[] => {
  // Get badges that might be triggered by this action
  const relevantBadges = badgesData.filter(
    badge => badge.criteria.type === action && 
    badge.state !== "achieved" && 
    badge.state !== "mastered"
  );
  
  // Check if any badges should be updated
  const updatedBadges: BadgeData[] = [];
  
  relevantBadges.forEach(badge => {
    // Make a copy of the badge to update
    let updatedBadge = { ...badge };
    
    // If badge is locked, initialize progress
    if (badge.state === "locked") {
      updatedBadge.state = "in-progress";
      updatedBadge.progress = count;
    }
    // If badge is in progress, increment progress
    else if (badge.state === "in-progress") {
      updatedBadge.progress = (badge.progress || 0) + count;
    }
    
    // Check if badge is now achieved
    if (
      updatedBadge.state === "in-progress" &&
      updatedBadge.progress !== undefined &&
      updatedBadge.maxProgress !== undefined &&
      updatedBadge.progress >= updatedBadge.maxProgress
    ) {
      updatedBadge.state = "achieved" as BadgeState;
      updatedBadge.earnedDate = new Date();
      
      // Notify the user
      notifyBadgeEarned(updatedBadge);
    }
    
    // Add to updated badges list
    if (updatedBadge.state !== badge.state || updatedBadge.progress !== badge.progress) {
      updatedBadges.push(updatedBadge);
      
      // In a real app, we would save this to the database
      saveBadgeProgress(updatedBadge, userId);
    }
  });
  
  return updatedBadges;
};

// Function to save badge progress (mock implementation)
const saveBadgeProgress = (badge: BadgeData, userId: string): void => {
  console.log(`Saving badge progress for ${badge.name} for user ${userId}`);
  // In a real app, this would save to a database
  
  // Update local state (for demo purposes)
  const index = badgesData.findIndex(b => b.id === badge.id);
  if (index !== -1) {
    badgesData[index] = { ...badge };
  }
};

// Function to notify user of a newly earned badge
const notifyBadgeEarned = (badge: BadgeData): void => {
  toast("New Badge Earned", {
    description: `You've earned the "${badge.name}" badge!`,
    duration: 5000,
    icon: "🏆",
  });
};

// Function to trigger a badge progress update
export const triggerBadgeProgress = (
  action: string, 
  count: number = 1,
  userId: string = "guest"
): void => {
  const updatedBadges = checkBadgeEligibility(action, count, userId);
  
  // Log for debugging
  if (updatedBadges.length > 0) {
    console.log(`Updated ${updatedBadges.length} badges based on action: ${action}`);
  }
};

// Mock function to earn a specific badge (for testing/demo)
export const earnBadge = (badgeId: string, userId: string = "guest"): boolean => {
  const badge = badgesData.find(b => b.id === badgeId);
  
  if (badge && badge.state !== "achieved" && badge.state !== "mastered") {
    const updatedBadge = { 
      ...badge, 
      state: "achieved" as BadgeState, 
      earnedDate: new Date() 
    };
    
    saveBadgeProgress(updatedBadge, userId);
    notifyBadgeEarned(updatedBadge);
    return true;
  }
  
  return false;
};

// Get all badges for a user (mock implementation)
export const getUserBadges = (userId: string = "guest"): BadgeData[] => {
  // In a real app, this would fetch from a database
  return badgesData;
};
