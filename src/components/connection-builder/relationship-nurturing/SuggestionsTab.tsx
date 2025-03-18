
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { BatteryFull, Calendar } from "lucide-react";
import { format, isToday, isTomorrow } from 'date-fns';
import { ConnectionSuggestion } from '@/types/relationship-nurturing';

interface SuggestionsTabProps {
  suggestions: ConnectionSuggestion[];
  onSchedule: (suggestionId: string) => void;
  onSkip: (suggestionId: string) => void;
}

export const SuggestionsTab = ({ suggestions, onSchedule, onSkip }: SuggestionsTabProps) => {
  const formatSuggestedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-medium">Suggested Connections</h3>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">Add Custom</Button>
      </div>
      
      <div className="space-y-3">
        {!suggestions || suggestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No connection suggestions available at this time.</p>
          </div>
        ) : (
          suggestions.sort((a, b) => a.priority - b.priority).map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <div className="bg-slate-200 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center">
                        {suggestion.relationshipName.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{suggestion.relationshipName}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatSuggestedDate(suggestion.suggestedDate)} at {suggestion.suggestedTime}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={suggestion.priority <= 2 ? "outline" : "default"} className="self-start sm:self-center">
                    Priority {suggestion.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2 px-3 sm:px-6">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-2">
                  <Badge variant="secondary">
                    {suggestion.interactionType.charAt(0).toUpperCase() + suggestion.interactionType.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BatteryFull className="h-3 w-3" />
                    Energy: {suggestion.energyLevelRequired}/10
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{suggestion.reasonForSuggestion}</p>
              </CardContent>
              <CardFooter className="pt-0 px-3 sm:px-6 flex flex-wrap justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSkip(suggestion.id)}
                  className="flex-1 sm:flex-none"
                >
                  Skip
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Reschedule</Button>
                <Button 
                  size="sm"
                  onClick={() => onSchedule(suggestion.id)}
                  className="flex-1 sm:flex-none"
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
