
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Sparkles } from 'lucide-react';
import { CommunicationProfile } from '@/types/communication-preferences';

interface EnhanceProfileTabProps {
  profile: Partial<CommunicationProfile> | undefined;
  situationContext: string;
  isLoading: boolean;
  onSituationContextChange: (value: string) => void;
  onEnhanceProfile: () => void;
}

const EnhanceProfileTab = ({
  profile,
  situationContext,
  isLoading,
  onSituationContextChange,
  onEnhanceProfile
}: EnhanceProfileTabProps) => {
  if (!profile) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Please select a profile to enhance
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          onChange={(e) => onSituationContextChange(e.target.value)}
        />
      </div>

      <Button 
        onClick={onEnhanceProfile} 
        className="w-full"
        disabled={isLoading}
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
    </div>
  );
};

export default EnhanceProfileTab;
