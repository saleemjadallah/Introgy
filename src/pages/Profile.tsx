
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings, 
  Award, 
  HelpCircle, 
  Trophy
} from "lucide-react";

import ProfileSection from "@/components/profile/ProfileSection";
import SettingsSection from "@/components/profile/SettingsSection";
import BadgesSection from "@/components/profile/BadgesSection";
import HelpFaqSection from "@/components/profile/HelpFaqSection";
import { earnBadge } from "@/services/badgeService";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEarnDemo = () => {
    earnBadge("reflection-master");
    earnBadge("feature-explorer");
    toast({
      title: "Demo Mode",
      description: "Earned some badges for demonstration purposes.",
      duration: 3000,
    });
  };

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
                onClick={() => setIsAuthenticated(true)}
              >
                Sign In (Demo)
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
    <div className="container max-w-4xl mx-auto py-6">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account, preferences, and privacy settings
          </p>
        </div>
        
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} /> Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings size={16} /> Settings
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Award size={16} /> Badges
          </TabsTrigger>
          <TabsTrigger value="help" className="gap-2">
            <HelpCircle size={16} /> Help & FAQ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsSection />
        </TabsContent>
        
        <TabsContent value="badges">
          <BadgesSection onEarnDemo={handleEarnDemo} />
        </TabsContent>
        
        <TabsContent value="help">
          <HelpFaqSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
