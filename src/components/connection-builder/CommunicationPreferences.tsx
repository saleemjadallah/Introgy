
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCommunicationProfiles } from '@/hooks/useCommunicationProfiles'; // Updated import path
import TemplateSelector from './communication-preferences/TemplateSelector';
import ProfilesList from './communication-preferences/ProfilesList';
import ProfileEditor from './communication-preferences/ProfileEditor';
import SharingManager from './communication-preferences/SharingManager';
import ProfileWizard from './communication-preferences/ProfileWizard';
import AIProfileWizard from './communication-preferences/AIProfileWizard';
import { CommunicationProfile } from '@/types/communication-preferences';
import { MessageCircle, ListPlus, Users, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { usePremium } from '@/contexts/premium/PremiumContext';

const CommunicationPreferences = () => {
  const { toast } = useToast();
  const { 
    profiles, 
    isLoading,
    createProfile, 
    updateProfile, 
    deleteProfile,
    setDefaultProfile,
  } = useCommunicationProfiles();
  const { isPremium } = usePremium();

  const MAX_FREE_PROFILES = 3;
  const [canCreateProfile, setCanCreateProfile] = useState(true);

  // Check if the user can create more profiles
  useEffect(() => {
    setCanCreateProfile(isPremium || profiles.length < MAX_FREE_PROFILES);
  }, [isPremium, profiles.length]);

  const [activeTab, setActiveTab] = useState<string>('profiles');
  const [currentProfile, setCurrentProfile] = useState<CommunicationProfile | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createMode, setCreateMode] = useState<'template' | 'wizard' | 'ai'>('template');

  const handleProfileSelect = (profile: CommunicationProfile) => {
    setCurrentProfile(profile);
    setActiveTab('edit');
  };

  const handleCreateNew = (mode: 'template' | 'wizard' | 'ai' = 'template') => {
    if (!canCreateProfile && !isPremium) {
      toast({
        title: 'Free plan limit reached',
        description: `You can only create ${MAX_FREE_PROFILES} profiles with the free plan. Upgrade to premium for unlimited profiles.`,
        variant: 'destructive'
      });
      return;
    }
    
    setCurrentProfile(null);
    setIsCreating(true);
    setCreateMode(mode);
    setActiveTab('create');
  };

  const handleCreateFromTemplate = (newProfile: CommunicationProfile) => {
    if (!canCreateProfile && !isPremium) {
      toast({
        title: 'Free plan limit reached',
        description: `You can only create ${MAX_FREE_PROFILES} profiles with the free plan. Upgrade to premium for unlimited profiles.`,
        variant: 'destructive'
      });
      return;
    }
    
    createProfile(newProfile);
    toast({
      title: 'Profile created',
      description: `Your communication profile "${newProfile.profileName}" has been created.`
    });
    setIsCreating(false);
    setActiveTab('profiles');
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setActiveTab('profiles');
  };

  const handleProfileUpdate = (profileId: string, updates: Partial<CommunicationProfile>) => {
    updateProfile(profileId, updates);
    setActiveTab('profiles');
  };

  const handleProfileDelete = (profileId: string) => {
    deleteProfile(profileId);
    setCurrentProfile(null);
    setActiveTab('profiles');
  };

  const handleSetDefault = (profileId: string) => {
    setDefaultProfile(profileId);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-48">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Communication Preferences</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Define how you prefer to communicate and share with others</p>
      </div>

      {!isPremium && profiles.length >= MAX_FREE_PROFILES && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Free Plan Limitations
          </AlertTitle>
          <AlertDescription>
            You've reached the maximum of {MAX_FREE_PROFILES} communication profiles with your free plan. 
            Upgrade to premium for unlimited profiles and advanced communication tools.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger 
            value="profiles" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto"
          >
            <ListPlus className="h-4 w-4 mb-1" />
            <span>Profiles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto"
          >
            <MessageCircle className="h-4 w-4 mb-1" />
            <span>Create</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto"
          >
            <Sparkles className="h-4 w-4 mb-1" />
            <span>AI Assist</span>
          </TabsTrigger>
          <TabsTrigger 
            value="edit" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto" 
            disabled={!currentProfile && !isCreating}
          >
            <Users className="h-4 w-4 mb-1" />
            <span>Edit</span>
          </TabsTrigger>
          <TabsTrigger 
            value="share" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto" 
            disabled={profiles.length === 0}
          >
            <Share2 className="h-4 w-4 mb-1" />
            <span>Share</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4 mt-6">
          <ProfilesList 
            profiles={profiles}
            onProfileSelect={handleProfileSelect}
            onCreateNew={() => handleCreateNew('template')}
            onSetDefault={handleSetDefault}
            onDeleteProfile={handleProfileDelete}
            canCreateProfile={canCreateProfile}
            maxFreeProfiles={MAX_FREE_PROFILES}
            isPremium={isPremium}
          />
          
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline"
              onClick={() => handleCreateNew('ai')}
              className="flex items-center gap-2"
              disabled={!canCreateProfile && !isPremium}
            >
              <Sparkles className="h-4 w-4" />
              Create with AI assistant
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4 mt-6">
          {isCreating ? (
            createMode === 'ai' ? (
              <AIProfileWizard 
                onComplete={handleCreateFromTemplate} 
                onCancel={handleCancelCreate}
              />
            ) : (
              <ProfileWizard 
                onComplete={handleCreateFromTemplate} 
                onCancel={handleCancelCreate}
              />
            )
          ) : (
            <TemplateSelector 
              onSelectTemplate={handleCreateFromTemplate}
              onCancel={() => setActiveTab('profiles')}
            />
          )}
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4 mt-6">
          <AIProfileWizard 
            initialProfile={currentProfile || undefined}
            onComplete={(profile) => {
              if (currentProfile) {
                // Update existing profile
                updateProfile(currentProfile.profileId, profile);
                toast({
                  title: 'Profile updated',
                  description: `Your communication profile "${profile.profileName}" has been updated with AI assistance.`
                });
              } else {
                // Create new profile
                if (!canCreateProfile && !isPremium) {
                  toast({
                    title: 'Free plan limit reached',
                    description: `You can only create ${MAX_FREE_PROFILES} profiles with the free plan. Upgrade to premium for unlimited profiles.`,
                    variant: 'destructive'
                  });
                  return;
                }
                
                createProfile(profile);
                toast({
                  title: 'Profile created',
                  description: `Your communication profile "${profile.profileName}" has been created with AI assistance.`
                });
              }
              setActiveTab('profiles');
            }}
            onCancel={() => setActiveTab('profiles')}
          />
        </TabsContent>
        
        <TabsContent value="edit" className="space-y-4 mt-6">
          {currentProfile && (
            <ProfileEditor 
              profile={currentProfile}
              onUpdate={(updates) => handleProfileUpdate(currentProfile.profileId, updates)}
              onCancel={() => setActiveTab('profiles')}
            />
          )}
        </TabsContent>
        
        <TabsContent value="share" className="space-y-4 mt-6">
          <SharingManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationPreferences;
