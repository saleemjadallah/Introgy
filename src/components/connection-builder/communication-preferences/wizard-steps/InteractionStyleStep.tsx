import { useState } from 'react';
import { InteractionStyle } from '@/types/communication-preferences';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InteractionStyleStepProps {
  interactionStyle: InteractionStyle;
  onChange: (interactionStyle: InteractionStyle) => void;
}

const InteractionStyleStep = ({ interactionStyle, onChange }: InteractionStyleStepProps) => {
  const [newPreferredTopic, setNewPreferredTopic] = useState('');
  const [newAvoidTopic, setNewAvoidTopic] = useState('');

  const handleDepthChange = (value: number[]) => {
    onChange({
      ...interactionStyle,
      conversationDepth: value[0]
    });
  };

  const handlePreparationChange = (value: number[]) => {
    onChange({
      ...interactionStyle,
      preparationNeeded: value[0]
    });
  };

  const handleInterruptionChange = (value: number[]) => {
    onChange({
      ...interactionStyle,
      interruptionComfort: value[0]
    });
  };

  const addPreferredTopic = () => {
    if (newPreferredTopic.trim() && !interactionStyle.preferredTopics.includes(newPreferredTopic.trim())) {
      onChange({
        ...interactionStyle,
        preferredTopics: [...interactionStyle.preferredTopics, newPreferredTopic.trim()]
      });
      setNewPreferredTopic('');
    }
  };

  const removePreferredTopic = (topic: string) => {
    onChange({
      ...interactionStyle,
      preferredTopics: interactionStyle.preferredTopics.filter(t => t !== topic)
    });
  };

  const addAvoidTopic = () => {
    if (newAvoidTopic.trim() && !interactionStyle.avoidTopics.includes(newAvoidTopic.trim())) {
      onChange({
        ...interactionStyle,
        avoidTopics: [...interactionStyle.avoidTopics, newAvoidTopic.trim()]
      });
      setNewAvoidTopic('');
    }
  };

  const removeAvoidTopic = (topic: string) => {
    onChange({
      ...interactionStyle,
      avoidTopics: interactionStyle.avoidTopics.filter(t => t !== topic)
    });
  };

  const getInterruptionLabel = (value: number) => {
    if (value <= 2) return "I prefer uninterrupted speaking time";
    if (value <= 4) return "Occasional interruptions are ok";
    if (value <= 6) return "Some back-and-forth is fine";
    if (value <= 8) return "Interactive conversation is good";
    return "Free-flowing conversation is best";
  };

  const getDepthLabel = (value: number) => {
    if (value <= 2) return "Light, casual conversation";
    if (value <= 4) return "Mix of casual and meaningful";
    if (value <= 6) return "Moderate depth, some substance";
    if (value <= 8) return "Meaningful, thoughtful discussions";
    return "Deep, philosophical conversations";
  };

  const getPreparationLabel = (value: number) => {
    if (value <= 2) return "Minimal preparation needed";
    if (value <= 4) return "A little notice helps";
    if (value <= 6) return "Some time to prepare is ideal";
    if (value <= 8) return "I prefer to prepare in advance";
    return "Significant preparation time needed";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Conversation Depth</h3>
          <p className="text-sm text-muted-foreground">
            How deep or casual do you prefer your conversations to be?
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Small talk</span>
            <span>Deep conversations</span>
          </div>
          <Slider
            value={[interactionStyle.conversationDepth]}
            min={1}
            max={10}
            step={1}
            onValueChange={handleDepthChange}
          />
          <div className="flex justify-center mt-1">
            <p className="text-sm">{getDepthLabel(interactionStyle.conversationDepth)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Preferred Topics</h3>
          <p className="text-sm text-muted-foreground">
            Topics you enjoy discussing and are comfortable with (up to 5).
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {interactionStyle.preferredTopics.map(topic => (
            <Badge key={topic} variant="secondary" className="flex items-center gap-1">
              {topic}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => removePreferredTopic(topic)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {interactionStyle.preferredTopics.length === 0 && (
            <span className="text-sm text-muted-foreground italic">No preferred topics added yet</span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a preferred topic"
            value={newPreferredTopic}
            onChange={(e) => setNewPreferredTopic(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addPreferredTopic();
              }
            }}
          />
          <Button 
            variant="outline" 
            onClick={addPreferredTopic}
            disabled={interactionStyle.preferredTopics.length >= 5 || !newPreferredTopic.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Topics to Avoid</h3>
          <p className="text-sm text-muted-foreground">
            Topics you prefer not to discuss or find uncomfortable (up to 5).
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {interactionStyle.avoidTopics.map(topic => (
            <Badge key={topic} variant="destructive" className="flex items-center gap-1">
              {topic}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => removeAvoidTopic(topic)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {interactionStyle.avoidTopics.length === 0 && (
            <span className="text-sm text-muted-foreground italic">No topics to avoid added yet</span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a topic to avoid"
            value={newAvoidTopic}
            onChange={(e) => setNewAvoidTopic(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addAvoidTopic();
              }
            }}
          />
          <Button 
            variant="outline" 
            onClick={addAvoidTopic}
            disabled={interactionStyle.avoidTopics.length >= 5 || !newAvoidTopic.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Preparation Needed</h3>
          <p className="text-sm text-muted-foreground">
            How much preparation time do you need for comfortable social interaction?
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Minimal</span>
            <span>Extensive</span>
          </div>
          <Slider
            value={[interactionStyle.preparationNeeded]}
            min={1}
            max={10}
            step={1}
            onValueChange={handlePreparationChange}
          />
          <div className="flex justify-center mt-1">
            <p className="text-sm">{getPreparationLabel(interactionStyle.preparationNeeded)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Interruption Comfort</h3>
          <p className="text-sm text-muted-foreground">
            How comfortable are you with interruptions during conversation?
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Need space to finish thoughts</span>
            <span>Interactive back-and-forth</span>
          </div>
          <Slider
            value={[interactionStyle.interruptionComfort]}
            min={1}
            max={10}
            step={1}
            onValueChange={handleInterruptionChange}
          />
          <div className="flex justify-center mt-1">
            <p className="text-sm">{getInterruptionLabel(interactionStyle.interruptionComfort)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionStyleStep;