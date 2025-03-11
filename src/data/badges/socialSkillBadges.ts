
import React from "react";
import { MessageSquare, DoorOpen, LifeBuoy, Trees, Shield } from "lucide-react";
import { createBadge } from "./badgeUtils";
import type { BadgeData } from "./badgeUtils";

export const socialSkillBadges: BadgeData[] = [
  createBadge(
    "conversation-apprentice",
    "Conversation Apprentice",
    "Complete 5 conversation simulations to build your social skills.",
    "social-skill",
    React.createElement(MessageSquare, { className: "h-8 w-8 text-mauve fill-mauve/10" }),
    { type: "conversation_sim", requiredCount: 5 },
    "locked"
  ),
  
  createBadge(
    "exit-strategist",
    "Exit Strategist",
    "Save 5 exit strategies to your personal collection for social situations.",
    "social-skill",
    React.createElement(DoorOpen, { className: "h-8 w-8 text-blueteal fill-blueteal/10" }),
    { type: "save_exit_strategies", requiredCount: 5 },
    "locked"
  ),
  
  createBadge(
    "small-talk-survivor",
    "Small Talk Survivor",
    "Complete 3 Small Talk practice sessions to navigate casual conversation.",
    "social-skill",
    React.createElement(LifeBuoy, { className: "h-8 w-8 text-amber fill-amber/10" }),
    { type: "small_talk_practice", requiredCount: 3 },
    "locked"
  ),
  
  createBadge(
    "deep-connection-cultivator",
    "Deep Connection Cultivator",
    "Apply deep conversation techniques in real life interactions.",
    "social-skill",
    React.createElement(Trees, { className: "h-8 w-8 text-periwinkle fill-periwinkle/10" }),
    { type: "use_deep_techniques" },
    "locked"
  ),
  
  createBadge(
    "boundary-setter",
    "Boundary Setter",
    "Successfully implement personal boundaries in social situations.",
    "social-skill",
    React.createElement(Shield, { className: "h-8 w-8 text-teal fill-teal/10" }),
    { type: "set_boundaries" },
    "locked"
  ),
];
