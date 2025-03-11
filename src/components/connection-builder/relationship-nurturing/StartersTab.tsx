
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { IntelligentConversationStarter, Relationship } from '@/types/relationship-nurturing';

interface StartersTabProps {
  starters: IntelligentConversationStarter[];
  relationships: Relationship[];
  onGenerateMore: (relationshipId: string) => void;
  onCopy: (text: string) => void;
}

export const StartersTab = ({ starters, relationships, onGenerateMore, onCopy }: StartersTabProps) => {
  const getRelationshipGroups = () => {
    if (!starters || starters.length === 0) return {};
    
    const groups: Record<string, IntelligentConversationStarter[]> = {};
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
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-medium">Conversation Starters</h3>
        <div className="w-full sm:w-auto">
          {relationships && relationships.length > 0 && (
            <select 
              className="w-full sm:w-auto h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              onChange={(e) => e.target.value && onGenerateMore(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Generate for...</option>
              {relationships.map((relationship: Relationship) => (
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
            const relationshipName = relationships.find((r: Relationship) => r.id === relationshipId)?.name || 'Unknown';
            
            return (
              <div key={relationshipId} className="space-y-3">
                <h4 className="font-medium">For {relationshipName}</h4>
                {relationshipStarters.map((starter) => (
                  <Card key={starter.id}>
                    <CardHeader className="pb-2 px-3 sm:px-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <CardTitle className="text-sm sm:text-base">{starter.topic}</CardTitle>
                          <CardDescription className="text-xs">
                            Confidence: {Math.round(starter.confidenceScore * 100)}%
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="self-start">{starter.source.replace(/_/g, ' ')}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 px-3 sm:px-6">
                      <p className="text-xs sm:text-sm italic">"{starter.starter}"</p>
                      <p className="text-xs text-muted-foreground mt-1">{starter.context}</p>
                    </CardContent>
                    <CardFooter className="pt-0 px-3 sm:px-6 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onCopy(starter.starter)}
                        className="flex-1 sm:flex-none flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </Button>
                      <Button size="sm" className="flex-1 sm:flex-none">Use</Button>
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
