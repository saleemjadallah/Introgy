
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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

  // Predefined options for each category
  const energyDrainOptions = [
    "Large groups",
    "Small talk",
    "Unexpected calls",
    "Loud environments",
    "Networking events",
    "Being the center of attention",
    "Spontaneous plans",
    "Multitasking in social settings"
  ];

  const energyGainOptions = [
    "Reading",
    "Nature walks",
    "Deep conversations",
    "Creative projects",
    "Alone time",
    "Quiet environments",
    "Small gatherings with close friends",
    "Working on personal interests"
  ];

  const communicationStyleOptions = [
    "Thoughtful written communication with time to process",
    "One-on-one conversations on meaningful topics",
    "Listening more than speaking in group settings",
    "Preparing thoughts in advance before discussions",
    "Direct and to-the-point communication"
  ];

  const socialGoalOptions = [
    "Building deeper connections with fewer people",
    "Finding balance between solitude and socializing",
    "Developing authentic relationships",
    "Creating more meaningful social interactions",
    "Learning to set healthy boundaries"
  ];

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
          <div className="space-y-4">
            <h3 className="font-medium text-base">What drains your social energy the most?</h3>
            <p className="text-sm text-muted-foreground">Select up to 4 options</p>
            <div className="grid grid-cols-1 gap-2">
              {energyDrainOptions.map((option) => (
                <div 
                  key={option}
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    preferences.energyDrains.includes(option) 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'border hover:bg-secondary/50'
                  }`}
                  onClick={() => handleEnergyDrainToggle(option)}
                >
                  <div className="flex-1">{option}</div>
                  {preferences.energyDrains.includes(option) && (
                    <Check size={18} className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium text-base">What recharges your energy?</h3>
            <p className="text-sm text-muted-foreground">Select up to 4 options</p>
            <div className="grid grid-cols-1 gap-2">
              {energyGainOptions.map((option) => (
                <div 
                  key={option}
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    preferences.energyGains.includes(option) 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'border hover:bg-secondary/50'
                  }`}
                  onClick={() => handleEnergyGainToggle(option)}
                >
                  <div className="flex-1">{option}</div>
                  {preferences.energyGains.includes(option) && (
                    <Check size={18} className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium text-base">What's your preferred communication style?</h3>
            <RadioGroup 
              value={preferences.communicationStyle}
              onValueChange={(value) => setPreferences({...preferences, communicationStyle: value})}
              className="space-y-2"
            >
              {communicationStyleOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2 p-3 rounded-md border">
                  <RadioGroupItem value={option} id={`comm-${option}`} />
                  <Label htmlFor={`comm-${option}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-medium text-base">What are your social goals?</h3>
            <RadioGroup 
              value={preferences.socialGoals}
              onValueChange={(value) => setPreferences({...preferences, socialGoals: value})}
              className="space-y-2"
            >
              {socialGoalOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2 p-3 rounded-md border">
                  <RadioGroupItem value={option} id={`goal-${option}`} />
                  <Label htmlFor={`goal-${option}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
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
