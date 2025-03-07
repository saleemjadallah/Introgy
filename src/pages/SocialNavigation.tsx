
import { Users, Calendar, MessageSquare, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SocialNavigation = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Social Navigation</h2>
        <p className="text-muted-foreground">Tools to navigate social situations with confidence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Preparation
            </CardTitle>
            <CardDescription>Prepare for upcoming social events</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

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

        <Card className="md:col-span-2">
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
    </div>
  );
};

export default SocialNavigation;
