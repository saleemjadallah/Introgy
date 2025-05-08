
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Play, Award, MessageSquare, User, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const SimulatorDemoUI = () => {
  return (
    <Tabs defaultValue="demo" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="scenarios">
          <Settings className="h-4 w-4 mr-2" />
          Scenarios
        </TabsTrigger>
        <TabsTrigger value="demo">
          <Play className="h-4 w-4 mr-2" />
          Simulation
        </TabsTrigger>
        <TabsTrigger value="feedback">
          <Award className="h-4 w-4 mr-2" />
          Feedback
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="scenarios" className="mt-4">
        <div className="grid grid-cols-2 gap-2">
          {["Job Interview", "Networking Event", "First Date", "Small Talk"].map((scenario) => (
            <Card key={scenario} className="p-3 cursor-pointer bg-muted/50 hover:bg-accent">
              <h4 className="text-sm font-medium">{scenario}</h4>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs">Medium</Badge>
                <Badge variant="outline" className="text-xs">5-10 min</Badge>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="demo" className="mt-4">
        <Card className="p-4 bg-muted/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Badge className="bg-green-500 text-white border-green-500">
                  Networking Event
                </Badge>
              </div>
              <Badge variant="outline">Demo Mode</Badge>
            </div>
            
            {/* Demo messages */}
            <div className="space-y-3">
              {/* AI message */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">Hi there! I'm Alex. I noticed you're new to the conference. What brings you here today?</p>
                </div>
              </div>
              
              {/* User message */}
              <div className="flex gap-3 flex-row-reverse">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sky-100 text-sky-600">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-sky-100 dark:bg-sky-900 p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">Hi Alex! Yes, it's my first time here. I'm interested in learning more about advances in UX design.</p>
                </div>
              </div>
              
              {/* AI message */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">That's great! UX design is my field too. Have you attended any of the workshops yet?</p>
                </div>
              </div>
            </div>
            
            {/* Message input placeholder */}
            <div className="mt-4 relative">
              <div className="flex items-center gap-2 border rounded-md p-2 bg-muted/50">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Type a message...</span>
              </div>
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Badge variant="outline">Available in the full app</Badge>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="feedback" className="mt-4">
        <Card className="p-4 bg-muted/30">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Performance Summary</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-900">
                  <h5 className="font-medium text-green-700 dark:text-green-300 text-sm">Strengths</h5>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-2">
                    <li>• Good introduction</li>
                    <li>• Showed genuine interest</li>
                    <li>• Asked follow-up questions</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-900">
                  <h5 className="font-medium text-amber-700 dark:text-amber-300 text-sm">Areas to Improve</h5>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-2">
                    <li>• Could share more about yourself</li>
                    <li>• Try open-ended questions</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
                <p>Detailed feedback and conversation analysis...</p>
              </div>
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Badge variant="outline">Available in the full app</Badge>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SimulatorDemoUI;
