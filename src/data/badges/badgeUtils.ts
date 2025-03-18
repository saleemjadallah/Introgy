
import React from "react";
import type { BadgeCategory, BadgeState } from "@/components/badges/Badge";

export interface BadgeCriteria {
  type: string;
  requiredCount?: number;
  requiredAction?: string;
  requiredDuration?: number;
  customLogic?: string;
}

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
  criteria: BadgeCriteria;
}

// Helper function to generate badges with default values
export const createBadge = (
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
