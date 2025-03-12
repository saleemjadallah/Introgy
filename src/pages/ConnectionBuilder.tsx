import { useState, useEffect } from "react";
import { Brain, MessageCircle, Heart, Shield, Sparkle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommunicationPreferences from "@/components/connection-builder/CommunicationPreferences";
import RelationshipNurturing from "@/components/connection-builder/RelationshipNurturing";
import MeaningfulInteractionTools from "@/components/connection-builder/MeaningfulInteractionTools";
import BoundaryManager from "@/components/connection-builder/boundary-manager/BoundaryManager";
import { PremiumFeatureGuard } from "@/components/premium/PremiumFeatureGuard";
import { usePremium } from "@/contexts/premium";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock } from "lucide-react";

const ConnectionBuilder = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { isPremium } = usePremium();
  
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'communication-preferences':
        return (
          <PremiumFeatureGuard 
            feature="basic-communication-tools"
            title="Communication Preferences"
            description="Create up to 3 communication profiles with the free plan. Upgrade to premium for unlimited profiles and advanced features."
          >
            <CommunicationPreferences />
          </PremiumFeatureGuard>
        );
      case 'relationship-nurturing':
        return (
          <PremiumFeatureGuard 
            feature="up-to-10-relationships"
            title="Relationship Nurturing"
            description="Free plan allows managing up to 10 relationships. Upgrade to premium for unlimited relationships and advanced nurturing tools."
          >
            <RelationshipNurturing />
          </PremiumFeatureGuard>
        );
      case 'meaningful-interactions':
        return (
          <PremiumFeatureGuard 
            feature="ai-interaction-tools"
            title="Premium Interaction Tools"
            description="Unlock AI-powered tools to create deeper connections with less effort"
          >
            <MeaningfulInteractionTools />
          </PremiumFeatureGuard>
        );
      case 'boundary-manager':
        return (
          <PremiumFeatureGuard 
            feature="boundary-management"
            title="Premium Boundary Management"
            description="Advanced tools for setting and maintaining healthy social boundaries"
          >
            <BoundaryManager />
          </PremiumFeatureGuard>
        );
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
              <Shield className="h-5 w-5 flex-shrink-0 text-mauve" />
              <span>Boundary Manager</span>
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">Set and maintain healthy social boundaries</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Create personalized boundary templates, manage social limits, and get AI-powered guidance for setting and communicating boundaries effectively.
            </p>
            <Button 
              onClick={() => setActiveFeature('boundary-manager')}
              className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/70 hover:bg-white text-mauve"
              size="lg"
            >
              Manage Boundaries
            </Button>
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
              <Sparkle className="h-5 w-5 flex-shrink-0 text-mauve" />
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
            <div className="space-y-4">
              {!isPremium && (
                <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Free Plan Limitations
                  </AlertTitle>
                  <AlertDescription>
                    Free plan allows managing up to 10 relationships with basic tools. 
                    Upgrade to premium for unlimited relationships and advanced features.
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={() => setActiveFeature('relationship-nurturing')}
                className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/70 hover:bg-white text-mauve"
                size="lg"
              >
                Open Intelligent Assistant
              </Button>
            </div>
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
