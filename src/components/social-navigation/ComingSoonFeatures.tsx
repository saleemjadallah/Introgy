
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BookOpen } from "lucide-react";

const ComingSoonFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation Simulator
          </CardTitle>
          <CardDescription>Practice conversations in a safe environment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon in the next update!</p>
        </CardContent>
      </Card>

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
