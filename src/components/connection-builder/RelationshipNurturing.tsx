
import { useState } from 'react';
import { useRelationshipNurturing } from '@/hooks/useRelationshipNurturing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Heart } from "lucide-react";
import { InsightsTab } from './relationship-nurturing/InsightsTab';
import { SuggestionsTab } from './relationship-nurturing/SuggestionsTab';
import { StartersTab } from './relationship-nurturing/StartersTab';
import { HealthTab } from './relationship-nurturing/HealthTab';

// Main component for the Relationship Nurturing feature
export const RelationshipNurturing = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const {
    insights,
    relationshipHealth,
    connectionSuggestions,
    conversationStarters,
    relationships = [], // Provide default empty array
    isLoading,
    markInsightAsRead,
    markAllInsightsAsRead,
    applySuggestion,
    skipSuggestion,
    generateMoreConversationStarters,
    copyConversationStarter,
    takeActionOnInsight
  } = useRelationshipNurturing();
  
  // Get new insights count for badge
  const newInsightsCount = insights.filter(insight => insight.isNew).length;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="space-y-2 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading relationship data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Intelligent Nurturing Assistant</h2>
        <p className="text-muted-foreground">
          Smart relationship management to maintain meaningful connections while respecting your energy levels
        </p>
      </div>
      
      <Tabs defaultValue="insights" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4 overflow-x-auto">
          <TabsTrigger value="insights" className="relative px-1 sm:px-3">
            <span className="hidden sm:inline">Insights</span>
            <span className="sm:hidden">
              <MessageCircle className="h-4 w-4" />
            </span>
            {newInsightsCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {newInsightsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="px-1 sm:px-3">
            <span className="hidden sm:inline">Connection Planner</span>
            <span className="sm:hidden">
              <Calendar className="h-4 w-4" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="starters" className="px-1 sm:px-3">
            <span className="hidden sm:inline">Conversation Starters</span>
            <span className="sm:hidden">
              <MessageCircle className="h-4 w-4" strokeWidth={1} />
            </span>
          </TabsTrigger>
          <TabsTrigger value="health" className="px-1 sm:px-3">
            <span className="hidden sm:inline">Relationship Health</span>
            <span className="sm:hidden">
              <Heart className="h-4 w-4" />
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <InsightsTab 
            insights={insights} 
            onMarkAllRead={markAllInsightsAsRead}
            onTakeAction={takeActionOnInsight}
            onDismiss={markInsightAsRead}
          />
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-4">
          <SuggestionsTab 
            suggestions={connectionSuggestions} 
            onSchedule={applySuggestion}
            onSkip={skipSuggestion}
          />
        </TabsContent>
        
        <TabsContent value="starters" className="space-y-4">
          <StartersTab 
            starters={conversationStarters} 
            relationships={relationships} 
            onGenerateMore={generateMoreConversationStarters}
            onCopy={copyConversationStarter}
          />
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          <HealthTab healthData={relationshipHealth} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelationshipNurturing;
