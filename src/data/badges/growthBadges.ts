
import React from "react";
import { Footprints, Circle, Compass, Leaf, Flag } from "lucide-react";
import { createBadge } from "./badgeUtils";
import type { BadgeData } from "./badgeUtils";

export const growthBadges: BadgeData[] = [
  createBadge(
    "first-step",
    "First Step",
    "Try one strategy outside your comfort zone to expand your capabilities.",
    "growth",
    React.createElement(Footprints, { className: "h-8 w-8 text-sage fill-sage/10" }),
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
    React.createElement(Circle, { className: "h-8 w-8 text-mauve fill-mauve/10" }),
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
    React.createElement(Compass, { className: "h-8 w-8 text-blueteal fill-blueteal/10" }),
    { type: "use_strategies" },
    "locked"
  ),
  
  createBadge(
    "growth-mindset",
    "Growth Mindset",
    "Track your progress in social development for a full month.",
    "growth",
    React.createElement(Leaf, { className: "h-8 w-8 text-amber fill-amber/10" }),
    { type: "track_progress", requiredDuration: 30 },
    "locked"
  ),
  
  createBadge(
    "personal-milestone",
    "Personal Milestone",
    "Create and achieve a custom personal goal for your social journey.",
    "growth",
    React.createElement(Flag, { className: "h-8 w-8 text-periwinkle fill-periwinkle/10" }),
    { type: "custom_goal" },
    "locked"
  ),
];
