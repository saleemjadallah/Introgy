
import { useState } from "react";
import { MessageCircle, Heart, Shield, Sparkle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Info } from "lucide-react";

const ConnectionBuilder = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold">Thoughtful Connection Management</h3>
            <p className="text-muted-foreground">
              The Connection Builder helps you create and maintain meaningful relationships on your own terms.
              Our smart tools make relationship management less overwhelming for introverts and those who find
              social interactions draining.
            </p>
            
            <div className="bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-500 p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-sky-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Designed for Introverts</h4>
                  <p className="text-sm text-muted-foreground">
                    All Connection Builder features are designed to help you maintain relationships 
                    without social burnout. Nurture connections with minimal energy expenditure.
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold pt-4">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Communication preferences profiles to share with friends and family</li>
              <li>Relationship nurturing assistant that suggests optimal connection timing</li>
              <li>AI-powered conversation starters and message templates</li>
              <li>Boundary management tools to protect your social energy</li>
              <li>Relationship inventory visualization to keep track of your social network</li>
            </ul>
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold">Communication Preferences</h3>
            <p className="text-muted-foreground">
              Create shareable profiles that explain how you prefer to communicate. Let friends and
              family know your preferred contact methods, response times, and interaction styles.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profile Templates</CardTitle>
                  <CardDescription>Ready-made profiles for different contexts</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Work communication preferences</li>
                    <li>Close friends communication</li>
                    <li>Family communication style</li>
                    <li>Social events preferences</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Profile Creator</CardTitle>
                  <CardDescription>Generate personalized communication guides</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Answer a few questions and our AI will craft a detailed communication 
                  profile that you can share with anyone. Includes personalized phrases
                  and explanations for your specific needs.
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center pt-3">
              <Button 
                onClick={() => window.location.href = "#download-app"} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                iOS App Coming Soon
              </Button>
            </div>
          </div>
        );
      case "nurturing":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold">Relationship Nurturing Assistant</h3>
            <p className="text-muted-foreground">
              Our intelligent assistant helps you maintain important connections without social burnout. 
              Get personalized suggestions on when and how to connect with people who matter to you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Smart Insights</CardTitle>
                  <CardDescription>Relationship patterns and opportunities</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  The app analyzes your relationship patterns and identifies connections 
                  that might need attention. Get gentle reminders about friends you haven't 
                  connected with recently.
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Connection Planner</CardTitle>
                  <CardDescription>Optimized interaction scheduling</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Plan your social interactions based on your energy levels. The app suggests 
                  optimal times to reach out to people, helping you maintain relationships without 
                  getting overwhelmed.
                </CardContent>
              </Card>
              
              <Card className="border border-muted col-span-1 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Relationship Health Dashboard</CardTitle>
                  <CardDescription>Visual overview of your connections</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-3">
                    See the health of your relationships at a glance with our intuitive dashboard. Track:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 grid grid-cols-1 md:grid-cols-2">
                    <li>Connection frequency</li>
                    <li>Interaction balance</li>
                    <li>Relationship energy impact</li>
                    <li>Important dates and milestones</li>
                    <li>Recent interactions</li>
                    <li>Personalized connection insights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center pt-3">
              <Button 
                onClick={() => window.location.href = "#download-app"} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                iOS App Coming Soon
              </Button>
            </div>
          </div>
        );
      case "tools":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold">Meaningful Interaction Tools</h3>
            <p className="text-muted-foreground">
              AI-powered tools help you create deeper connections with less effort. Generate conversation 
              starters, thoughtful messages, and meaningful rituals tailored to your relationships.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Deep Questions</CardTitle>
                  <CardDescription>Spark meaningful conversations</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Example questions generated by our AI:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>What's something you've changed your mind about recently?</li>
                    <li>Which of your traits are you most grateful for?</li>
                    <li>What makes you feel truly understood?</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Message Templates</CardTitle>
                  <CardDescription>Express yourself authentically</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Thoughtfully crafted templates for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Checking in with friends</li>
                    <li>Expressing appreciation</li>
                    <li>Setting boundaries kindly</li>
                    <li>Reconnecting after time apart</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Connection Rituals</CardTitle>
                  <CardDescription>Structured ways to stay connected</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Create sustainable connection rituals that respect your energy levels, 
                  such as monthly video calls, quarterly coffee meetups, or annual
                  traditions that deepen your relationships naturally.
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Shared Experiences</CardTitle>
                  <CardDescription>Activities for deeper connections</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Find meaningful activities to do with friends and family that 
                  create lasting memories while respecting your social energy needs.
                  Includes discussion prompts for each experience.
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center pt-3">
              <Button 
                onClick={() => window.location.href = "#download-app"} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                iOS App Coming Soon
              </Button>
            </div>
          </div>
        );
      case "boundaries":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold">Boundary Manager</h3>
            <p className="text-muted-foreground">
              Set and maintain healthy social boundaries with confidence. Our tools help you communicate 
              your needs effectively and protect your social energy.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Boundary Templates</CardTitle>
                  <CardDescription>Ready-made boundary statements</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Access templates for common boundaries:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Response time expectations</li>
                    <li>Social gathering limits</li>
                    <li>Digital communication preferences</li>
                    <li>Energy-preserving phrases</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Boundary Coach</CardTitle>
                  <CardDescription>Personalized boundary guidance</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Our AI coach helps you identify when boundaries are needed and suggests 
                  personalized ways to communicate them kindly but firmly. Get feedback on 
                  your boundary statements before sharing them.
                </CardContent>
              </Card>
              
              <Card className="border border-muted col-span-1 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Boundary Documentation</CardTitle>
                  <CardDescription>Track what works for you</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Document your personal boundaries and their effectiveness over time. The app helps you 
                    learn which boundaries best protect your energy while maintaining healthy relationships.
                    You can also track how different people respond to your boundaries and adjust your approach accordingly.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center pt-3">
              <Button 
                onClick={() => window.location.href = "#download-app"} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                iOS App Coming Soon
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderFeatureContent = () => {
    if (activeFeature) {
      return (
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveFeature(null)}
            className="w-full sm:w-auto py-5 sm:py-2 text-base sm:text-sm"
          >
            Back to Features
          </Button>
          
          <Card className="shadow-sm bg-white/80">
            <CardHeader>
              <CardTitle>
                {activeFeature === 'communication-preferences' && "Communication Preferences"}
                {activeFeature === 'relationship-nurturing' && "Relationship Nurturing"}
                {activeFeature === 'meaningful-interactions' && "Meaningful Interaction Tools"}
                {activeFeature === 'boundary-manager' && "Boundary Manager"}
              </CardTitle>
              <CardDescription>
                {activeFeature === 'communication-preferences' && "Set and share your ideal communication style"}
                {activeFeature === 'relationship-nurturing' && "Maintain important connections with less effort"}
                {activeFeature === 'meaningful-interactions' && "Create deeper connections naturally"}
                {activeFeature === 'boundary-manager' && "Set and maintain healthy social boundaries"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This feature is available in the full Introgy app. Get notified when the iOS app launches.
              </p>
              
              <div className="text-center">
                <Button 
                  onClick={() => window.location.href = "#download-app"} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  iOS App Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 shadow-sm border-indigo-100">
          <CardHeader>
            <CardTitle className="text-xl">Connection Builder: Your Social Network Assistant</CardTitle>
            <CardDescription>
              Build and maintain meaningful relationships while respecting your social energy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="preferences">Communication</TabsTrigger>
                <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="boundaries">Boundaries</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="p-1">
                {renderTabContent()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-x-hidden">
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
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm connection-container-gradient">
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
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm connection-container-gradient">
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
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-sm connection-container-gradient">
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
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Connection Builder</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create and maintain meaningful relationships</p>
        </div>
      </div>

      {renderFeatureContent()}
    </div>
  );
};

export default ConnectionBuilder;
