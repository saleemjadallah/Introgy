
import { useState } from "react";
import { Brain, Users, MessageCircle, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommunicationPreferences from "@/components/connection-builder/CommunicationPreferences";

const ConnectionBuilder = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'communication-preferences':
        return <CommunicationPreferences />;
      default:
        return renderFeatureCards();
    }
  };
  
  const renderFeatureCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Compatibility Finder
            </CardTitle>
            <CardDescription>Find people who match your social style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card className={activeFeature === 'communication-preferences' ? 'border-primary' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Communication Preferences
            </CardTitle>
            <CardDescription>Set your ideal communication style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Define and share how you prefer to communicate as an introvert. Set boundaries, channel preferences, and more.
            </p>
            <Button 
              onClick={() => setActiveFeature('communication-preferences')}
              className="w-full"
            >
              Manage Communication Preferences
            </Button>
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
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Connection Builder</h2>
          <p className="text-muted-foreground">Create and maintain meaningful relationships</p>
        </div>
        
        {activeFeature && (
          <Button variant="outline" onClick={() => setActiveFeature(null)}>
            Back to Features
          </Button>
        )}
      </div>

      {renderFeatureContent()}
    </div>
  );
};

export default ConnectionBuilder;
