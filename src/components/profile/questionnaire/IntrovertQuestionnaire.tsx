
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MultiSelectStep from "./MultiSelectStep";
import RadioSelectStep from "./RadioSelectStep";
import { 
  energyDrainOptions, 
  energyGainOptions, 
  communicationStyleOptions, 
  socialGoalOptions 
} from "./questionnaireData";

export type IntrovertPreferences = {
  energyDrains: string[];
  energyGains: string[];
  communicationStyle: string;
  socialGoals: string;
};

interface IntrovertQuestionnaireProps {
  onComplete: (preferences: IntrovertPreferences) => void;
  onSkip?: () => void;
}

const IntrovertQuestionnaire = ({ onComplete, onSkip }: IntrovertQuestionnaireProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<IntrovertPreferences>({
    energyDrains: [],
    energyGains: [],
    communicationStyle: "",
    socialGoals: "",
  });

  const handleEnergyDrainToggle = (value: string) => {
    setPreferences(prev => {
      const current = [...prev.energyDrains];
      if (current.includes(value)) {
        return { ...prev, energyDrains: current.filter(item => item !== value) };
      } else {
        if (current.length < 4) { // Limit to 4 selections
          return { ...prev, energyDrains: [...current, value] };
        } else {
          toast({
            title: "Selection limit reached",
            description: "You can select up to 4 options",
            duration: 3000,
          });
          return prev;
        }
      }
    });
  };

  const handleEnergyGainToggle = (value: string) => {
    setPreferences(prev => {
      const current = [...prev.energyGains];
      if (current.includes(value)) {
        return { ...prev, energyGains: current.filter(item => item !== value) };
      } else {
        if (current.length < 4) { // Limit to 4 selections
          return { ...prev, energyGains: [...current, value] };
        } else {
          toast({
            title: "Selection limit reached",
            description: "You can select up to 4 options",
            duration: 3000,
          });
          return prev;
        }
      }
    });
  };

  const handleNext = () => {
    if (step === 1 && preferences.energyDrains.length === 0) {
      toast({
        title: "Please select at least one option",
        description: "Select what drains your energy the most",
        duration: 3000,
      });
      return;
    }
    
    if (step === 2 && preferences.energyGains.length === 0) {
      toast({
        title: "Please select at least one option",
        description: "Select what recharges your energy",
        duration: 3000,
      });
      return;
    }
    
    if (step === 3 && !preferences.communicationStyle) {
      toast({
        title: "Please select an option",
        description: "Choose your preferred communication style",
        duration: 3000,
      });
      return;
    }
    
    if (step === 4 && !preferences.socialGoals) {
      toast({
        title: "Please select an option",
        description: "Choose your social goals",
        duration: 3000,
      });
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
      toast({
        title: "Profile updated!",
        description: "Your introvert preferences have been saved",
        duration: 3000,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Tell us about yourself</CardTitle>
        <CardDescription>
          This helps us personalize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <MultiSelectStep
            title="What drains your social energy the most?"
            subtitle="Select up to 4 options"
            options={energyDrainOptions}
            selectedItems={preferences.energyDrains}
            onToggleItem={handleEnergyDrainToggle}
          />
        )}

        {step === 2 && (
          <MultiSelectStep
            title="What recharges your energy?"
            subtitle="Select up to 4 options"
            options={energyGainOptions}
            selectedItems={preferences.energyGains}
            onToggleItem={handleEnergyGainToggle}
          />
        )}

        {step === 3 && (
          <RadioSelectStep
            title="What's your preferred communication style?"
            options={communicationStyleOptions}
            selectedValue={preferences.communicationStyle}
            onValueChange={(value) => setPreferences({...preferences, communicationStyle: value})}
          />
        )}

        {step === 4 && (
          <RadioSelectStep
            title="What are your social goals?"
            options={socialGoalOptions}
            selectedValue={preferences.socialGoals}
            onValueChange={(value) => setPreferences({...preferences, socialGoals: value})}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onSkip}>
              Skip for now
            </Button>
          )}
        </div>
        <Button onClick={handleNext}>
          {step < 4 ? (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IntrovertQuestionnaire;
