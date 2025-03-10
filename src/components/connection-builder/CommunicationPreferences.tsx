import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCommunicationProfiles } from '@/hooks/useCommunicationProfiles';
import TemplateSelector from './communication-preferences/TemplateSelector';
import ProfilesList from './communication-preferences/ProfilesList';
import ProfileEditor from './communication-preferences/ProfileEditor';
import SharingManager from './communication-preferences/SharingManager';
import ProfileWizard from './communication-preferences/ProfileWizard';
import { CommunicationProfile } from '@/types/communication-preferences';
import { MessageCircle, ListPlus, Users, Share2 } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<string>('profiles');
  const [currentProfile, setCurrentProfile] = useState<CommunicationProfile | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleProfileSelect = (profile: CommunicationProfile) => {
    setCurrentProfile(profile);
    setActiveTab('edit');
  };

  const handleCreateNew = () => {
    setCurrentProfile(null);
    setIsCreating(true);
    setActiveTab('create');
  };

  const handleCreateFromTemplate = (newProfile: CommunicationProfile) => {
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Communication Preferences</h2>
        <p className="text-muted-foreground">Define how you prefer to communicate and share with others</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <ListPlus className="h-4 w-4" />
            <span className="hidden sm:inline">My Profiles</span>
            <span className="sm:hidden">Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Create New</span>
            <span className="sm:hidden">Create</span>
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2" disabled={!currentProfile && !isCreating}>
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2" disabled={profiles.length === 0}>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share Settings</span>
            <span className="sm:hidden">Share</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4 mt-6">
          <ProfilesList 
            profiles={profiles}
            onProfileSelect={handleProfileSelect}
            onCreateNew={handleCreateNew}
            onSetDefault={handleSetDefault}
            onDeleteProfile={handleProfileDelete}
          />
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4 mt-6">
          {isCreating ? (
            <ProfileWizard 
              onComplete={handleCreateFromTemplate} 
              onCancel={handleCancelCreate}
            />
          ) : (
            <TemplateSelector 
              onSelectTemplate={handleCreateFromTemplate}
              onCancel={() => setActiveTab('profiles')}
            />
          )}
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