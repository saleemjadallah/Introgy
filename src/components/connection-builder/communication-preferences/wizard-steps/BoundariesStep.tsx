import { Boundaries } from '@/types/communication-preferences';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface BoundariesStepProps {
  boundaries: Boundaries;
  onChange: (boundaries: Boundaries) => void;
}

const BoundariesStep = ({ boundaries, onChange }: BoundariesStepProps) => {
  const handleGroupSizeChange = (key: 'min' | 'ideal' | 'max', value: number) => {
    onChange({
      ...boundaries,
      groupSizePreference: {
        ...boundaries.groupSizePreference,
        [key]: value
      }
    });
  };

  const handleDurationChange = (key: 'idealDuration' | 'maxDuration' | 'breakFrequency', value: number) => {
    onChange({
      ...boundaries,
      durationLimits: {
        ...boundaries.durationLimits,
        [key]: value
      }
    });
  };

  const handleAdvanceNoticeChange = (key: 'preferred' | 'minimum', value: number) => {
    onChange({
      ...boundaries,
      advanceNotice: {
        ...boundaries.advanceNotice,
        [key]: value
      }
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDays = (days: number) => {
    if (days === 0.5) return '12 hours';
    if (days === 0.25) return '6 hours';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Group Size Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Define your comfort level with different group sizes.
          </p>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="min-group">Minimum comfortable group size</Label>
              <span className="text-sm font-medium">
                {boundaries.groupSizePreference.min === 1 ? '1 person (one-on-one)' : `${boundaries.groupSizePreference.min} people`}
              </span>
            </div>
            <Slider
              id="min-group"
              min={1}
              max={5}
              step={1}
              value={[boundaries.groupSizePreference.min]}
              onValueChange={(value) => handleGroupSizeChange('min', value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ideal-group">Ideal group size</Label>
              <span className="text-sm font-medium">
                {boundaries.groupSizePreference.ideal === 1 ? '1 person (one-on-one)' : `${boundaries.groupSizePreference.ideal} people`}
              </span>
            </div>
            <Slider
              id="ideal-group"
              min={1}
              max={15}
              step={1}
              value={[boundaries.groupSizePreference.ideal]}
              onValueChange={(value) => handleGroupSizeChange('ideal', value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-group">Maximum comfortable group size</Label>
              <span className="text-sm font-medium">
                {boundaries.groupSizePreference.max} people
              </span>
            </div>
            <Slider
              id="max-group"
              min={boundaries.groupSizePreference.ideal}
              max={30}
              step={1}
              value={[boundaries.groupSizePreference.max]}
              onValueChange={(value) => handleGroupSizeChange('max', value[0])}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Duration Limits</h3>
          <p className="text-sm text-muted-foreground">
            Set your preferred interaction durations and break frequency.
          </p>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ideal-duration">Ideal interaction duration</Label>
              <span className="text-sm font-medium">
                {formatDuration(boundaries.durationLimits.idealDuration)}
              </span>
            </div>
            <Slider
              id="ideal-duration"
              min={15}
              max={240}
              step={15}
              value={[boundaries.durationLimits.idealDuration]}
              onValueChange={(value) => handleDurationChange('idealDuration', value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-duration">Maximum comfortable duration</Label>
              <span className="text-sm font-medium">
                {formatDuration(boundaries.durationLimits.maxDuration)}
              </span>
            </div>
            <Slider
              id="max-duration"
              min={boundaries.durationLimits.idealDuration}
              max={480}
              step={15}
              value={[boundaries.durationLimits.maxDuration]}
              onValueChange={(value) => handleDurationChange('maxDuration', value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="break-frequency">Preferred break frequency</Label>
              <span className="text-sm font-medium">
                Every {formatDuration(boundaries.durationLimits.breakFrequency)}
              </span>
            </div>
            <Slider
              id="break-frequency"
              min={15}
              max={120}
              step={5}
              value={[boundaries.durationLimits.breakFrequency]}
              onValueChange={(value) => handleDurationChange('breakFrequency', value[0])}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Advance Notice</h3>
          <p className="text-sm text-muted-foreground">
            How much notice do you prefer before social interactions?
          </p>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="preferred-notice">Preferred advance notice</Label>
              <span className="text-sm font-medium">
                {formatDays(boundaries.advanceNotice.preferred)}
              </span>
            </div>
            <Slider
              id="preferred-notice"
              min={0.25}
              max={14}
              step={0.25}
              value={[boundaries.advanceNotice.preferred]}
              onValueChange={(value) => handleAdvanceNoticeChange('preferred', value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="minimum-notice">Minimum acceptable notice</Label>
              <span className="text-sm font-medium">
                {formatDays(boundaries.advanceNotice.minimum)}
              </span>
            </div>
            <Slider
              id="minimum-notice"
              min={0.25}
              max={boundaries.advanceNotice.preferred}
              step={0.25}
              value={[boundaries.advanceNotice.minimum]}
              onValueChange={(value) => handleAdvanceNoticeChange('minimum', value[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoundariesStep;