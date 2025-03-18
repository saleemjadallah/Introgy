
import { useState, useEffect } from "react";
import { BadgeData } from "@/data/badgesData";
import { getUserBadges, triggerBadgeProgress } from "@/services/badgeService";

export function useBadges(userId: string = "guest") {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user badges
  useEffect(() => {
    const loadBadges = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        const userBadges = getUserBadges(userId);
        setBadges(userBadges);
      } catch (error) {
        console.error("Error loading badges:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBadges();
  }, [userId]);
  
  // Function to record an action that might trigger badge progress
  const recordAction = (action: string, count: number = 1) => {
    triggerBadgeProgress(action, count, userId);
    
    // Refresh badges after action
    setBadges(getUserBadges(userId));
  };
  
  return {
    badges,
    isLoading,
    recordAction
  };
}
