
import { BadgeCategory, BadgeState } from "@/components/badges/Badge";
import { ReactNode } from "react";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: ReactNode;
  criteria: {
    type: string;
    requiredCount?: number;
    requiredAction?: string;
    requiredDuration?: number;
    customLogic?: string;
  };
}

export interface UserBadge {
  badgeId: string;
  userId: string;
  state: BadgeState;
  progress?: number;
  maxProgress?: number;
  earnedDate?: Date;
  lastUpdated: Date;
}
