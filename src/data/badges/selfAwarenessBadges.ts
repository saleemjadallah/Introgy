
import React from "react";
import { Eye, Calendar, Sparkles, BookOpen, Map } from "lucide-react";
import { createBadge } from "./badgeUtils";
import type { BadgeData } from "./badgeUtils";

export const selfAwarenessBadges: BadgeData[] = [
  createBadge(
    "inner-observer",
    "Inner Observer",
    "Complete your introvert profile assessment to gain deeper self-understanding.",
    "self-awareness",
    React.createElement(Eye, { className: "h-8 w-8 text-periwinkle fill-periwinkle/10" }),
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
    React.createElement(Calendar, { className: "h-8 w-8 text-sage fill-sage/10" }),
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
    React.createElement(Sparkles, { className: "h-8 w-8 text-amber fill-amber/10" }),
    { type: "identify_triggers", requiredCount: 3 },
    "locked"
  ),
  
  createBadge(
    "self-knowledge-seeker",
    "Self-Knowledge Seeker",
    "Read 10 articles in the Education Center to expand your understanding.",
    "self-awareness",
    React.createElement(BookOpen, { className: "h-8 w-8 text-teal fill-teal/10" }),
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
    React.createElement(Map, { className: "h-8 w-8 text-mauve fill-mauve/10" }),
    { type: "energy_map_complete" },
    "locked"
  ),
];
