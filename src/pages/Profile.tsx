import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import BadgesDisplay from "@/components/badges/BadgesDisplay";
import { earnBadge } from "@/services/badgeService";
import { 
  User, 
  Settings, 
  Shield, 
  Award, 
  HelpCircle, 
  ChevronDown, 
  Edit, 
  Save, 
  X,
  Trophy
} from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // User profile data (would come from auth provider in a real app)
  const [userData, setUserData] = useState({
    displayName: "Guest User",
    email: "guest@example.com",
    bio: "I'm an introvert who enjoys reading, hiking, and quiet evenings at home.",
    introvertLevel: 7, // 1-10 scale
    joinDate: "January 2023",
    timezone: "Pacific Time (PT)",
    preferences: {
      darkMode: true,
      notifications: true,
      emailUpdates: false,
      dataCollection: true,
    }
  });
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
      duration: 3000,
    });
    
    // Demo: Trigger badge for profile completion
    earnBadge("inner-observer");
  };
  
  // Placeholder badges for the achievements section (now we'll use the real badge system)
  const faqItems = [
    {
      question: "What is a Social Battery and how does tracking work?",
      answer: "Your social battery represents your mental and emotional energy for social interactions. The app helps you track this energy throughout the day as different activities drain or recharge it. You can log activities and see patterns over time to better manage your social energy."
    },
    {
      question: "How is my personal information protected?",
      answer: "InnerCircle takes your privacy seriously. We use encryption for all sensitive data, don't share your information with third parties, and give you complete control over what data is stored. You can export or delete your data at any time from the Privacy & Data settings."
    },
    {
      question: "How do I prepare for an upcoming social event?",
      answer: "Navigate to the Social Navigation section and use the Event Preparation tool. You can create an event, estimate its energy cost, set up boundaries, prepare conversation topics, and create exit strategies. The app will also suggest personalized tips based on your introvert profile."
    },
    {
      question: "Can I use InnerCircle without creating an account?",
      answer: "Yes, you can use basic features without an account. However, creating an account allows us to save your preferences, history, and personalized settings across devices. Your data remains private and secure."
    },
    {
      question: "What are badges and how do I earn them?",
      answer: "Badges are achievements that recognize your personal growth journey as an introvert. You earn them by using app features, developing your social skills, managing your energy, and reaching important milestones. Each badge has specific criteria, and you can track your progress in the Badges section of your profile."
    }
  ];
  
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
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your profile and personalized features.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
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
          </CardFooter>
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
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal details and profile information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="default" size="sm" onClick={handleSaveProfile}>
                    <Save size={16} className="mr-2" /> Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X size={16} className="mr-1" /> Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                  <UserAvatar size="lg" name={userData.displayName} />
                  {isEditing && (
                    <Button variant="outline" size="sm" className="text-xs">
                      Change Avatar
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      {isEditing ? (
                        <Input 
                          id="displayName" 
                          value={userData.displayName} 
                          onChange={(e) => setUserData({...userData, displayName: e.target.value})}
                        />
                      ) : (
                        <div className="text-lg font-medium">{userData.displayName}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="text-lg font-medium text-muted-foreground">{userData.email}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea 
                        id="bio" 
                        value={userData.bio} 
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground">{userData.bio}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="introvertLevel">Introvert Level</Label>
                      {isEditing ? (
                        <Input 
                          id="introvertLevel" 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={userData.introvertLevel} 
                          onChange={(e) => setUserData({...userData, introvertLevel: parseInt(e.target.value)})}
                          className="w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${userData.introvertLevel * 10}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{userData.introvertLevel}/10</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <div className="text-muted-foreground">{userData.joinDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Introvert Traits & Preferences</CardTitle>
              <CardDescription>
                How you experience introversion and what works best for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Energy Drains</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Large groups</Badge>
                    <Badge variant="outline">Small talk</Badge>
                    <Badge variant="outline">Unexpected calls</Badge>
                    <Badge variant="outline">Loud environments</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Energy Gains</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Reading</Badge>
                    <Badge variant="outline">Nature walks</Badge>
                    <Badge variant="outline">Deep conversations</Badge>
                    <Badge variant="outline">Creative projects</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Communication Style</Label>
                  <div className="text-muted-foreground">
                    Prefers thoughtful written communication with time to process
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Social Goals</Label>
                  <div className="text-muted-foreground">
                    Building deeper connections with fewer people
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <Button variant="outline" size="sm">
                  Retake Introvert Assessment
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize your experience with InnerCircle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme throughout the app
                    </p>
                  </div>
                  <Switch 
                    id="darkMode" 
                    checked={userData.preferences.darkMode}
                    onCheckedChange={(checked) => 
                      setUserData({
                        ...userData, 
                        preferences: {...userData.preferences, darkMode: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates and reminders
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={userData.preferences.notifications}
                    onCheckedChange={(checked) => 
                      setUserData({
                        ...userData, 
                        preferences: {...userData.preferences, notifications: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailUpdates">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive occasional emails with tips and updates
                    </p>
                  </div>
                  <Switch 
                    id="emailUpdates" 
                    checked={userData.preferences.emailUpdates}
                    onCheckedChange={(checked) => 
                      setUserData({
                        ...userData, 
                        preferences: {...userData.preferences, emailUpdates: checked}
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>
                Control how your information is stored and used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dataCollection">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous usage data to improve the app
                  </p>
                </div>
                <Switch 
                  id="dataCollection" 
                  checked={userData.preferences.dataCollection}
                  onCheckedChange={(checked) => 
                    setUserData({
                      ...userData, 
                      preferences: {...userData.preferences, dataCollection: checked}
                    })
                  }
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <h4 className="font-medium">Data Management</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Export My Data
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground pt-1">
                  Deleting your account will permanently remove all your data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Badges Tab - Now using our new BadgesDisplay component */}
        <TabsContent value="badges" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-medium">Your Achievements</h2>
              <p className="text-muted-foreground">
                Track your personal growth journey as an introvert
              </p>
            </div>
            
            {/* Demo button to earn badges (for testing only) */}
            <Button variant="outline" size="sm" onClick={handleEarnDemo} className="gap-1">
              <Trophy size={14} />
              Demo: Earn Badges
            </Button>
          </div>
          
          <BadgesDisplay />
        </TabsContent>
        
        {/* Help & FAQ Tab */}
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using InnerCircle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((item, index) => (
                <Collapsible key={index} className="border rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left font-medium">
                    {item.question}
                    <ChevronDown size={18} className="transition-transform duration-200 ui-open:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground border-t">
                    {item.answer}
                  </CollapsibleContent>
                </Collapsible>
              ))}
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Can't find what you're looking for?
                </p>
                <Button variant="outline">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
