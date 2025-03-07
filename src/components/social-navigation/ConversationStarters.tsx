
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ConversationStarter } from "@/types/events";
import { MessageSquare, Sparkles, Star, PlusCircle, AlertTriangle } from "lucide-react";

interface ConversationStartersProps {
  eventId: string;
  starters: ConversationStarter[];
  onGenerate: () => Promise<void>;
}

const ConversationStarters = ({ eventId, starters, onGenerate }: ConversationStartersProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      await onGenerate();
    } catch (err) {
      setError(err.message || "Failed to generate conversation starters");
    } finally {
      setLoading(false);
    }
  };
  
  const filterByCategory = (category: string) => {
    if (category === "all") return starters;
    return starters.filter(starter => starter.category === category);
  };
  
  const categories = [
    { id: "all", label: "All" },
    { id: "casual", label: "Casual" },
    { id: "professional", label: "Professional" },
    { id: "topical", label: "Topical" },
    { id: "personal", label: "Personal" }
  ];
  
  const filteredStarters = filterByCategory(activeCategory);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation Starters
          </CardTitle>
          <CardDescription>
            AI-generated topics to help you navigate conversations using Hugging Face AI
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md mb-4 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error generating starters</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="flex-1">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {filteredStarters.length > 0 ? (
            <div className="space-y-4">
              {filteredStarters.map((starter, index) => (
                <Card key={index} className="border border-muted">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Badge variant="outline" className="capitalize">
                          {starter.category}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <h4 className="font-medium text-base">{starter.starter}</h4>
                    <p className="text-sm text-muted-foreground mt-2">{starter.explanation}</p>
                    <div className="mt-3 pt-3 border-t border-dashed">
                      <h5 className="text-sm font-medium flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Follow-up:
                      </h5>
                      <p className="text-sm">{starter.followUp}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No conversation starters yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate AI-powered conversation starters tailored to this event
              </p>
              <Button onClick={handleGenerate} disabled={loading}>
                <PlusCircle className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Generate Conversation Starters"}
              </Button>
            </div>
          )}
        </CardContent>
        
        {filteredStarters.length > 0 && (
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              variant="outline" 
              className="w-full"
              disabled={loading}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Generate More Topics"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ConversationStarters;
