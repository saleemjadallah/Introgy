import { VisibilitySettings } from '@/types/communication-preferences';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Globe, Users, Briefcase, Lock } from 'lucide-react';

interface VisibilitySettingsStepProps {
  visibilitySettings: VisibilitySettings;
  profileName: string;
  isDefault: boolean;
  onChange: (updates: { 
    visibilitySettings: VisibilitySettings;
    profileName?: string;
    isDefault?: boolean;
  }) => void;
}

const VisibilitySettingsStep = ({ 
  visibilitySettings, 
  profileName,
  isDefault,
  onChange 
}: VisibilitySettingsStepProps) => {
  
  const handleVisibilityChange = (
    key: keyof VisibilitySettings, 
    value: 'public' | 'private' | 'friends' | 'colleagues'
  ) => {
    onChange({
      visibilitySettings: {
        ...visibilitySettings,
        [key]: value
      }
    });
  };

  const handleProfileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      visibilitySettings,
      profileName: e.target.value
    });
  };

  const handleDefaultChange = (checked: boolean) => {
    onChange({
      visibilitySettings,
      isDefault: checked
    });
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'friends':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'colleagues':
        return <Briefcase className="h-4 w-4 text-orange-500" />;
      case 'private':
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Profile Name and Settings</h3>
          <p className="text-sm text-muted-foreground">
            Finalize your profile settings before saving.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              value={profileName}
              onChange={handleProfileNameChange}
              placeholder="My Communication Style"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="default-profile"
              checked={isDefault}
              onCheckedChange={handleDefaultChange}
            />
            <Label htmlFor="default-profile">Set as default profile</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Visibility Controls</h3>
          <p className="text-sm text-muted-foreground">
            Choose which sections to share with different audiences when sharing your profile.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {getVisibilityIcon(visibilitySettings.channelPreferences)}
                Channel Preferences
              </CardTitle>
              <CardDescription>
                Your preferred communication methods and response times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={visibilitySettings.channelPreferences} 
                onValueChange={(value: 'public' | 'private' | 'friends' | 'colleagues') => 
                  handleVisibilityChange('channelPreferences', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone can see</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Friends - Only share with friends</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="colleagues">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Colleagues - Work relationships</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Only visible to you</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {getVisibilityIcon(visibilitySettings.interactionStyle)}
                Interaction Style
              </CardTitle>
              <CardDescription>
                Your conversation depth, topics, and interruption comfort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={visibilitySettings.interactionStyle} 
                onValueChange={(value: 'public' | 'private' | 'friends' | 'colleagues') => 
                  handleVisibilityChange('interactionStyle', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone can see</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Friends - Only share with friends</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="colleagues">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Colleagues - Work relationships</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Only visible to you</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {getVisibilityIcon(visibilitySettings.boundaries)}
                Social Boundaries
              </CardTitle>
              <CardDescription>
                Group size, duration limits, and advance notice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={visibilitySettings.boundaries} 
                onValueChange={(value: 'public' | 'private' | 'friends' | 'colleagues') => 
                  handleVisibilityChange('boundaries', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone can see</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Friends - Only share with friends</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="colleagues">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Colleagues - Work relationships</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Only visible to you</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {getVisibilityIcon(visibilitySettings.energyManagement)}
                Energy Management
              </CardTitle>
              <CardDescription>
                Depletion signals, exit phrases, and recovery needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={visibilitySettings.energyManagement} 
                onValueChange={(value: 'public' | 'private' | 'friends' | 'colleagues') => 
                  handleVisibilityChange('energyManagement', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone can see</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Friends - Only share with friends</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="colleagues">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Colleagues - Work relationships</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Only visible to you</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettingsStep;