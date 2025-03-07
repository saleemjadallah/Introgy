
import React from "react";
import { Brain, Coffee, Utensils, Moon } from "lucide-react";

export interface RechargeActivityData {
  name: string;
  icon: React.ReactNode;
  description: string;
  time: string;
}

export const getRechargeActivities = (): RechargeActivityData[] => [
  {
    name: "Meditation",
    icon: <Brain className="h-5 w-5" />,
    description: "Guided meditation to center your thoughts",
    time: "10-15 minutes"
  },
  {
    name: "Reading",
    icon: <Moon className="h-5 w-5" />,
    description: "Read something enjoyable to relax",
    time: "20+ minutes"
  },
  {
    name: "Caffeine Break",
    icon: <Coffee className="h-5 w-5" />,
    description: "Have tea or coffee in a quiet space",
    time: "15 minutes"
  },
  {
    name: "Light Meal",
    icon: <Utensils className="h-5 w-5" />,
    description: "Eat something light but energizing",
    time: "20 minutes"
  }
];
