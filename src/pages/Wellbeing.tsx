
import { LineChart, BookOpen, Users, Battery, Book, ChevronDown, AlertCircle, User, MessageSquare, MountainSnow, Download, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Wellbeing = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'education' | 'wisdom' | 'mindfulness'>('overview');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const toggleFeature = (feature: string) => {
    setExpandedFeature(expandedFeature === feature ? null : feature);
  };

  return (
    <div className="space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Wellbeing Center</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Explore our AI-powered tools designed specifically for introvert wellbeing
        </p>
      </div>

      {/* Hero section */}
      <Card className="wellbeing-container-gradient overflow-hidden shadow-lg border border-white/40">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold">Enhance Your Introvert Wellbeing</h3>
              <p className="text-muted-foreground">
                Our comprehensive wellbeing center provides personalized tools, education, and support for introverts.
                The full experience is available in our iOS app.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={() => window.location.href = "#download-app"} 
                  className="bg-blueteal hover:bg-blueteal/90"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download iOS App
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "#features"}
                  size="lg"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Explore Features
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="rounded-lg bg-white/20 shadow-xl p-4 border border-white/30 w-full max-w-xs">
                <div className="aspect-[9/16] rounded-md bg-gradient-to-br from-sky-100/90 to-blue-50 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MountainSnow className="h-16 w-16 mx-auto text-blueteal opacity-90 mb-4" />
                    <h4 className="text-lg font-medium mb-2">Introgy App</h4>
                    <p className="text-sm text-gray-600">Wellbeing tools designed for introverts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div id="features" className="space-y-2 pt-4">
        <h3 className="text-xl font-semibold">Key Features</h3>
        <p className="text-muted-foreground">Discover the powerful tools available in our iOS app</p>
      </div>

      {/* AI Education Center */}
      <Card className="wellbeing-container-gradient overflow-hidden shadow-md border border-white/40">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BookOpen className="h-5 w-5 flex-shrink-0 text-blueteal" />
            <span>AI Education Center</span>
          </CardTitle>
          <CardDescription className="text-sm mt-1.5">Learn about introvert psychology through our AI-curated resources</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <Collapsible 
            open={expandedFeature === 'education'} 
            onOpenChange={() => toggleFeature('education')}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Deepen your understanding of introvert psychology with personalized learning paths.
              </p>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFeature === 'education' ? 'transform rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="rounded-md bg-white/20 p-4">
                <h4 className="text-sm font-medium mb-2">What you'll find in the app:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Introvert myths debunked by AI research</li>
                  <li>Interactive glossary of psychological terms and concepts</li> 
                  <li>Famous introverts and their success strategies</li>
                  <li>Personalized content based on your specific introvert traits</li>
                  <li>Regular updates with the latest research on introversion</li>
                </ul>
              </div>
              <div className="flex justify-center">
                <Button 
                  onClick={() => window.location.href = "#download-app"} 
                  className="bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Get Access in the App
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Mindfulness Exercises */}
      <Card className="wellbeing-container-gradient overflow-hidden shadow-md border border-white/40">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MountainSnow className="h-5 w-5 flex-shrink-0 text-blueteal" />
            <span>Mindfulness Exercises</span>
          </CardTitle>
          <CardDescription className="text-sm mt-1.5">Introvert-specific mindfulness practices to restore energy</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <Collapsible 
            open={expandedFeature === 'mindfulness'} 
            onOpenChange={() => toggleFeature('mindfulness')}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Recharge your social battery with guided mindfulness exercises designed specifically for introverts.
              </p>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFeature === 'mindfulness' ? 'transform rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="rounded-md bg-white/20 p-4">
                <h4 className="text-sm font-medium mb-2">What you'll find in the app:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Quick energy-restoring exercises (1-5 minutes)</li>
                  <li>Deeper mindfulness practices for complete recharge</li>
                  <li>Audio-guided sessions with ambient soundscapes</li>
                  <li>Visual meditation journeys with calming imagery</li>
                  <li>Progress tracking to see the impact on your wellbeing</li>
                </ul>
              </div>
              <div className="flex justify-center">
                <Button 
                  onClick={() => window.location.href = "#download-app"} 
                  className="bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Get Access in the App
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Community Wisdom */}
      <Card className="wellbeing-container-gradient overflow-hidden shadow-md border border-white/40">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageSquare className="h-5 w-5 flex-shrink-0 text-blueteal" />
            <span>Community Wisdom</span>
          </CardTitle>
          <CardDescription className="text-sm mt-1.5">Anonymous sharing of introvert strategies and experiences</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <Collapsible 
            open={expandedFeature === 'wisdom'} 
            onOpenChange={() => toggleFeature('wisdom')}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Connect with fellow introverts and share strategies in a safe, anonymous environment.
              </p>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFeature === 'wisdom' ? 'transform rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="rounded-md bg-white/20 p-4">
                <h4 className="text-sm font-medium mb-2">What you'll find in the app:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Anonymous sharing and discovery of introvert strategies</li>
                  <li>Curated wisdom collections for common challenges</li>
                  <li>AI-moderated discussions to ensure psychological safety</li>
                  <li>Save your favorite insights to your personal collection</li>
                  <li>Submit your own strategies to help others</li>
                </ul>
              </div>
              <div className="flex justify-center">
                <Button 
                  onClick={() => window.location.href = "#download-app"} 
                  className="bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Get Access in the App
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Download CTA */}
      <div id="download-app" className="py-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl md:text-2xl font-bold">Experience the Complete Wellbeing Suite</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Download our iOS app today to access all wellbeing features, personalized to your unique introvert needs.
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 mt-2" 
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download on the App Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wellbeing;
