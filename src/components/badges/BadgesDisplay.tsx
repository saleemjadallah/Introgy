
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BadgeGrid from "./BadgeGrid";
import { BadgeCategory } from "./Badge";
import { getBadgesByCategory, getRecentlyEarnedBadges, getBadgesInProgress } from "@/data/badgesData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface BadgesDisplayProps {
  userId?: string;
}

const BadgesDisplay = ({ userId = "guest" }: BadgesDisplayProps) => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "recent" | "in-progress">("recent");
  const isMobile = useIsMobile();
  
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
      case "energy-management": return "Energy";
      case "social-skill": return "Social Skills";
      case "growth": return "Growth";
      case "app-engagement": return "App Usage";
      case "special": return "Special";
      case "recent": return "Recently Earned";
      case "in-progress": return "In Progress";
      default: return category;
    }
  };
  
  return (
    <Card className="border-none shadow-none sm:border sm:shadow">
      <CardHeader className="px-2 pt-2 pb-1 sm:px-6 sm:pt-6 sm:pb-2">
        <CardTitle className="text-xl">Badges & Achievements</CardTitle>
        <CardDescription className="text-sm">
          Track your personal growth journey as an introvert
        </CardDescription>
      </CardHeader>
      <CardContent className="px-1 sm:px-6">
        <Tabs 
          value={selectedCategory} 
          onValueChange={(value) => setSelectedCategory(value as BadgeCategory | "recent" | "in-progress")}
          className="space-y-4"
        >
          <ScrollArea className="w-full pb-2" type="scroll">
            <TabsList className={`inline-flex w-auto min-w-full space-x-1 p-1 ${isMobile ? 'h-10' : ''}`}>
              <TabsTrigger value="recent" className="text-xs sm:text-sm px-2 sm:px-3">Recent</TabsTrigger>
              <TabsTrigger value="in-progress" className="text-xs sm:text-sm px-2 sm:px-3">In Progress</TabsTrigger>
              <TabsTrigger value="self-awareness" className="text-xs sm:text-sm px-2 sm:px-3">Self-Awareness</TabsTrigger>
              <TabsTrigger value="energy-management" className="text-xs sm:text-sm px-2 sm:px-3">Energy</TabsTrigger>
              <TabsTrigger value="social-skill" className="text-xs sm:text-sm px-2 sm:px-3">Social Skills</TabsTrigger>
              <TabsTrigger value="growth" className="text-xs sm:text-sm px-2 sm:px-3">Growth</TabsTrigger>
              <TabsTrigger value="app-engagement" className="text-xs sm:text-sm px-2 sm:px-3">App Usage</TabsTrigger>
              <TabsTrigger value="special" className="text-xs sm:text-sm px-2 sm:px-3">Special</TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          <TabsContent value={selectedCategory} className="mt-2 focus-visible:outline-none focus-visible:ring-0">
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
