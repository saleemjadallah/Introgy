import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommunicationProfile } from '@/types/communication-preferences';
import { v4 as uuidv4 } from 'uuid';

// Import wizard steps
import ChannelPreferencesStep from './wizard-steps/ChannelPreferencesStep';
import InteractionStyleStep from './wizard-steps/InteractionStyleStep';
import BoundariesStep from './wizard-steps/BoundariesStep';
import EnergyManagementStep from './wizard-steps/EnergyManagementStep';
import VisibilitySettingsStep from './wizard-steps/VisibilitySettingsStep';

interface ProfileWizardProps {
  initialProfile?: Partial<CommunicationProfile>;
  onComplete: (profile: CommunicationProfile) => void;
  onCancel: () => void;
}

const ProfileWizard = ({ initialProfile, onComplete, onCancel }: ProfileWizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<CommunicationProfile>>(
    initialProfile || {
      profileId: uuidv4(),
      userId: 'current-user', // Placeholder, would normally come from auth
      profileName: 'My Communication Style',
      isDefault: false,
      lastUpdated: new Date(),
      
      channelPreferences: {
        rankedChannels: [
          { channel: 'Text/Messaging', preference: 1 },
          { channel: 'Email', preference: 2 },
          { channel: 'Video Call', preference: 3 },
          { channel: 'Voice Call', preference: 4 },
          { channel: 'In-person', preference: 5 }
        ],
        responseTimeframes: {
          email: 24,
          text: 4,
          voiceCall: 24,
          videoCall: 24,
        },
        urgencyOverrides: {
          allowCall: true,
          urgentResponseTime: 60,
        }
      },
      
      interactionStyle: {
        conversationDepth: 5,
        preferredTopics: [],
        avoidTopics: [],
        preparationNeeded: 5,
        interruptionComfort: 5
      },
      
      boundaries: {
        groupSizePreference: {
          min: 1,
          ideal: 3,
          max: 6
        },
        durationLimits: {
          idealDuration: 60,
          maxDuration: 120,
          breakFrequency: 45
        },
        advanceNotice: {
          preferred: 2,
          minimum: 1
        }
      },
      
      energyManagement: {
        depletionSignals: [],
        exitPhrases: [],
        recoveryNeeds: {
          afterSmallEvent: 2,
          afterLargeEvent: 24
        },
        checkInPreference: 'subtle'
      },
      
      visibilitySettings: {
        channelPreferences: 'public',
        interactionStyle: 'public',
        boundaries: 'friends',
        energyManagement: 'private'
      }
    }
  );

  const totalSteps = 5;

  const updateProfile = (updates: Partial<CommunicationProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date(),
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (validateFinalProfile()) {
        onComplete(profile as CommunicationProfile);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const validateFinalProfile = (): boolean => {
    // Basic validation
    if (!profile.profileName?.trim()) {
      toast({
        title: 'Missing profile name',
        description: 'Please provide a name for your communication profile.',
        variant: 'destructive',
      });
      return false;
    }

    // More validations could be added here

    return true;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your Communication Profile</CardTitle>
        <CardDescription>
          Step {step} of {totalSteps}: 
          {step === 1 && ' Define your preferred communication channels and response times'}
          {step === 2 && ' Set your interaction style and conversation preferences'}
          {step === 3 && ' Establish your social boundaries and group preferences'}
          {step === 4 && ' Share how you manage your social energy'}
          {step === 5 && ' Choose what information to share with others'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-3 pb-6">
        {step === 1 && (
          <ChannelPreferencesStep
            channelPreferences={profile.channelPreferences!}
            onChange={(channelPreferences) => updateProfile({ channelPreferences })}
          />
        )}
        
        {step === 2 && (
          <InteractionStyleStep
            interactionStyle={profile.interactionStyle!}
            onChange={(interactionStyle) => updateProfile({ interactionStyle })}
          />
        )}
        
        {step === 3 && (
          <BoundariesStep
            boundaries={profile.boundaries!}
            onChange={(boundaries) => updateProfile({ boundaries })}
          />
        )}
        
        {step === 4 && (
          <EnergyManagementStep
            energyManagement={profile.energyManagement!}
            onChange={(energyManagement) => updateProfile({ energyManagement })}
          />
        )}
        
        {step === 5 && (
          <VisibilitySettingsStep
            visibilitySettings={profile.visibilitySettings!}
            profileName={profile.profileName!}
            isDefault={profile.isDefault!}
            onChange={(updates) => updateProfile(updates)}
          />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <div>
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        
        <Button onClick={handleNext}>
          {step < totalSteps ? (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Save Profile
              <Save className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileWizard;