import React from "react";
import { Brain, Coffee, Utensils, Moon, BookOpen, Droplet, TreePine, Paintbrush, Tv, Cat, Flower2, Headphones, ChefHat, Power, Stars, FolderClosed, Wind, Pilcrow, Library } from "lucide-react";

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
    icon: <BookOpen className="h-5 w-5" />,
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
  },
  {
    name: "Journal Writing",
    icon: <Moon className="h-5 w-5" />,
    description: "Expressive writing for mental clarity",
    time: "25 minutes"
  },
  {
    name: "Hot Bath/Shower",
    icon: <Droplet className="h-5 w-5" />,
    description: "Warmth and isolation for recharging",
    time: "20 minutes"
  },
  {
    name: "Nature Observation",
    icon: <TreePine className="h-5 w-5" />,
    description: "Bird watching or sitting by water",
    time: "30 minutes"
  },
  {
    name: "Creative Hobby",
    icon: <Paintbrush className="h-5 w-5" />,
    description: "Knitting, painting or any creative focus",
    time: "45 minutes"
  },
  {
    name: "Solo TV Time",
    icon: <Tv className="h-5 w-5" />,
    description: "Watch a favorite show alone",
    time: "40 minutes"
  },
  {
    name: "Pet Time",
    icon: <Cat className="h-5 w-5" />,
    description: "Play with a pet for companionship",
    time: "15 minutes"
  },
  {
    name: "Gardening",
    icon: <Flower2 className="h-5 w-5" />,
    description: "Connect with nature through plant care",
    time: "30 minutes"
  },
  {
    name: "Audio Content",
    icon: <Headphones className="h-5 w-5" />,
    description: "Podcast or audiobook listening",
    time: "30 minutes"
  },
  {
    name: "Cooking/Baking",
    icon: <ChefHat className="h-5 w-5" />,
    description: "Creative, sensory food preparation",
    time: "40 minutes"
  },
  {
    name: "Tech-Free Time",
    icon: <Power className="h-5 w-5" />,
    description: "Disconnect from digital stimulation",
    time: "25 minutes"
  },
  {
    name: "Star Gazing",
    icon: <Stars className="h-5 w-5" />,
    description: "Peaceful nighttime observation",
    time: "20 minutes"
  },
  {
    name: "Space Organization",
    icon: <FolderClosed className="h-5 w-5" />,
    description: "Create order to reduce mental load",
    time: "15 minutes"
  },
  {
    name: "Deep Breathing",
    icon: <Wind className="h-5 w-5" />,
    description: "Quick reset for mental overwhelm",
    time: "5 minutes"
  },
  {
    name: "Gentle Stretching",
    icon: <Pilcrow className="h-5 w-5" />,
    description: "Physical release of tension",
    time: "15 minutes"
  },
  {
    name: "Bookstore Browse",
    icon: <Library className="h-5 w-5" />,
    description: "Quiet exploration in low-pressure setting",
    time: "45 minutes"
  }
];
