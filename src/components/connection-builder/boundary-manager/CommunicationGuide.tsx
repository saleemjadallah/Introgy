
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareLock, RefreshCw, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CommunicationGuide = () => {
  const [scenario, setScenario] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const defaultSuggestions = [
    {
      title: "Declining Last-Minute Plans",
      examples: [
        "Thank you for thinking of me! I need more advance notice to properly plan and manage my energy.",
        "I appreciate the invitation, but I need some quiet time to recharge today."
      ]
    },
    {
      title: "Setting Communication Expectations",
      examples: [
        "I prefer to respond to messages when I have the energy to engage fully.",
        "For non-urgent matters, text is the best way to reach me."
      ]
    }
  ];

  const generateSuggestions = async () => {
    if (!scenario.trim()) {
      toast({
        title: "Please describe a scenario",
        description: "We need some context to generate personalized suggestions",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-boundary-statements', {
        body: { scenario }
      });

      if (error) throw error;
      
      if (data && data.statements) {
        setSuggestions(data.statements);
        
        toast({
          title: "Boundary statements generated",
          description: "Custom statements created based on your scenario",
        });
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Failed to generate suggestions",
        description: "Please try again or use our pre-written examples below",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste this boundary statement wherever you need it",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareLock className="h-5 w-5" />
            AI Boundary Communication Assistant
          </CardTitle>
          <CardDescription>
            Get help crafting polite and clear boundary statements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe the situation where you need to set a boundary... (Example: 'I need to decline a last-minute invitation from a colleague')"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              className="w-full"
              disabled={!scenario || loading}
              onClick={generateSuggestions}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Generate Suggestions
            </Button>
          </div>
          
          {suggestions.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-medium">Personalized Suggestions:</h3>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="relative bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">{suggestion.statement}</p>
                  <p className="text-xs text-muted-foreground mb-1">{suggestion.explanation}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                      {suggestion.situationFit || "General"}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8"
                      onClick={() => copyToClipboard(suggestion.statement)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Common Examples</h3>
        {defaultSuggestions.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.examples.map((example, i) => (
                  <li key={i} className="text-sm bg-muted p-3 rounded-md flex justify-between items-center group">
                    <span>{example}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(example)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunicationGuide;
