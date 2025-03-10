
import { useState } from "react";
import { Brain, Users, MessageCircle, Heart, Archive, Bot, Wrench, LineChart, MessageSquareMore } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommunicationPreferences from "@/components/connection-builder/CommunicationPreferences";
import RelationshipInventory from "@/components/connection-builder/relationship-inventory/RelationshipInventory";
import RelationshipNurturing from "@/components/connection-builder/RelationshipNurturing";

const ConnectionBuilder = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'communication-preferences':
        return <CommunicationPreferences />;
      case 'relationship-inventory':
        return <RelationshipInventory />;
      case 'intelligent-nurturing':
        return <RelationshipNurturing />;
      default:
        return renderFeatureCards();
    }
  };
  
  const renderFeatureCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`shadow-sm ${activeFeature === 'relationship-inventory' ? 'border-primary' : ''}`}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Archive className="h-5 w-5 flex-shrink-0" />
              <span>Relationship Inventory System</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Organize and visualize your important connections</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Map and maintain your relationships with an intuitive visual system designed for introverts.
            </p>
            <Button 
              onClick={() => setActiveFeature('relationship-inventory')}
              className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2"
              size="lg"
            >
              View Relationships
            </Button>
          </CardContent>
        </Card>

        <Card className={`shadow-sm ${activeFeature === 'intelligent-nurturing' ? 'border-primary' : ''}`}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Bot className="h-5 w-5 flex-shrink-0" />
              <span>Intelligent Nurturing Assistant</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Smart relationship maintenance recommendations</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Get AI-powered suggestions for maintaining healthy relationships with personalized insights.
            </p>
            <Button 
              onClick={() => setActiveFeature('intelligent-nurturing')}
              className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2"
              size="lg"
            >
              Open Assistant
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Wrench className="h-5 w-5 flex-shrink-0" />
              <span>Meaningful Interaction Tools</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Resources for deeper connections</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <LineChart className="h-5 w-5 flex-shrink-0" />
              <span>Relationship Insights</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Analytics and patterns in your connections</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card className={`shadow-sm ${activeFeature === 'communication-preferences' ? 'border-primary' : ''}`}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MessageCircle className="h-5 w-5 flex-shrink-0" />
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
              className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2"
              size="lg"
            >
              Manage Preferences
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MessageSquareMore className="h-5 w-5 flex-shrink-0" />
              <span>Authentic Communication Support</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Tools for genuine expression</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Coming soon in the next update!</p>
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
