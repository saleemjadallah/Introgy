
import { Button } from '@/components/ui/button';
import { CommunicationProfile } from '@/types/communication-preferences';
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';

interface WizardToolbarProps {
  onCancel: () => void;
  onComplete: () => void;
  onShowPhrases: () => void;
  generatedProfile: Partial<CommunicationProfile> | null;
  phrases: any;
}

const WizardToolbar = ({
  onCancel,
  onComplete,
  onShowPhrases,
  generatedProfile,
  phrases
}: WizardToolbarProps) => {
  return (
    <div className="flex justify-between border-t pt-6">
      <Button variant="outline" onClick={onCancel}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex gap-2">
        {generatedProfile && (
          <Button 
            variant="outline"
            onClick={onShowPhrases}
            disabled={!phrases}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Communication Phrases
          </Button>
        )}
        
        <Button 
          onClick={onComplete}
          disabled={!generatedProfile}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Save AI Profile
        </Button>
      </div>
    </div>
  );
};

export default WizardToolbar;
