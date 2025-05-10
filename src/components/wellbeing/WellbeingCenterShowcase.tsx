
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BookOpen, Users, Battery, Book, ChevronDown, AlertCircle, User, MessageSquare, MountainSnow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";

const WellbeingCenterShowcase = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'wisdom' | 'mindfulness'>('overview');

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        <Alert className="bg-periwinkle/10 border border-periwinkle/20 mb-4">
          <AlertDescription className="flex items-center text-sm">
            <Star className="h-4 w-4 mr-2 text-blueteal" />
            <span>This is a preview of the Wellbeing Center available in the full Introgy app.</span>
          </AlertDescription>
        </Alert>
      
        <p>The Wellbeing Center is designed specifically for introverts, offering AI-powered resources to help you better understand and support your introvert needs. This section provides education, mindfulness exercises, and community wisdom tailored to introverts.</p>
      </div>
      
      <div className="w-full">
        <ScrollArea 
          className="w-full max-w-[calc(100vw-2rem)]" 
          type="scroll" 
          orientation="horizontal"
        >
          <div className="flex gap-2 pb-3 px-1 whitespace-nowrap">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('overview')}
              className="flex-shrink-0 hover:text-white py-2 text-sm"
              size="sm"
            >
              <LineChart className="h-4 w-4 mr-2 text-blueteal" />
              Overview
            </Button>
            <Button 
              variant={activeTab === 'education' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('education')}
              className="flex-shrink-0 hover:text-white py-2 text-sm"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2 text-blueteal" />
              AI Education Center
            </Button>
            <Button 
              variant={activeTab === 'mindfulness' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('mindfulness')}
              className="flex-shrink-0 hover:text-white py-2 text-sm"
              size="sm"
            >
              <MountainSnow className="h-4 w-4 mr-2 text-blueteal" />
              Mindfulness Exercises
            </Button>
            <Button 
              variant={activeTab === 'wisdom' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('wisdom')}
              className="flex-shrink-0 hover:text-white py-2 text-sm"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2 text-blueteal" />
              Community Wisdom
            </Button>
          </div>
        </ScrollArea>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full">
          <Card className="w-full wellbeing-container-gradient overflow-hidden shadow-lg border border-white/40">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BookOpen className="h-5 w-5 flex-shrink-0 text-blueteal" />
                <span>AI Education Center</span>
              </CardTitle>
              <CardDescription className="text-sm mt-1.5">Learn about introvert psychology</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Explore our AI-powered introvert psychology education center with glossary terms, mythbusters, and famous introverts profiles.
              </p>
              <Button 
                onClick={() => setActiveTab('education')}
                className="w-full py-2 text-sm mt-2 bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                size="lg"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full wellbeing-container-gradient overflow-hidden shadow-lg border border-white/40">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MountainSnow className="h-5 w-5 flex-shrink-0 text-blueteal" />
                <span>Mindfulness Exercises</span>
              </CardTitle>
              <CardDescription className="text-sm mt-1.5">Introvert-specific mindfulness practices</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Practice mindfulness techniques designed specifically for introverts to recharge and manage social energy.
              </p>
              <Button 
                onClick={() => setActiveTab('mindfulness')}
                className="w-full py-2 text-sm mt-2 bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                size="lg"
              >
                <MountainSnow className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full wellbeing-container-gradient overflow-hidden shadow-lg border border-white/40 md:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-5 w-5 flex-shrink-0 text-blueteal" />
                <span>Community Wisdom</span>
              </CardTitle>
              <CardDescription className="text-sm mt-1.5">Anonymous sharing of introvert strategies</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Learn from the collective wisdom of fellow introverts who have shared their successful coping strategies and insights.
              </p>
              <Button 
                onClick={() => setActiveTab('wisdom')}
                className="w-full py-2 text-sm mt-2 bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                size="lg"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : activeTab === 'education' ? (
        <EducationCenterPreview />
      ) : activeTab === 'wisdom' ? (
        <CommunityWisdomPreview />
      ) : (
        <MindfulnessPreview />
      )}

      <div className="text-center">
        <Button 
          onClick={() => window.location.href = "#download-app"} 
          className="bg-purple-600 hover:bg-purple-700 mt-4"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Download App to Access Full Wellbeing Center
        </Button>
      </div>
    </div>
  );
};

const EducationCenterPreview = () => {
  return (
    <Card className="border-dashed border-2 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blueteal" />
          AI Education Center
        </CardTitle>
        <CardDescription>
          Personalized learning about introvert psychology
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The AI Education Center provides evidence-based knowledge about introvert psychology in an accessible, 
          engaging format. Learn at your own pace with topics curated for your interests.
        </p>
        
        <div className="grid gap-3">
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">🧠 Psychology Glossary</h4>
            <p className="text-sm text-muted-foreground">Interactive glossary explaining key psychological concepts related to introversion and personality types</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">❌ Introvert Mythbusters</h4>
            <p className="text-sm text-muted-foreground">Evidence-based debunking of common misconceptions about introverts</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">👤 Famous Introverts</h4>
            <p className="text-sm text-muted-foreground">Profiles of well-known introverts and how their introversion contributed to their success</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">🤖 AI-Generated Content</h4>
            <p className="text-sm text-muted-foreground">Request custom content about any introversion topic you're curious about</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MindfulnessPreview = () => {
  return (
    <Card className="border-dashed border-2 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MountainSnow className="h-5 w-5 text-blueteal" />
          Mindfulness Exercises
        </CardTitle>
        <CardDescription>
          Tailored practices for introvert wellbeing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Our mindfulness exercises are specifically designed for introverts to help manage social energy,
          reduce overstimulation, and build resilience for social situations.
        </p>
        
        <div className="grid gap-3">
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">🔋 Social Recovery</h4>
            <p className="text-sm text-muted-foreground">Guided practices to help you recharge after social interactions</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">⚡ Energy Conservation</h4>
            <p className="text-sm text-muted-foreground">Techniques for preserving social energy during extended social events</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">🧘 Quick Moments</h4>
            <p className="text-sm text-muted-foreground">30-second to 3-minute practices you can do anywhere when feeling overwhelmed</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">🎯 Preparation</h4>
            <p className="text-sm text-muted-foreground">Pre-event mindfulness to center yourself before social gatherings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CommunityWisdomPreview = () => {
  return (
    <Card className="border-dashed border-2 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blueteal" />
          Community Wisdom
        </CardTitle>
        <CardDescription>
          Learn from fellow introverts' experiences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Community Wisdom is a space where introverts anonymously share strategies and insights
          that have worked for them. Filter by situation type to find relevant advice.
        </p>
        
        <div className="grid gap-3">
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">💼 Work Scenarios</h4>
            <p className="text-sm text-muted-foreground">Navigating open offices, meetings, team-building events, and networking</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">👪 Family Gatherings</h4>
            <p className="text-sm text-muted-foreground">Managing extended family events and setting boundaries</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">🎉 Social Events</h4>
            <p className="text-sm text-muted-foreground">Tips for parties, dating, and group outings</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-md">
            <h4 className="font-medium mb-1">✍️ Contribute</h4>
            <p className="text-sm text-muted-foreground">Share your own successful strategies anonymously with the community</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellbeingCenterShowcase;
