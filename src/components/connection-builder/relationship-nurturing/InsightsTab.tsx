
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, BatteryFull, MessageCircle, Heart, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { RelationshipInsight } from '@/types/relationship-nurturing';

interface InsightsTabProps {
  insights: RelationshipInsight[];
  onMarkAllRead: () => void;
  onTakeAction: (insightId: string) => void;
  onDismiss: (insightId: string) => void;
}

export const InsightsTab = ({ insights, onMarkAllRead, onTakeAction, onDismiss }: InsightsTabProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'connection_gap': return <Clock className="h-5 w-5" />;
      case 'interaction_pattern': return <TrendingUp className="h-5 w-5" />;
      case 'energy_impact': return <BatteryFull className="h-5 w-5" />;
      case 'conversation_suggestion': return <MessageCircle className="h-5 w-5" />;
      case 'relationship_health': return <Heart className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-medium">AI-Generated Insights</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onMarkAllRead}
          className="w-full sm:w-auto"
        >
          Mark All as Read
        </Button>
      </div>
      
      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No insights available at this time.</p>
          </div>
        ) : (
          insights.map((insight) => (
            <Card key={insight.id} className={insight.isNew ? "border-blue-300" : ""}>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 sm:p-2 rounded-full ${getSeverityColor(insight.severity)}`}>
                      {getTypeIcon(insight.type)}
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{insight.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {insight.relationshipName} • {format(new Date(insight.dateGenerated), 'MMM d')}
                      </CardDescription>
                    </div>
                  </div>
                  {insight.isNew && <Badge className="ml-auto">New</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pb-2 px-3 sm:px-6">
                <p className="text-xs sm:text-sm">{insight.description}</p>
                <p className="text-xs sm:text-sm font-medium mt-2">Recommendation:</p>
                <p className="text-xs sm:text-sm">{insight.recommendation}</p>
              </CardContent>
              <CardFooter className="pt-0 px-3 sm:px-6 flex flex-wrap justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDismiss(insight.id)}
                  className="w-full sm:w-auto"
                >
                  Dismiss
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onTakeAction(insight.id)}
                  className="w-full sm:w-auto"
                >
                  Take Action
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
