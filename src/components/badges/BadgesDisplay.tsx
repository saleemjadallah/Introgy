
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BadgeGrid from "./BadgeGrid";
import { BadgeCategory } from "./Badge";
import { getBadgesByCategory, getRecentlyEarnedBadges, getBadgesInProgress } from "@/data/badgesData";

interface BadgesDisplayProps {
  userId?: string;
}

const BadgesDisplay = ({ userId = "guest" }: BadgesDisplayProps) => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "recent" | "in-progress">("recent");
  
  // Helper to get the correct badges based on selected category
  const getBadges = () => {
    if (selectedCategory === "recent") {
      return getRecentlyEarnedBadges();
    } else if (selectedCategory === "in-progress") {
      return getBadgesInProgress();
    } else {
      return getBadgesByCategory(selectedCategory);
    }
  };
  
  // Map category to display name
  const getCategoryName = (category: BadgeCategory | "recent" | "in-progress"): string => {
    switch (category) {
      case "self-awareness": return "Self-Awareness";
      case "energy-management": return "Energy Management";
      case "social-skill": return "Social Skills";
      case "growth": return "Growth & Comfort Zone";
      case "app-engagement": return "App Engagement";
      case "special": return "Special Achievements";
      case "recent": return "Recently Earned";
      case "in-progress": return "In Progress";
      default: return category;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges & Achievements</CardTitle>
        <CardDescription>
          Track your personal growth journey as an introvert with these meaningful milestones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={selectedCategory} 
          onValueChange={(value) => setSelectedCategory(value as BadgeCategory | "recent" | "in-progress")}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="self-awareness">Self-Awareness</TabsTrigger>
            <TabsTrigger value="energy-management">Energy</TabsTrigger>
            <TabsTrigger value="social-skill">Social Skills</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="app-engagement">App Usage</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory} className="mt-4">
            <BadgeGrid 
              badges={getBadges()} 
              title={getCategoryName(selectedCategory)}
              emptyMessage={
                selectedCategory === "recent" 
                  ? "You haven't earned any badges recently. Keep using the app to earn achievements!" 
                  : selectedCategory === "in-progress"
                  ? "You don't have any badges in progress. Explore the app to start earning achievements!"
                  : `No badges found in the ${getCategoryName(selectedCategory)} category.`
              }
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BadgesDisplay;
