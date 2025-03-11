
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Sparkles } from 'lucide-react';

interface CreateProfileTabProps {
  communicationStyle: string;
  socialPreferences: string;
  energyLevels: string;
  situationContext: string;
  isLoading: boolean;
  onCommunicationStyleChange: (value: string) => void;
  onSocialPreferencesChange: (value: string) => void;
  onEnergyLevelsChange: (value: string) => void;
  onSituationContextChange: (value: string) => void;
  onGenerateProfile: () => void;
}

const CreateProfileTab = ({
  communicationStyle,
  socialPreferences,
  energyLevels,
  situationContext,
  isLoading,
  onCommunicationStyleChange,
  onSocialPreferencesChange,
  onEnergyLevelsChange,
  onSituationContextChange,
  onGenerateProfile
}: CreateProfileTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="communicationStyle">Describe your communication style</Label>
        <Textarea 
          id="communicationStyle" 
          placeholder="Example: I'm direct but friendly, prefer clarity over politeness, and need time to process new information..."
          value={communicationStyle}
          onChange={(e) => onCommunicationStyleChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="socialPreferences">Social preferences</Label>
        <Textarea 
          id="socialPreferences" 
          placeholder="Example: I prefer small groups, one-on-one conversations, advance notice for social events..."
          value={socialPreferences}
          onChange={(e) => onSocialPreferencesChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="energyLevels">Energy levels and recovery needs</Label>
        <Textarea 
          id="energyLevels" 
          placeholder="Example: Social events drain my energy quickly, I need alone time to recharge, I get overwhelmed in loud environments..."
          value={energyLevels}
          onChange={(e) => onEnergyLevelsChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="situationContext">Specific situation or context (optional)</Label>
        <Input 
          id="situationContext" 
          placeholder="Example: Work environment, family gatherings, dating, etc."
          value={situationContext}
          onChange={(e) => onSituationContextChange(e.target.value)}
        />
      </div>

      <Button 
        onClick={onGenerateProfile} 
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
    </div>
  );
};

export default CreateProfileTab;
