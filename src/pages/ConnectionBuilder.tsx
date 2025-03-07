
import { Brain, Users, MessageCircle, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ConnectionBuilder = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Connection Builder</h2>
        <p className="text-muted-foreground">Create and maintain meaningful relationships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Compatibility Finder
            </CardTitle>
            <CardDescription>Find people who match your social style</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Communication Preferences
            </CardTitle>
            <CardDescription>Set your ideal communication style</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Relationship Nurturing
            </CardTitle>
            <CardDescription>Tools to maintain important connections with less effort</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectionBuilder;
