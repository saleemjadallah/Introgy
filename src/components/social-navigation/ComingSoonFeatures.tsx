
import { BookOpen } from "lucide-react";
import ConversationSimulator from "./ConversationSimulator";
import SocialStrategies from "./SocialStrategies";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ComingSoonFeatures = () => {
  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 bg-muted/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            More Features in the App
          </CardTitle>
          <CardDescription>
            Get notified when the Introgy app launches to access all premium features, including:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-background rounded-md">
            <h4 className="font-medium mb-1">🗣️ Conversation Simulator</h4>
            <p className="text-sm text-muted-foreground">Practice social interactions in different scenarios with our AI-powered conversation partner</p>
          </div>
          
          <div className="p-4 bg-background rounded-md">
            <h4 className="font-medium mb-1">📚 Social Strategies Library</h4>
            <p className="text-sm text-muted-foreground">Evidence-based strategies for navigating different social situations</p>
          </div>
          
          <div className="p-4 bg-background rounded-md">
            <h4 className="font-medium mb-1">🔄 Energy Tracking</h4>
            <p className="text-sm text-muted-foreground">Advanced social battery tracking with personalized insights and recommendations</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview of social strategies */}
      <SocialStrategies />
      
      {/* Preview of conversation simulator */}
      <ConversationSimulator />
    </div>
  );
};

export default ComingSoonFeatures;
