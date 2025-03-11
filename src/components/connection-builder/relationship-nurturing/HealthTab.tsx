
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { format } from 'date-fns';
import { RelationshipHealth } from '@/types/relationship-nurturing';

interface HealthTabProps {
  healthData: RelationshipHealth[];
}

export const HealthTab = ({ healthData }: HealthTabProps) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-medium">Relationship Health</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">AI analysis of relationship health based on interaction patterns</p>
      </div>
      
      <div className="space-y-4">
        {!healthData || healthData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No relationship health data available at this time.</p>
          </div>
        ) : (
          healthData.map((health) => (
            <Card key={health.relationshipId}>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(health.overallScore)}`}>
                      {health.overallScore}
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{health.relationshipName}</CardTitle>
                      <CardDescription className="text-xs flex flex-wrap items-center gap-1">
                        <span className={`flex items-center ${getTrendColor(health.trend)}`}>
                          {health.trend === 'improving' && '↗ Improving'}
                          {health.trend === 'declining' && '↘ Declining'}
                          {health.trend === 'stable' && '→ Stable'}
                        </span>
                        <span>• Updated: {format(new Date(health.lastAssessment), 'MMM d')}</span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 px-3 sm:px-6">
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3">
                  <div className="text-center p-1 sm:p-2 bg-slate-50 rounded-md">
                    <div className="text-xs text-muted-foreground">Frequency</div>
                    <div className={`text-xs sm:text-sm font-medium ${getScoreColor(health.frequency)}`}>{health.frequency}</div>
                  </div>
                  <div className="text-center p-1 sm:p-2 bg-slate-50 rounded-md">
                    <div className="text-xs text-muted-foreground">Quality</div>
                    <div className={`text-xs sm:text-sm font-medium ${getScoreColor(health.quality)}`}>{health.quality}</div>
                  </div>
                  <div className="text-center p-1 sm:p-2 bg-slate-50 rounded-md">
                    <div className="text-xs text-muted-foreground">Reciprocity</div>
                    <div className={`text-xs sm:text-sm font-medium ${getScoreColor(health.reciprocity)}`}>{health.reciprocity}</div>
                  </div>
                </div>
                
                {health.suggestions && health.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Suggestions for improvement:</p>
                    <ul className="text-xs text-muted-foreground">
                      {health.suggestions.slice(0, 2).map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-1 mb-1">
                          <span>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                      {health.suggestions.length > 2 && (
                        <li className="text-xs text-muted-foreground italic">+{health.suggestions.length - 2} more suggestions</li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 px-3 sm:px-6 flex justify-end">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto flex items-center justify-center gap-1">
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
