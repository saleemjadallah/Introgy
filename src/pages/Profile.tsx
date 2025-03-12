
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Award, 
  HelpCircle,
  DollarSign
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProfileSection from "@/components/profile/ProfileSection";
import SettingsSection from "@/components/profile/SettingsSection";
import BadgesSection from "@/components/profile/BadgesSection";
import HelpFaqSection from "@/components/profile/HelpFaqSection";
import PricingSection from "@/components/profile/PricingSection";
import { earnBadge } from "@/services/badgeService";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  const handleEarnDemo = () => {
    earnBadge("reflection-master");
    earnBadge("feature-explorer");
  };

  useEffect(() => {
    // Check for tab in URL params
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4">
        <Card>
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your profile and personalized features.
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                className="w-full" 
                onClick={() => navigate("/auth?mode=signin")}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Create Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 md:px-6">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">My Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your account, preferences, and privacy settings
          </p>
        </div>
        
        {isMobile ? (
          <ScrollArea orientation="horizontal" className="w-full pb-4" type="native">
            <TabsList className="inline-flex w-max px-1">
              <TabsTrigger value="profile" className="gap-1 px-3">
                <User size={14} /> 
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1 px-3">
                <Settings size={14} /> 
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="gap-1 px-3">
                <Award size={14} /> 
                <span>Badges</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-1 px-3">
                <DollarSign size={14} /> 
                <span>Pricing</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="gap-1 px-3">
                <HelpCircle size={14} /> 
                <span>Help</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        ) : (
          <TabsList className="grid grid-cols-5 mb-8 w-full">
            <TabsTrigger value="profile" className="gap-2">
              <User size={16} /> 
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings size={16} /> 
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Award size={16} /> 
              <span>Badges</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign size={16} /> 
              <span>Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="gap-2">
              <HelpCircle size={16} /> 
              <span>Help</span>
            </TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsSection />
        </TabsContent>
        
        <TabsContent value="badges">
          <BadgesSection onEarnDemo={handleEarnDemo} />
        </TabsContent>
        
        <TabsContent value="pricing">
          <PricingSection />
        </TabsContent>
        
        <TabsContent value="help">
          <HelpFaqSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
