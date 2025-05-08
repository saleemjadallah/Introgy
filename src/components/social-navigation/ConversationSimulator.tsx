
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimulatorDemoUI from "./conversation-simulator/SimulatorDemoUI";

const ConversationSimulator = () => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  
  return (
    <Card className="navigation-container-gradient relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-periwinkle" />
          Conversation Simulator
        </CardTitle>
        <CardDescription>
          Practice social interactions in a safe, AI-powered environment
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
              
              <Button 
                variant="link" 
                className="px-0 h-auto py-1 text-sky-600 dark:text-sky-400"
                onClick={() => setShowMoreInfo(!showMoreInfo)}
              >
                {showMoreInfo ? "Show less" : "Learn more about this feature →"}
              </Button>
              
              {showMoreInfo && (
                <div className="pt-2 pb-1 text-sm text-muted-foreground space-y-2">
                  <p>
                    The Conversation Simulator helps you practice challenging social interactions before 
                    facing them in real life. Key features include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Multiple scenario types (networking events, casual meetups, work functions)</li>
                    <li>AI responses that adapt to your conversation style</li>
                    <li>Real-time feedback on your communication approach</li>
                    <li>Suggestions for alternative responses</li>
                    <li>Progress tracking to see your improvement over time</li>
                    <li>Customizable difficulty levels to gradually build confidence</li>
                  </ul>
                  <p>
                    Many users report feeling significantly more prepared for social situations
                    after practicing with the simulator.
                  </p>
                </div>
              )}
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
            Download Full App to Practice Conversations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationSimulator;
