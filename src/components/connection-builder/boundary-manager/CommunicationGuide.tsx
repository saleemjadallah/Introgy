
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareLock, RefreshCw } from "lucide-react";

const CommunicationGuide = () => {
  const [scenario, setScenario] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
              placeholder="Describe the situation where you need to set a boundary..."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              className="w-full"
              disabled={!scenario || loading}
              onClick={() => {
                // TODO: Integrate with AI for personalized suggestions
                console.log("Generate AI suggestions for:", scenario);
              }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Generate Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {defaultSuggestions.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.examples.map((example, i) => (
                  <li key={i} className="text-sm bg-muted p-3 rounded-md">
                    {example}
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
