
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import ConversationSimulator from "./ConversationSimulator";

const ComingSoonFeatures = () => {
  return (
    <div className="space-y-6">
      {/* Updated to include the ConversationSimulator component */}
      <ConversationSimulator />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Social Strategies
          </CardTitle>
          <CardDescription>Useful strategies for different social scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon in the next update!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonFeatures;
