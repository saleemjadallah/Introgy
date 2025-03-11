
import { useState } from "react";
import { Brain, Users, MessageCircle, Heart, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommunicationPreferences from "@/components/connection-builder/CommunicationPreferences";
import RelationshipNurturing from "@/components/connection-builder/RelationshipNurturing";
import MeaningfulInteractionTools from "@/components/connection-builder/MeaningfulInteractionTools";

const ConnectionBuilder = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'communication-preferences':
        return <CommunicationPreferences />;
      case 'relationship-nurturing':
        return <RelationshipNurturing />;
      case 'meaningful-interactions':
        return <MeaningfulInteractionTools />;
      default:
        return renderFeatureCards();
    }
  };
  
  const renderFeatureCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm connection-container-gradient">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="h-5 w-5 flex-shrink-0 text-mauve" />
              <span>Compatibility Finder</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Find people who match your social style</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card className={`shadow-sm connection-container-gradient ${activeFeature === 'communication-preferences' ? 'border-primary' : ''}`}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MessageCircle className="h-5 w-5 flex-shrink-0 text-mauve" />
              <span>Communication Preferences</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Set your ideal communication style</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Define and share how you prefer to communicate as an introvert. Set boundaries, channel preferences, and more.
            </p>
            <Button 
              onClick={() => setActiveFeature('communication-preferences')}
              className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/70 hover:bg-white text-mauve"
              size="lg"
            >
              Manage Preferences
            </Button>
          </CardContent>
        </Card>

        <Card className={`shadow-sm connection-container-gradient ${activeFeature === 'meaningful-interactions' ? 'border-primary' : ''}`}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Sparkles className="h-5 w-5 flex-shrink-0 text-mauve" />
              <span>Meaningful Interaction Tools</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Tools for deeper connections</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              AI-powered tools to help you create deeper connections with less effort. Find conversation starters, message templates, and more.
            </p>
            <Button 
              onClick={() => setActiveFeature('meaningful-interactions')}
              className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/70 hover:bg-white text-mauve"
              size="lg"
            >
              Open Tools
            </Button>
          </CardContent>
        </Card>

        <Card className={`md:col-span-2 shadow-sm connection-container-gradient ${activeFeature === 'relationship-nurturing' ? 'border-primary' : ''}`}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Heart className="h-5 w-5 flex-shrink-0 text-mauve" />
              <span>Relationship Nurturing</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Tools to maintain important connections with less effort</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Intelligently manage your relationships, get personalized suggestions, and maintain meaningful connections with minimal energy.
            </p>
            <Button 
              onClick={() => setActiveFeature('relationship-nurturing')}
              className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/70 hover:bg-white text-mauve"
              size="lg"
            >
              Open Intelligent Assistant
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Connection Builder</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create and maintain meaningful relationships</p>
        </div>
        
        {activeFeature && (
          <Button 
            variant="outline" 
            onClick={() => setActiveFeature(null)}
            className="w-full sm:w-auto py-5 sm:py-2 text-base sm:text-sm"
          >
            Back to Features
          </Button>
        )}
      </div>

      {renderFeatureContent()}
    </div>
  );
};

export default ConnectionBuilder;
