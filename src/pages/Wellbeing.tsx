import { LineChart, BookOpen, Users, Battery, Book, ChevronDown, AlertCircle, User, MessageSquare, MountainSnow } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommunityWisdom from "@/components/wellbeing/community-wisdom/CommunityWisdom";
import MindfulnessExercises from "@/components/wellbeing/mindfulness/MindfulnessExercises";
import EducationCenter from "@/components/wellbeing/education/EducationCenter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePremium } from "@/contexts/premium";
import { Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { PremiumFeatureGuard } from "@/components/premium/PremiumFeatureGuard";

const Wellbeing = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'education' | 'wisdom' | 'mindfulness'>('overview');
  const isMobile = useIsMobile();
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Wellbeing Center</h2>
        <p className="text-sm sm:text-base text-muted-foreground">AI-powered resources to support your introvert wellbeing</p>
      </div>

      <div className="w-full">
        <ScrollArea 
          className="w-full" 
          type="scroll" 
          orientation="horizontal"
        >
          <div className="flex gap-2 pb-3 px-1 whitespace-nowrap">
            <Button 
              variant={activeSection === 'overview' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('overview')}
              className="flex-shrink-0 hover:text-white py-5 sm:py-2 text-base sm:text-sm"
              size="sm"
            >
              <LineChart className="h-4 w-4 mr-2 text-blueteal" />
              Overview
            </Button>
            <Button 
              variant={activeSection === 'education' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('education')}
              className="flex-shrink-0 hover:text-white py-5 sm:py-2 text-base sm:text-sm"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2 text-blueteal" />
              AI Education Center
            </Button>
            <Button 
              variant={activeSection === 'mindfulness' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('mindfulness')}
              className="flex-shrink-0 hover:text-white py-5 sm:py-2 text-base sm:text-sm"
              size="sm"
            >
              <MountainSnow className="h-4 w-4 mr-2 text-blueteal" />
              Mindfulness Exercises
            </Button>
            <Button 
              variant={activeSection === 'wisdom' ? 'default' : 'outline'} 
              onClick={() => setActiveSection('wisdom')}
              className="flex-shrink-0 hover:text-white py-5 sm:py-2 text-base sm:text-sm"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2 text-blueteal" />
              Community Wisdom
            </Button>
          </div>
        </ScrollArea>
      </div>

      {!isPremium && activeSection !== 'overview' && (
        <Alert className="bg-muted/50 border border-primary/20">
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {activeSection === 'education' ? (
              <span>Free plan includes basic glossary and introvert fundamentals.</span>
            ) : activeSection === 'mindfulness' ? (
              <span>Free plan includes 5 basic mindfulness exercises.</span>
            ) : (
              <span>Free plan includes limited community access.</span>
            )}
            <Button 
              size="sm" 
              onClick={() => navigate("/profile?tab=pricing")}
              className="whitespace-nowrap"
            >
              <Star className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {activeSection === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full max-w-full">
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
                Explore our AI-powered introvert psychology education center with glossary, myth busters, and famous introverts.
              </p>
              <Button 
                onClick={() => setActiveSection('education')}
                className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                size="lg"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Explore Education Center
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
                Explore our library of mindfulness practices specifically designed for introverts.
              </p>
              <Button 
                onClick={() => setActiveSection('mindfulness')}
                className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                size="lg"
              >
                <MountainSnow className="h-4 w-4 mr-2" />
                Explore Mindfulness Practices
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
                Share and discover strategies from fellow introverts.
              </p>
              <Button 
                onClick={() => setActiveSection('wisdom')}
                className="w-full py-5 sm:py-2 text-base sm:text-sm mt-2 bg-white/50 hover:bg-white/80 text-blueteal shadow-sm backdrop-blur-sm"
                size="lg"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Explore Community Wisdom
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : activeSection === 'education' ? (
        <EducationCenter />
      ) : activeSection === 'wisdom' ? (
        <CommunityWisdom />
      ) : (
        <MindfulnessExercises />
      )}
    </div>
  );
};

export default Wellbeing;
