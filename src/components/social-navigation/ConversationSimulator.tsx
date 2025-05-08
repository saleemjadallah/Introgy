
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimulatorDemoUI from "./conversation-simulator/SimulatorDemoUI";

const ConversationSimulator = () => {
  return (
    <Card className="navigation-container-gradient relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-periwinkle" />
          Conversation Simulator
        </CardTitle>
        <CardDescription>
          Practice social interactions in different scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Information panel */}
        <div className="bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-500 p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-sky-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">App Feature Preview</h4>
              <p className="text-sm text-muted-foreground">
                In the Introgy app, you can practice conversations for different social scenarios. 
                Our AI-powered simulator gives you real-time feedback and helps you build confidence.
              </p>
            </div>
          </div>
        </div>
        
        {/* Demo UI */}
        <SimulatorDemoUI />
        
        <div className="text-center pt-3">
          <Button 
            onClick={() => window.location.href = "#download-app"} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Full App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationSimulator;
