import { useState } from 'react';
import { useRelationshipNurturing } from '@/hooks/useRelationshipNurturing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { BatteryFull, Calendar, MessageCircle, Clock, TrendingUp, AlertCircle, Heart, Copy, ChevronRight } from "lucide-react";
import { format, isToday, isTomorrow, addDays } from 'date-fns';

// Main component for the Relationship Nurturing feature
export const RelationshipNurturing = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const {
    insights,
    relationshipHealth,
    connectionSuggestions,
    conversationStarters,
    relationships,
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
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="insights" className="relative">
            Insights
            {newInsightsCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {newInsightsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions">Connection Planner</TabsTrigger>
          <TabsTrigger value="starters">Conversation Starters</TabsTrigger>
          <TabsTrigger value="health">Relationship Health</TabsTrigger>
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

// Component for displaying relationship insights
const InsightsTab = ({ insights, onMarkAllRead, onTakeAction, onDismiss }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100';
    }
  };

  const getTypeIcon = (type) => {
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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium">AI-Generated Relationship Insights</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onMarkAllRead}
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
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${getSeverityColor(insight.severity)}`}>
                      {getTypeIcon(insight.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {insight.relationshipName} • {format(new Date(insight.dateGenerated), 'MMM d')}
                      </CardDescription>
                    </div>
                  </div>
                  {insight.isNew && <Badge>New</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{insight.description}</p>
                <p className="text-sm font-medium mt-2">Recommendation:</p>
                <p className="text-sm">{insight.recommendation}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDismiss(insight.id)}
                >
                  Dismiss
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onTakeAction(insight.id)}
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

// Component for displaying connection suggestions
const SuggestionsTab = ({ suggestions, onSchedule, onSkip }) => {
  const formatSuggestedDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium">Suggested Connections</h3>
        <Button variant="outline" size="sm">Add Custom Connection</Button>
      </div>
      
      <div className="space-y-3">
        {!suggestions || suggestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No connection suggestions available at this time.</p>
          </div>
        ) : (
          suggestions.sort((a, b) => a.priority - b.priority).map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center">
                        {suggestion.relationshipName.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{suggestion.relationshipName}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatSuggestedDate(suggestion.suggestedDate)} at {suggestion.suggestedTime}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={suggestion.priority <= 2 ? "outline" : "default"}>
                    Priority {suggestion.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Badge variant="secondary">
                    {suggestion.interactionType.charAt(0).toUpperCase() + suggestion.interactionType.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BatteryFull className="h-3 w-3" />
                    Energy: {suggestion.energyLevelRequired}/10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.reasonForSuggestion}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSkip(suggestion.id)}
                >
                  Skip
                </Button>
                <Button variant="outline" size="sm">Reschedule</Button>
                <Button 
                  size="sm"
                  onClick={() => onSchedule(suggestion.id)}
                >
                  Schedule
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Component for displaying conversation starters
const StartersTab = ({ starters, relationships, onGenerateMore, onCopy }) => {
  // Group starters by relationship
  const getRelationshipGroups = () => {
    if (!starters || starters.length === 0) return {};
    
    const groups = {};
    starters.forEach(starter => {
      const relationshipId = starter.relationshipId;
      if (!groups[relationshipId]) {
        groups[relationshipId] = [];
      }
      groups[relationshipId].push(starter);
    });
    return groups;
  };
  
  const relationshipGroups = getRelationshipGroups();
  
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium">AI-Generated Conversation Starters</h3>
        <div className="space-x-2">
          {relationships && relationships.length > 0 && (
            <select 
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              onChange={(e) => e.target.value && onGenerateMore(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Generate for...</option>
              {relationships.map(relationship => (
                <option key={relationship.id} value={relationship.id}>
                  {relationship.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.keys(relationshipGroups).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No conversation starters available at this time.</p>
          </div>
        ) : (
          Object.entries(relationshipGroups).map(([relationshipId, relationshipStarters]) => {
            const relationshipName = relationships.find(r => r.id === relationshipId)?.name || 'Unknown';
            
            return (
              <div key={relationshipId} className="space-y-3">
                <h4 className="font-medium">For {relationshipName}</h4>
                {relationshipStarters.map((starter) => (
                  <Card key={starter.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{starter.topic}</CardTitle>
                          <CardDescription className="text-xs">
                            Confidence: {Math.round(starter.confidenceScore * 100)}%
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{starter.source.replace(/_/g, ' ')}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm italic">"{starter.starter}"</p>
                      <p className="text-xs text-muted-foreground mt-1">{starter.context}</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onCopy(starter.starter)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </Button>
                      <Button size="sm">Use</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Component for displaying relationship health
const HealthTab = ({ healthData }) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-medium">Relationship Health Assessment</h3>
        <p className="text-sm text-muted-foreground">AI analysis of your relationship health based on interaction patterns</p>
      </div>
      
      <div className="space-y-4">
        {!healthData || healthData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No relationship health data available at this time.</p>
          </div>
        ) : (
          healthData.map((health) => (
            <Card key={health.relationshipId}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold ${getScoreColor(health.overallScore)}`}>
                      {health.overallScore}
                    </div>
                    <div>
                      <CardTitle className="text-base">{health.relationshipName}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <span className={`flex items-center ${getTrendColor(health.trend)}`}>
                          {health.trend === 'improving' && '↗ Improving'}
                          {health.trend === 'declining' && '↘ Declining'}
                          {health.trend === 'stable' && '→ Stable'}
                        </span>
                        <span>• Last updated: {format(new Date(health.lastAssessment), 'MMM d')}</span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-slate-50 rounded-md">
                    <div className="text-xs text-muted-foreground">Frequency</div>
                    <div className={`font-medium ${getScoreColor(health.frequency)}`}>{health.frequency}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-md">
                    <div className="text-xs text-muted-foreground">Quality</div>
                    <div className={`font-medium ${getScoreColor(health.quality)}`}>{health.quality}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-md">
                    <div className="text-xs text-muted-foreground">Reciprocity</div>
                    <div className={`font-medium ${getScoreColor(health.reciprocity)}`}>{health.reciprocity}</div>
                  </div>
                </div>
                
                {health.suggestions && health.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Suggestions for improvement:</p>
                    <ul className="text-xs text-muted-foreground">
                      {health.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-1 mb-1">
                          <span>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  View Details <ChevronRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RelationshipNurturing;
