import { useState } from 'react';
import { EnergyManagement } from '@/types/communication-preferences';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

interface EnergyManagementStepProps {
  energyManagement: EnergyManagement;
  onChange: (energyManagement: EnergyManagement) => void;
}

const EnergyManagementStep = ({ energyManagement, onChange }: EnergyManagementStepProps) => {
  const [newDepletionSignal, setNewDepletionSignal] = useState('');
  const [newExitPhrase, setNewExitPhrase] = useState('');

  const addDepletionSignal = () => {
    if (newDepletionSignal.trim() && !energyManagement.depletionSignals.includes(newDepletionSignal.trim())) {
      onChange({
        ...energyManagement,
        depletionSignals: [...energyManagement.depletionSignals, newDepletionSignal.trim()]
      });
      setNewDepletionSignal('');
    }
  };

  const removeDepletionSignal = (signal: string) => {
    onChange({
      ...energyManagement,
      depletionSignals: energyManagement.depletionSignals.filter(s => s !== signal)
    });
  };

  const addExitPhrase = () => {
    if (newExitPhrase.trim() && !energyManagement.exitPhrases.includes(newExitPhrase.trim())) {
      onChange({
        ...energyManagement,
        exitPhrases: [...energyManagement.exitPhrases, newExitPhrase.trim()]
      });
      setNewExitPhrase('');
    }
  };

  const removeExitPhrase = (phrase: string) => {
    onChange({
      ...energyManagement,
      exitPhrases: energyManagement.exitPhrases.filter(p => p !== phrase)
    });
  };

  const handleRecoveryChange = (key: 'afterSmallEvent' | 'afterLargeEvent', hours: number) => {
    onChange({
      ...energyManagement,
      recoveryNeeds: {
        ...energyManagement.recoveryNeeds,
        [key]: hours
      }
    });
  };

  const handleCheckInChange = (value: 'none' | 'subtle' | 'direct') => {
    onChange({
      ...energyManagement,
      checkInPreference: value
    });
  };

  const formatHours = (hours: number) => {
    if (hours < 1) {
      return `${hours * 60} minutes`;
    }
    if (hours === 1) {
      return '1 hour';
    }
    if (hours < 24) {
      return `${hours} hours`;
    }
    if (hours === 24) {
      return '1 day';
    }
    return `${hours} hours`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Energy Depletion Signals</h3>
          <p className="text-sm text-muted-foreground">
            Help others recognize when your social battery is getting low.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {energyManagement.depletionSignals.map(signal => (
              <Badge key={signal} variant="secondary" className="flex items-center gap-1">
                {signal}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => removeDepletionSignal(signal)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {energyManagement.depletionSignals.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No signals added yet</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a depletion signal (e.g., 'Checking phone frequently')"
              value={newDepletionSignal}
              onChange={(e) => setNewDepletionSignal(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDepletionSignal();
                }
              }}
            />
            <Button 
              variant="outline" 
              onClick={addDepletionSignal}
              disabled={!newDepletionSignal.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Exit Phrases</h3>
          <p className="text-sm text-muted-foreground">
            Phrases you use when you need to exit social situations gracefully.
          </p>
        </div>
        
        <div className="space-y-3">
          {energyManagement.exitPhrases.map((phrase, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-accent/20 rounded-md">
              <span className="flex-1">"{phrase}"</span>
              <Button variant="ghost" size="icon" onClick={() => removeExitPhrase(phrase)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {energyManagement.exitPhrases.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No exit phrases added yet</p>
          )}
          
          <div className="space-y-2">
            <Textarea
              placeholder="Add a phrase you use to exit conversations (e.g., 'I should get going, but it was great to chat')"
              value={newExitPhrase}
              onChange={(e) => setNewExitPhrase(e.target.value)}
              className="resize-none"
              rows={2}
            />
            <Button 
              variant="outline" 
              onClick={addExitPhrase}
              disabled={!newExitPhrase.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Exit Phrase
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Recovery Needs</h3>
          <p className="text-sm text-muted-foreground">
            How long you typically need to recharge after social interactions.
          </p>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="small-event">After small interactions (1-3 people)</Label>
              <span className="text-sm font-medium">
                {formatHours(energyManagement.recoveryNeeds.afterSmallEvent)}
              </span>
            </div>
            <Slider
              id="small-event"
              min={0.5}
              max={12}
              step={0.5}
              value={[energyManagement.recoveryNeeds.afterSmallEvent]}
              onValueChange={(value) => handleRecoveryChange('afterSmallEvent', value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="large-event">After large events (groups, parties)</Label>
              <span className="text-sm font-medium">
                {formatHours(energyManagement.recoveryNeeds.afterLargeEvent)}
              </span>
            </div>
            <Slider
              id="large-event"
              min={1}
              max={72}
              step={1}
              value={[energyManagement.recoveryNeeds.afterLargeEvent]}
              onValueChange={(value) => handleRecoveryChange('afterLargeEvent', value[0])}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Check-In Preferences</h3>
          <p className="text-sm text-muted-foreground">
            How you prefer others to check on your energy levels during interactions.
          </p>
        </div>
        
        <Select 
          value={energyManagement.checkInPreference} 
          onValueChange={(value: 'none' | 'subtle' | 'direct') => handleCheckInChange(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your check-in preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None - I'll indicate when I need to leave</SelectItem>
            <SelectItem value="subtle">Subtle - Appreciate non-verbal cues about timing</SelectItem>
            <SelectItem value="direct">Direct - Feel free to ask if I need a break</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-muted-foreground mt-2">
          {energyManagement.checkInPreference === 'none' && (
            "You prefer to manage your own energy levels without others checking in."
          )}
          {energyManagement.checkInPreference === 'subtle' && (
            "You appreciate subtle check-ins like 'We've been talking a while, should we wrap up soon?'"
          )}
          {energyManagement.checkInPreference === 'direct' && (
            "You're comfortable with direct questions like 'How's your energy level? Need a break?'"
          )}
        </div>
      </div>
    </div>
  );
};

export default EnergyManagementStep;