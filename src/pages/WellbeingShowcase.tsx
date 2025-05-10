
import React from "react";
import WellbeingCenterShowcase from "@/components/wellbeing/WellbeingCenterShowcase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WellbeingShowcase = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wellbeing Center</h1>
        <p className="text-muted-foreground">
          AI-powered resources tailored for introverts
        </p>
      </div>

      <Card className="w-full wellbeing-container-gradient overflow-hidden shadow-lg border border-white/40 mb-8">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl font-bold">Introvert Wellbeing Center</CardTitle>
          <CardDescription>
            Your personalized sanctuary for introvert wellness
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-sm space-y-4 text-muted-foreground">
            <p>
              The Wellbeing Center combines evidence-based psychology with AI personalization to help you
              thrive as an introvert. Learn, practice mindfulness, and connect with a community that understands you.
            </p>
            <p>
              Designed by psychologists who specialize in introversion, these tools and resources are specifically
              created to address the unique challenges and strengths of introverts.
            </p>
          </div>
        </CardContent>
      </Card>

      <WellbeingCenterShowcase />
    </div>
  );
};

export default WellbeingShowcase;
