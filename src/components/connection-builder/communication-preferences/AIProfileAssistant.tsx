
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAICommunicationAssistant } from '@/hooks/useAICommunicationAssistant';
import { CommunicationProfile } from '@/types/communication-preferences';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import sub-components
import TabNavigation from './ai-assistant/TabNavigation';
import CreateProfileTab from './ai-assistant/CreateProfileTab';
import EnhanceProfileTab from './ai-assistant/EnhanceProfileTab';
import PhrasesTab from './ai-assistant/PhrasesTab';

interface AIProfileAssistantProps {
  profile?: Partial<CommunicationProfile>;
  onProfileGenerated?: (profile: Partial<CommunicationProfile>) => void;
  onEnhancementsGenerated?: (enhancements: any) => void;
  onPhrasesGenerated?: (phrases: any) => void;
}

const AIProfileAssistant = ({
  profile,
  onProfileGenerated,
  onEnhancementsGenerated,
  onPhrasesGenerated
}: AIProfileAssistantProps) => {
  const [activeTab, setActiveTab] = useState('create');
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [socialPreferences, setSocialPreferences] = useState('');
  const [energyLevels, setEnergyLevels] = useState('');
  const [situationContext, setSituationContext] = useState('');
  
  const { generateProfile, enhanceProfile, generatePhrases, isLoading } = useAICommunicationAssistant();
  const { toast } = useToast();

  const handleGenerateProfile = async () => {
    try {
      const generatedProfile = await generateProfile({
        communicationStyle,
        socialPreferences,
        energyLevels,
        situationContext
      });
      
      if (onProfileGenerated) {
        onProfileGenerated(generatedProfile);
      }
      
      toast({
        title: 'Profile generated!',
        description: 'Your communication profile has been created with AI assistance',
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEnhanceProfile = async () => {
    if (!profile) {
      toast({
        title: 'No profile to enhance',
        description: 'Please create or select a profile first',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const enhancements = await enhanceProfile({
        existingProfile: profile,
        situationContext
      });
      
      if (onEnhancementsGenerated) {
        onEnhancementsGenerated(enhancements);
      }
      
      toast({
        title: 'Profile enhanced!',
        description: 'AI suggestions for improving your communication profile are ready',
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleGeneratePhrases = async () => {
    try {
      const phrases = await generatePhrases({
        existingProfile: profile,
        communicationStyle,
        situationContext
      });
      
      if (onPhrasesGenerated) {
        onPhrasesGenerated(phrases);
      }
      
      toast({
        title: 'Phrases generated!',
        description: 'Your personalized communication phrases are ready',
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Communication Assistant
        </CardTitle>
        <CardDescription>
          Use AI to help create and enhance your communication profile
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabNavigation
            activeTab={activeTab}
            profile={profile}
          />
          
          <TabsContent value="create" className="space-y-4 mt-4">
            <CreateProfileTab
              communicationStyle={communicationStyle}
              socialPreferences={socialPreferences}
              energyLevels={energyLevels}
              situationContext={situationContext}
              isLoading={isLoading}
              onCommunicationStyleChange={setCommunicationStyle}
              onSocialPreferencesChange={setSocialPreferences}
              onEnergyLevelsChange={setEnergyLevels}
              onSituationContextChange={setSituationContext}
              onGenerateProfile={handleGenerateProfile}
            />
          </TabsContent>
          
          <TabsContent value="enhance" className="space-y-4 mt-4">
            <EnhanceProfileTab
              profile={profile}
              situationContext={situationContext}
              isLoading={isLoading}
              onSituationContextChange={setSituationContext}
              onEnhanceProfile={handleEnhanceProfile}
            />
          </TabsContent>
          
          <TabsContent value="phrases" className="space-y-4 mt-4">
            <PhrasesTab
              profile={profile}
              communicationStyle={communicationStyle}
              situationContext={situationContext}
              isLoading={isLoading}
              onCommunicationStyleChange={setCommunicationStyle}
              onSituationContextChange={setSituationContext}
              onGeneratePhrases={handleGeneratePhrases}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        {/* Footer content moved into individual tab components */}
      </CardFooter>
    </Card>
  );
};

export default AIProfileAssistant;
