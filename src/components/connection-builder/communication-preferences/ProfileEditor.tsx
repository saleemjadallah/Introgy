import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CommunicationProfile } from '@/types/communication-preferences';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Clock, Battery, Eye, Save, ArrowLeft } from 'lucide-react';

// Import step components
import ChannelPreferencesStep from './wizard-steps/ChannelPreferencesStep';
import InteractionStyleStep from './wizard-steps/InteractionStyleStep';
import BoundariesStep from './wizard-steps/BoundariesStep';
import EnergyManagementStep from './wizard-steps/EnergyManagementStep';
import VisibilitySettingsStep from './wizard-steps/VisibilitySettingsStep';

interface ProfileEditorProps {
  profile: CommunicationProfile;
  onUpdate: (updates: Partial<CommunicationProfile>) => void;
  onCancel: () => void;
}

const ProfileEditor = ({ profile, onUpdate, onCancel }: ProfileEditorProps) => {
  const [updatedProfile, setUpdatedProfile] = useState<CommunicationProfile>({...profile});
  const [activeTab, setActiveTab] = useState('channels');

  const handleUpdateProfile = () => {
    onUpdate(updatedProfile);
  };

  const updateProfileField = <K extends keyof CommunicationProfile>(
    field: K,
    value: CommunicationProfile[K]
  ) => {
    setUpdatedProfile(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date()
    }));
  };

  // Create a combined update handler for the visibility settings step
  const handleVisibilityUpdate = (updates: { 
    visibilitySettings: CommunicationProfile['visibilitySettings'];
    profileName?: string;
    isDefault?: boolean;
  }) => {
    setUpdatedProfile(prev => ({
      ...prev,
      visibilitySettings: updates.visibilitySettings,
      profileName: updates.profileName ?? prev.profileName,
      isDefault: updates.isDefault ?? prev.isDefault,
      lastUpdated: new Date()
    }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Profile: {updatedProfile.profileName}</CardTitle>
        <CardDescription>
          Update your communication preferences and sharing settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="channels" className="flex flex-col items-center gap-1 py-2 h-auto">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">Channels</span>
              </TabsTrigger>
              <TabsTrigger value="interaction" className="flex flex-col items-center gap-1 py-2 h-auto">
                <Users className="h-4 w-4" />
                <span className="text-xs">Interaction</span>
              </TabsTrigger>
              <TabsTrigger value="boundaries" className="flex flex-col items-center gap-1 py-2 h-auto">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Boundaries</span>
              </TabsTrigger>
              <TabsTrigger value="energy" className="flex flex-col items-center gap-1 py-2 h-auto">
                <Battery className="h-4 w-4" />
                <span className="text-xs">Energy</span>
              </TabsTrigger>
              <TabsTrigger value="visibility" className="flex flex-col items-center gap-1 py-2 h-auto">
                <Eye className="h-4 w-4" />
                <span className="text-xs">Visibility</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="channels" className="px-6 py-4 border-t">
            <ChannelPreferencesStep
              channelPreferences={updatedProfile.channelPreferences}
              onChange={(channelPreferences) => updateProfileField('channelPreferences', channelPreferences)}
            />
          </TabsContent>
          
          <TabsContent value="interaction" className="px-6 py-4 border-t">
            <InteractionStyleStep
              interactionStyle={updatedProfile.interactionStyle}
              onChange={(interactionStyle) => updateProfileField('interactionStyle', interactionStyle)}
            />
          </TabsContent>
          
          <TabsContent value="boundaries" className="px-6 py-4 border-t">
            <BoundariesStep
              boundaries={updatedProfile.boundaries}
              onChange={(boundaries) => updateProfileField('boundaries', boundaries)}
            />
          </TabsContent>
          
          <TabsContent value="energy" className="px-6 py-4 border-t">
            <EnergyManagementStep
              energyManagement={updatedProfile.energyManagement}
              onChange={(energyManagement) => updateProfileField('energyManagement', energyManagement)}
            />
          </TabsContent>
          
          <TabsContent value="visibility" className="px-6 py-4 border-t">
            <VisibilitySettingsStep
              visibilitySettings={updatedProfile.visibilitySettings}
              profileName={updatedProfile.profileName}
              isDefault={updatedProfile.isDefault}
              onChange={handleVisibilityUpdate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6 px-6">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleUpdateProfile}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileEditor;