
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAICommunicationAssistant } from '@/hooks/useAICommunicationAssistant';
import { CommunicationProfile } from '@/types/communication-preferences';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Lightbulb, MessageCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Create Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="enhance" 
              className="flex items-center gap-1"
              disabled={!profile}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Enhance Profile</span>
            </TabsTrigger>
            <TabsTrigger value="phrases" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>Generate Phrases</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="communicationStyle">Describe your communication style</Label>
              <Textarea 
                id="communicationStyle" 
                placeholder="Example: I'm direct but friendly, prefer clarity over politeness, and need time to process new information..."
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="socialPreferences">Social preferences</Label>
              <Textarea 
                id="socialPreferences" 
                placeholder="Example: I prefer small groups, one-on-one conversations, advance notice for social events..."
                value={socialPreferences}
                onChange={(e) => setSocialPreferences(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energyLevels">Energy levels and recovery needs</Label>
              <Textarea 
                id="energyLevels" 
                placeholder="Example: Social events drain my energy quickly, I need alone time to recharge, I get overwhelmed in loud environments..."
                value={energyLevels}
                onChange={(e) => setEnergyLevels(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="situationContext">Specific situation or context (optional)</Label>
              <Input 
                id="situationContext" 
                placeholder="Example: Work environment, family gatherings, dating, etc."
                value={situationContext}
                onChange={(e) => setSituationContext(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="enhance" className="space-y-4 mt-4">
            {profile ? (
              <>
                <div className="p-4 border rounded-md bg-muted/50">
                  <h4 className="font-medium mb-2">Current Profile: {profile.profileName}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline" className="justify-start">
                      {profile.channelPreferences?.rankedChannels?.[0]?.channel || 'No channel preference'}
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      Conversation depth: {profile.interactionStyle?.conversationDepth || '?'}/10
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      Ideal group: {profile.boundaries?.groupSizePreference?.ideal || '?'} people
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      Recovery: {profile.energyManagement?.recoveryNeeds?.afterSmallEvent || '?'} hrs
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="enhanceContext">What would you like to improve?</Label>
                  <Textarea 
                    id="enhanceContext" 
                    placeholder="Example: Make it more suitable for professional settings, help me be more direct, etc."
                    value={situationContext}
                    onChange={(e) => setSituationContext(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Please select a profile to enhance
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="phrases" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="phrasesStyle">Communication style for phrases</Label>
              <Textarea 
                id="phrasesStyle" 
                placeholder="Example: Professional but warm, direct but kind, casual and friendly..."
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phrasesContext">Situation context for phrases</Label>
              <Textarea 
                id="phrasesContext" 
                placeholder="Example: Work meetings, social gatherings, online communication..."
                value={situationContext}
                onChange={(e) => setSituationContext(e.target.value)}
              />
            </div>
            
            {profile && (
              <div className="p-4 border rounded-md bg-muted/50">
                <h4 className="font-medium mb-2">Using profile: {profile.profileName}</h4>
                <p className="text-sm text-muted-foreground">
                  Your phrases will be based on your existing profile preferences
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        {activeTab === 'create' && (
          <Button 
            onClick={handleGenerateProfile} 
            className="w-full"
            disabled={isLoading || (!communicationStyle && !socialPreferences && !energyLevels)}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Profile
              </>
            )}
          </Button>
        )}
        
        {activeTab === 'enhance' && (
          <Button 
            onClick={handleEnhanceProfile} 
            className="w-full"
            disabled={isLoading || !profile}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Enhance with AI
              </>
            )}
          </Button>
        )}
        
        {activeTab === 'phrases' && (
          <Button 
            onClick={handleGeneratePhrases} 
            className="w-full"
            disabled={isLoading || (!communicationStyle && !situationContext && !profile)}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Phrases
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIProfileAssistant;
