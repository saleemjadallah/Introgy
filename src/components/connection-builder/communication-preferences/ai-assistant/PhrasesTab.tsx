
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RefreshCw, Sparkles } from 'lucide-react';
import { CommunicationProfile } from '@/types/communication-preferences';

interface PhrasesTabProps {
  profile: Partial<CommunicationProfile> | undefined;
  communicationStyle: string;
  situationContext: string;
  isLoading: boolean;
  onCommunicationStyleChange: (value: string) => void;
  onSituationContextChange: (value: string) => void;
  onGeneratePhrases: () => void;
}

const PhrasesTab = ({
  profile,
  communicationStyle,
  situationContext,
  isLoading,
  onCommunicationStyleChange,
  onSituationContextChange,
  onGeneratePhrases
}: PhrasesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phrasesStyle">Communication style for phrases</Label>
        <Textarea 
          id="phrasesStyle" 
          placeholder="Example: Professional but warm, direct but kind, casual and friendly..."
          value={communicationStyle}
          onChange={(e) => onCommunicationStyleChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phrasesContext">Situation context for phrases</Label>
        <Textarea 
          id="phrasesContext" 
          placeholder="Example: Work meetings, social gatherings, online communication..."
          value={situationContext}
          onChange={(e) => onSituationContextChange(e.target.value)}
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

      <Button 
        onClick={onGeneratePhrases} 
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
    </div>
  );
};

export default PhrasesTab;
