
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery } from "lucide-react";

const SocialBatteryShowcase = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Social Battery</h1>
        <p className="text-muted-foreground">
          Track and manage your social energy
        </p>
      </div>

      <Card className="w-full battery-container-gradient overflow-hidden shadow-lg border border-white/40 mb-8">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Battery className="h-5 w-5 text-green-500" />
            Social Battery Tracker
          </CardTitle>
          <CardDescription>
            Monitor your social energy levels and get personalized recharge recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-sm space-y-4 text-muted-foreground">
            <p>
              The Social Battery feature helps introverts track their energy levels throughout the day,
              providing insights on when to take breaks and how to recharge effectively.
            </p>
            <p>
              Based on your unique patterns, Introgy will suggest optimal recharge activities
              and help you plan your social calendar to avoid burnout.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialBatteryShowcase;
