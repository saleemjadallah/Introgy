
import React from "react";
import { Home, AppWindow, CalendarDays, MessageSquareQuote } from "lucide-react";
import { createBadge } from "./badgeUtils";
import type { BadgeData } from "./badgeUtils";

export const appEngagementBadges: BadgeData[] = [
  createBadge(
    "innercircle-initiate",
    "InnerCircle Initiate",
    "Complete the app onboarding process to start your journey.",
    "app-engagement",
    React.createElement(Home, { className: "h-8 w-8 text-teal fill-teal/10" }),
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
    React.createElement(AppWindow, { className: "h-8 w-8 text-sage fill-sage/10" }),
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
    React.createElement(CalendarDays, { className: "h-8 w-8 text-mauve fill-mauve/10" }),
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
    React.createElement(MessageSquareQuote, { className: "h-8 w-8 text-blueteal fill-blueteal/10" }),
    { type: "provide_feedback" },
    "locked"
  ),
  
  createBadge(
    "power-user",
    "Power User",
    "Show regular engagement with multiple features of the app.",
    "app-engagement",
    React.createElement(AppWindow, { className: "h-8 w-8 text-amber fill-amber/10" }),
    { type: "regular_engagement" },
    "locked"
  ),
];
