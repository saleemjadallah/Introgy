
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const ConnectionBuilderShowcase = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Connection Builder</h1>
        <p className="text-muted-foreground">
          Meaningful conversation tools for introverts
        </p>
      </div>

      <Card className="w-full connection-container-gradient overflow-hidden shadow-lg border border-white/40 mb-8">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-500" />
            Connection Builder
          </CardTitle>
          <CardDescription>
            Tools to help introverts build meaningful relationships
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-sm space-y-4 text-muted-foreground">
            <p>
              The Connection Builder provides introverts with thoughtful conversation prompts,
              deep questions, and active listening techniques to build genuine connections.
            </p>
            <p>
              Based on your preferences and relationship goals, Introgy will suggest
              personalized conversation starters and help you nurture relationships in an authentic way.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionBuilderShowcase;
