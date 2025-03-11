
import React from "react";
import { Lightbulb, Scale, Flame, Gem, Circle } from "lucide-react";
import { createBadge } from "./badgeUtils";
import type { BadgeData } from "./badgeUtils";

export const specialBadges: BadgeData[] = [
  createBadge(
    "introvert-wisdom",
    "Introvert Wisdom",
    "Create personal insight that resonates with your introvert journey.",
    "special",
    React.createElement(Lightbulb, { className: "h-8 w-8 text-periwinkle fill-periwinkle/10" }),
    { type: "create_insight" },
    "locked"
  ),
  
  createBadge(
    "balance-finder",
    "Balance Finder",
    "Maintain social engagement while honoring your introvert needs.",
    "special",
    React.createElement(Scale, { className: "h-8 w-8 text-teal fill-teal/10" }),
    { type: "maintain_balance" },
    "locked"
  ),
  
  createBadge(
    "resilience-builder",
    "Resilience Builder",
    "Recover effectively from social overload situations.",
    "special",
    React.createElement(Flame, { className: "h-8 w-8 text-sage fill-sage/10" }),
    { type: "recover_from_overload" },
    "locked"
  ),
  
  createBadge(
    "authenticity-champion",
    "Authenticity Champion",
    "Stay true to your introvert nature in challenging situations.",
    "special",
    React.createElement(Gem, { className: "h-8 w-8 text-mauve fill-mauve/10" }),
    { type: "maintain_authenticity" },
    "locked"
  ),
  
  createBadge(
    "full-circle",
    "Full Circle",
    "Demonstrate mastery of self-awareness, strategies, and personal growth.",
    "special",
    React.createElement(Circle, { className: "h-8 w-8 text-blueteal fill-blueteal/10" }),
    { type: "achieve_mastery" },
    "locked"
  ),
];
