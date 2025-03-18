import { useState } from 'react';
import { ChannelPreferences, ChannelPreference } from '@/types/communication-preferences';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface ChannelPreferencesStepProps {
  channelPreferences: ChannelPreferences;
  onChange: (channelPreferences: ChannelPreferences) => void;
}

const ChannelPreferencesStep = ({ 
  channelPreferences, 
  onChange 
}: ChannelPreferencesStepProps) => {
  const [channels, setChannels] = useState(
    [...channelPreferences.rankedChannels].sort((a, b) => a.preference - b.preference)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setChannels((items) => {
        const oldIndex = items.findIndex(item => item.channel === active.id);
        const newIndex = items.findIndex(item => item.channel === over.id);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Update preferences based on new order
        const updatedChannels = newArray.map((item, index) => ({
          ...item,
          preference: index + 1
        }));
        
        // Update the parent
        onChange({
          ...channelPreferences,
          rankedChannels: updatedChannels
        });
        
        return updatedChannels;
      });
    }
  };

  const handleResponseTimeChange = (channel: 'email' | 'text' | 'voiceCall' | 'videoCall', hours: number) => {
    onChange({
      ...channelPreferences,
      responseTimeframes: {
        ...channelPreferences.responseTimeframes,
        [channel]: hours
      }
    });
  };

  const handleUrgencyChange = (key: 'allowCall' | 'urgentResponseTime', value: boolean | number) => {
    onChange({
      ...channelPreferences,
      urgencyOverrides: {
        ...channelPreferences.urgencyOverrides,
        [key]: value
      }
    });
  };

  const getTimeLabel = (hours: number) => {
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
    if (hours % 24 === 0) {
      return `${hours / 24} days`;
    }
    return `${hours} hours`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Communication Channel Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Drag to rank your preferred communication channels from most to least preferred.
          </p>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={channels.map(c => c.channel)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 border rounded-lg p-4">
              {channels.map((channel) => (
                <SortableChannelItem
                  key={channel.channel}
                  channel={channel}
                  index={channel.preference}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Response Time Expectations</h3>
          <p className="text-sm text-muted-foreground">
            Set your typical response times for different communication channels.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-response">Email</Label>
              <span className="text-sm">
                {getTimeLabel(channelPreferences.responseTimeframes.email)}
              </span>
            </div>
            <Slider
              id="email-response"
              min={1}
              max={72}
              step={1}
              value={[channelPreferences.responseTimeframes.email]}
              onValueChange={(value) => handleResponseTimeChange('email', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="text-response">Text Messages</Label>
              <span className="text-sm">
                {getTimeLabel(channelPreferences.responseTimeframes.text)}
              </span>
            </div>
            <Slider
              id="text-response"
              min={0.25}
              max={48}
              step={0.25}
              value={[channelPreferences.responseTimeframes.text]}
              onValueChange={(value) => handleResponseTimeChange('text', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-response">Voice Calls</Label>
              <span className="text-sm">
                {getTimeLabel(channelPreferences.responseTimeframes.voiceCall)}
              </span>
            </div>
            <Slider
              id="voice-response"
              min={1}
              max={72}
              step={1}
              value={[channelPreferences.responseTimeframes.voiceCall]}
              onValueChange={(value) => handleResponseTimeChange('voiceCall', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="video-response">Video Calls</Label>
              <span className="text-sm">
                {getTimeLabel(channelPreferences.responseTimeframes.videoCall)}
              </span>
            </div>
            <Slider
              id="video-response"
              min={1}
              max={72}
              step={1}
              value={[channelPreferences.responseTimeframes.videoCall]}
              onValueChange={(value) => handleResponseTimeChange('videoCall', value[0])}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Urgency Settings</h3>
          <p className="text-sm text-muted-foreground">
            Define how you want to be contacted for urgent matters.
          </p>
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="allow-calls" className="flex-1">
            Allow calls for urgent matters regardless of preference
          </Label>
          <Switch
            id="allow-calls"
            checked={channelPreferences.urgencyOverrides.allowCall}
            onCheckedChange={(checked) => handleUrgencyChange('allowCall', checked)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="urgent-response">Expected response time for urgent matters</Label>
            <span className="text-sm">
              {getTimeLabel(channelPreferences.urgencyOverrides.urgentResponseTime / 60)}
            </span>
          </div>
          <Slider
            id="urgent-response"
            min={5}
            max={180}
            step={5}
            value={[channelPreferences.urgencyOverrides.urgentResponseTime]}
            onValueChange={(value) => handleUrgencyChange('urgentResponseTime', value[0])}
          />
        </div>
      </div>
    </div>
  );
};

interface SortableChannelItemProps {
  channel: ChannelPreference;
  index: number;
}

const SortableChannelItem = ({ channel, index }: SortableChannelItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: channel.channel });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center p-3 bg-background border rounded-md"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab active:cursor-grabbing mr-3 text-muted-foreground"
      >
        <GripVertical size={16} />
      </div>
      <span className="flex-1 font-medium">{channel.channel}</span>
      <span className="text-sm text-muted-foreground">Rank: {index}</span>
    </div>
  );
};

export default ChannelPreferencesStep;