
import React from "react";
import { Battery, BatteryCharging, ClipboardCheck, Scale, Wrench } from "lucide-react";
import { createBadge } from "./badgeUtils";
import type { BadgeData } from "./badgeUtils";

export const energyManagementBadges: BadgeData[] = [
  createBadge(
    "battery-guardian",
    "Battery Guardian",
    "Maintain your social energy above 30% for a full week.",
    "energy-management",
    React.createElement(Battery, { className: "h-8 w-8 text-blueteal fill-blueteal/10" }),
    { type: "maintain_energy", requiredDuration: 7 },
    "locked"
  ),
  
  createBadge(
    "recharge-rookie",
    "Recharge Rookie",
    "Use recharge activities 10 times to restore your social energy.",
    "energy-management",
    React.createElement(BatteryCharging, { className: "h-8 w-8 text-amber fill-amber/10" }),
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
    React.createElement(ClipboardCheck, { className: "h-8 w-8 text-periwinkle fill-periwinkle/10" }),
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
    React.createElement(Scale, { className: "h-8 w-8 text-teal fill-teal/10" }),
    { type: "energy_balance", requiredDuration: 14 },
    "locked"
  ),
  
  createBadge(
    "recovery-specialist",
    "Recovery Specialist",
    "Utilize 10 different recharge activities to restore your energy.",
    "energy-management",
    React.createElement(Wrench, { className: "h-8 w-8 text-sage fill-sage/10" }),
    { type: "diverse_recharge", requiredCount: 10 },
    "locked"
  ),
];
