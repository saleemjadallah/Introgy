
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommunicationProfile } from '@/types/communication-preferences';
import { useAICommunicationAssistant } from '@/hooks/useAICommunicationAssistant';
import AIProfileAssistant from './AIProfileAssistant';
import AIEnhancementsDialog from './AIEnhancementsDialog';
import AIPhrasesDialog from './AIPhrasesDialog';
import { ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';

interface AIProfileWizardProps {
  initialProfile?: Partial<CommunicationProfile>;
  onComplete: (profile: CommunicationProfile) => void;
  onCancel: () => void;
}

const AIProfileWizard = ({
  initialProfile,
  onComplete,
  onCancel
}: AIProfileWizardProps) => {
  const [generatedProfile, setGeneratedProfile] = useState<Partial<CommunicationProfile> | null>(null);
  const [enhancements, setEnhancements] = useState<any>(null);
  const [showEnhancementsDialog, setShowEnhancementsDialog] = useState(false);
  const [phrases, setPhrases] = useState<any>(null);
  const [showPhrasesDialog, setShowPhrasesDialog] = useState(false);
  
  const handleProfileGenerated = (profile: Partial<CommunicationProfile>) => {
    setGeneratedProfile({
      ...profile,
      profileId: initialProfile?.profileId || crypto.randomUUID(),
      userId: initialProfile?.userId || 'current-user',
      profileName: initialProfile?.profileName || 'My AI-Generated Profile',
      isDefault: initialProfile?.isDefault || false,
      lastUpdated: new Date(),
    });
  };
  
  const handleEnhancementsGenerated = (enhancementsData: any) => {
    setEnhancements(enhancementsData);
    setShowEnhancementsDialog(true);
  };
  
  const handlePhrasesGenerated = (phrasesData: any) => {
    setPhrases(phrasesData);
    setShowPhrasesDialog(true);
  };
  
  const handleApplyEnhancements = (updatedProfile: Partial<CommunicationProfile>) => {
    setGeneratedProfile(updatedProfile);
  };
  
  const handleComplete = () => {
    if (generatedProfile) {
      // Convert any non-standard types to match expected format
      const completeProfile: CommunicationProfile = {
        ...generatedProfile as CommunicationProfile,
        lastUpdated: new Date()
      };
      
      onComplete(completeProfile);
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Communication Profile Generator
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <AIProfileAssistant
            profile={generatedProfile || initialProfile}
            onProfileGenerated={handleProfileGenerated}
            onEnhancementsGenerated={handleEnhancementsGenerated}
            onPhrasesGenerated={handlePhrasesGenerated}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {generatedProfile && (
              <Button 
                variant="outline"
                onClick={() => setShowPhrasesDialog(true)}
                disabled={!phrases}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Communication Phrases
              </Button>
            )}
            
            <Button 
              onClick={handleComplete}
              disabled={!generatedProfile}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Save AI Profile
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {enhancements && (
        <AIEnhancementsDialog
          isOpen={showEnhancementsDialog}
          onClose={() => setShowEnhancementsDialog(false)}
          enhancements={enhancements}
          profile={generatedProfile || initialProfile!}
          onApplyEnhancements={handleApplyEnhancements}
        />
      )}
      
      {phrases && (
        <AIPhrasesDialog
          isOpen={showPhrasesDialog}
          onClose={() => setShowPhrasesDialog(false)}
          phrases={phrases}
        />
      )}
    </>
  );
};

export default AIProfileWizard;
