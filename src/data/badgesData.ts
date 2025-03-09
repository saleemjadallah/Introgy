
import {
  Eye,
  Calendar,
  Sparkles,
  BookOpen,
  Map,
  Battery,
  BatteryCharging,
  ClipboardCheck,
  Scale,
  Wrench, // Replaced Toolbox with Wrench
  MessageSquare,
  DoorOpen,
  LifeBuoy,
  Trees,
  Shield,
  Footprints,
  Circle,
  Compass,
  Leaf, // Replaced Seedling with Leaf
  Flag,
  Home,
  AppWindow,
  CalendarDays,
  MessageSquareQuote,
  Lightbulb,
  Gem,
  Flame,
  Star,
  Circle as CircleIcon
} from "lucide-react";

import type { BadgeCategory, BadgeState } from "@/components/badges/Badge";
import React from "react";

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: React.ReactNode;
  state: BadgeState;
  progress?: number;
  maxProgress?: number;
  earnedDate?: Date;
  criteria: {
    type: string;
    requiredCount?: number;
    requiredAction?: string;
    requiredDuration?: number;
    customLogic?: string;
  };
}

// Helper function to generate badges with default values
const createBadge = (
  id: string,
  name: string,
  description: string,
  category: BadgeCategory,
  icon: React.ReactNode,
  criteria: BadgeData["criteria"],
  state: BadgeState = "locked",
  progress?: number,
  maxProgress?: number,
  earnedDate?: Date
): BadgeData => ({
  id,
  name,
  description,
  category,
  icon,
  state,
  progress,
  maxProgress,
  earnedDate,
  criteria
});

