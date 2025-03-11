
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunicationProfile } from '@/types/communication-preferences';
import AIProfileAssistant from './AIProfileAssistant';
import { Sparkles } from 'lucide-react';
import WizardToolbar from './ai-assistant/WizardToolbar';
import EnhancementsDialog from './ai-assistant/dialogs/EnhancementsDialog';
import PhrasesDialog from './ai-assistant/dialogs/PhrasesDialog';

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
        
        <CardFooter>
          <WizardToolbar 
            onCancel={onCancel}
            onComplete={handleComplete}
            onShowPhrases={() => setShowPhrasesDialog(true)}
            generatedProfile={generatedProfile}
            phrases={phrases}
          />
        </CardFooter>
      </Card>
      
      <EnhancementsDialog
        isOpen={showEnhancementsDialog}
        onClose={() => setShowEnhancementsDialog(false)}
        enhancements={enhancements}
        profile={generatedProfile || initialProfile!}
        onApplyEnhancements={handleApplyEnhancements}
      />
      
      <PhrasesDialog
        isOpen={showPhrasesDialog}
        onClose={() => setShowPhrasesDialog(false)}
        phrases={phrases}
      />
    </>
  );
};

export default AIProfileWizard;
