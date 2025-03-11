
import { BadgeData } from "./badgeUtils";
import { selfAwarenessBadges } from "./selfAwarenessBadges";
import { energyManagementBadges } from "./energyManagementBadges";
import { socialSkillBadges } from "./socialSkillBadges";
import { growthBadges } from "./growthBadges";
import { appEngagementBadges } from "./appEngagementBadges";
import { specialBadges } from "./specialBadges";
import type { BadgeCategory } from "@/components/badges/Badge";

// Combine all badge categories into a single array
export const badgesData: BadgeData[] = [
  ...selfAwarenessBadges,
  ...energyManagementBadges,
  ...socialSkillBadges,
  ...growthBadges,
  ...appEngagementBadges,
  ...specialBadges
];

// Export badges by category for easy filtering
export const getBadgesByCategory = (category: BadgeCategory) => {
  return badgesData.filter(badge => badge.category === category);
};

// Get all badges
export const getAllBadges = () => badgesData;

// Get recently earned badges
export const getRecentlyEarnedBadges = (days: number = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return badgesData.filter(
    badge => badge.earnedDate && badge.earnedDate > cutoffDate && 
    (badge.state === "achieved" || badge.state === "mastered")
  );
};

// Get badges in progress
export const getBadgesInProgress = () => {
  return badgesData.filter(badge => badge.state === "in-progress");
};