export const badgesData: BadgeData[] = [
  // Self-Awareness Category
  createBadge(
    "inner-observer",
    "Inner Observer",
    "Complete your introvert profile assessment to gain deeper self-understanding.",
    "self-awareness",
    React.createElement(Eye, { className: "h-8 w-8" }),
    { type: "profile_complete" },
    "achieved",
    undefined,
    undefined,
    new Date(2023, 9, 15)
  ),
  
  createBadge(
    "reflection-master",
    "Reflection Master",
    "Log your energy levels for 7 consecutive days to understand your patterns.",
    "self-awareness",
    React.createElement(Calendar, { className: "h-8 w-8" }),
    { type: "consecutive_logs", requiredCount: 7 },
    "in-progress",
    4,
    7
  ),
  
  createBadge(
    "pattern-finder",
    "Pattern Finder",
    "Identify 3 personal energy drain triggers in your social interactions.",
    "self-awareness",
    React.createElement(Sparkles, { className: "h-8 w-8" }),
    { type: "identify_triggers", requiredCount: 3 },
    "locked"
  ),
  
  createBadge(
    "self-knowledge-seeker",
    "Self-Knowledge Seeker",
    "Read 10 articles in the Education Center to expand your understanding.",
    "self-awareness",
    React.createElement(BookOpen, { className: "h-8 w-8" }),
    { type: "read_articles", requiredCount: 10 },
    "in-progress",
    3,
    10
  ),
  
  createBadge(
    "energy-cartographer",
    "Energy Cartographer",
    "Create a detailed map of your social battery patterns over time.",
    "self-awareness",
    React.createElement(Map, { className: "h-8 w-8" }),
    { type: "energy_map_complete" },
    "locked"
  ),
  
  // Energy Management Category
  createBadge(
    "battery-guardian",
    "Battery Guardian",
    "Maintain your social energy above 30% for a full week.",
    "energy-management",
    React.createElement(Battery, { className: "h-8 w-8" }),
    { type: "maintain_energy", requiredDuration: 7 },
    "locked"
  ),
  
  createBadge(
    "recharge-rookie",
    "Recharge Rookie",
    "Use recharge activities 10 times to restore your social energy.",
    "energy-management",
    React.createElement(BatteryCharging, { className: "h-8 w-8" }),
    { type: "use_recharge", requiredCount: 10 },
    "achieved",
    undefined,
    undefined,
    new Date(2023, 10, 5)
  ),
  
  createBadge(
    "preparation-pro",
    "Preparation Pro",
    "Use the Event Preparation feature before 5 different social events.",
    "energy-management",
    React.createElement(ClipboardCheck, { className: "h-8 w-8" }),
    { type: "event_preparation", requiredCount: 5 },
    "in-progress",
    2,
    5
  ),
  
  createBadge(
    "energy-economist",
    "Energy Economist",
    "Balance your social expenditures effectively for 2 weeks.",
    "energy-management",
    React.createElement(Scale, { className: "h-8 w-8" }),
    { type: "energy_balance", requiredDuration: 14 },
    "locked"
  ),
  
  createBadge(
    "recovery-specialist",
    "Recovery Specialist",
    "Utilize 10 different recharge activities to restore your energy.",
    "energy-management",
    React.createElement(Wrench, { className: "h-8 w-8" }), // Changed from Toolbox to Wrench
    { type: "diverse_recharge", requiredCount: 10 },
    "locked"
  ),
  
  // Social Skill Development Category
  createBadge(
    "conversation-apprentice",
    "Conversation Apprentice",
    "Complete 5 conversation simulations to build your social skills.",
    "social-skill",
    React.createElement(MessageSquare, { className: "h-8 w-8" }),
    { type: "conversation_sim", requiredCount: 5 },
    "locked"
  ),
  
  createBadge(
    "exit-strategist",
    "Exit Strategist",
    "Save 5 exit strategies to your personal collection for social situations.",
    "social-skill",
    React.createElement(DoorOpen, { className: "h-8 w-8" }),
    { type: "save_exit_strategies", requiredCount: 5 },
    "locked"
  ),
  
  createBadge(
    "small-talk-survivor",
    "Small Talk Survivor",
    "Complete 3 Small Talk practice sessions to navigate casual conversation.",
    "social-skill",
    React.createElement(LifeBuoy, { className: "h-8 w-8" }),
    { type: "small_talk_practice", requiredCount: 3 },
    "locked"
  ),
  
  createBadge(
    "deep-connection-cultivator",
    "Deep Connection Cultivator",
    "Apply deep conversation techniques in real life interactions.",
    "social-skill",
    React.createElement(Trees, { className: "h-8 w-8" }),
    { type: "use_deep_techniques" },
    "locked"
  ),
  
  createBadge(
    "boundary-setter",
    "Boundary Setter",
    "Successfully implement personal boundaries in social situations.",
    "social-skill",
    React.createElement(Shield, { className: "h-8 w-8" }),
    { type: "set_boundaries" },
    "locked"
  ),
  
  // Growth & Comfort Zone Category
  createBadge(
    "first-step",
    "First Step",
    "Try one strategy outside your comfort zone to expand your capabilities.",
    "growth",
    React.createElement(Footprints, { className: "h-8 w-8" }),
    { type: "outside_comfort_zone", requiredCount: 1 },
    "achieved",
    undefined,
    undefined,
    new Date(2023, 10, 10)
  ),
  
  createBadge(
    "comfort-zone-explorer",
    "Comfort Zone Explorer",
    "Expand your social capabilities in 3 different areas.",
    "growth",
    React.createElement(Circle, { className: "h-8 w-8" }),
    { type: "expand_capabilities", requiredCount: 3 },
    "in-progress",
    1,
    3
  ),
  
  createBadge(
    "introvert-adventurer",
    "Introvert Adventurer",
    "Navigate challenging social situations using app strategies.",
    "growth",
    React.createElement(Compass, { className: "h-8 w-8" }),
    { type: "use_strategies" },
    "locked"
  ),
  
  createBadge(
    "growth-mindset",
    "Growth Mindset",
    "Track your progress in social development for a full month.",
    "growth",
    React.createElement(Leaf, { className: "h-8 w-8" }), // Changed from Seedling to Leaf
    { type: "track_progress", requiredDuration: 30 },
    "locked"
  ),
  
  createBadge(
    "personal-milestone",
    "Personal Milestone",
    "Create and achieve a custom personal goal for your social journey.",
    "growth",
    React.createElement(Flag, { className: "h-8 w-8" }),
    { type: "custom_goal" },
    "locked"
  ),
  
  // App Engagement Category
  createBadge(
    "innercircle-initiate",
    "InnerCircle Initiate",
    "Complete the app onboarding process to start your journey.",
    "app-engagement",
    React.createElement(Home, { className: "h-8 w-8" }),
    { type: "complete_onboarding" },
    "achieved",
    undefined,
    undefined,
    new Date(2023, 9, 10)
  ),
  
  createBadge(
    "feature-explorer",
    "Feature Explorer",
    "Use each main feature of the app at least once to discover all tools.",
    "app-engagement",
    React.createElement(AppWindow, { className: "h-8 w-8" }),
    { type: "use_all_features" },
    "in-progress",
    3,
    5
  ),
  
  createBadge(
    "consistent-companion",
    "Consistent Companion",
    "Use the app for 5 consecutive days to build a helpful habit.",
    "app-engagement",
    React.createElement(CalendarDays, { className: "h-8 w-8" }),
    { type: "consecutive_days", requiredCount: 5 },
    "achieved",
    undefined,
    undefined,
    new Date(2023, 10, 1)
  ),
  
  createBadge(
    "feedback-provider",
    "Feedback Provider",
    "Offer constructive feedback on strategies to improve the experience.",
    "app-engagement",
    React.createElement(MessageSquareQuote, { className: "h-8 w-8" }),
    { type: "provide_feedback" },
    "locked"
  ),
  
  createBadge(
    "power-user",
    "Power User",
    "Show regular engagement with multiple features of the app.",
    "app-engagement",
    React.createElement(AppWindow, { className: "h-8 w-8" }),
    { type: "regular_engagement" },
    "locked"
  ),
  
  // Special Achievements Category
  createBadge(
    "introvert-wisdom",
    "Introvert Wisdom",
    "Create personal insight that resonates with your introvert journey.",
    "special",
    React.createElement(Lightbulb, { className: "h-8 w-8" }),
    { type: "create_insight" },
    "locked"
  ),
  
  createBadge(
    "balance-finder",
    "Balance Finder",
    "Maintain social engagement while honoring your introvert needs.",
    "special",
    React.createElement(Scale, { className: "h-8 w-8" }),
    { type: "maintain_balance" },
    "locked"
  ),
  
  createBadge(
    "resilience-builder",
    "Resilience Builder",
    "Recover effectively from social overload situations.",
    "special",
    React.createElement(Flame, { className: "h-8 w-8" }),
    { type: "recover_from_overload" },
    "locked"
  ),
  
  createBadge(
    "authenticity-champion",
    "Authenticity Champion",
    "Stay true to your introvert nature in challenging situations.",
    "special",
    React.createElement(Gem, { className: "h-8 w-8" }),
    { type: "maintain_authenticity" },
    "locked"
  ),
  
  createBadge(
    "full-circle",
    "Full Circle",
    "Demonstrate mastery of self-awareness, strategies, and personal growth.",
    "special",
    React.createElement(CircleIcon, { className: "h-8 w-8" }),
    { type: "achieve_mastery" },
    "locked"
  ),
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
