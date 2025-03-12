
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Star, 
  ListPlus,
  Trash2,
  Share2,
  MoreVertical, 
  Lock
} from 'lucide-react';
import { CommunicationProfile } from '@/types/communication-preferences';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProfilesListProps {
  profiles: CommunicationProfile[];
  onProfileSelect: (profile: CommunicationProfile) => void;
  onCreateNew: () => void;
  onSetDefault: (profileId: string) => void;
  onDeleteProfile: (profileId: string) => void;
  canCreateProfile: boolean;
  maxFreeProfiles: number;
  isPremium: boolean;
}

const ProfilesList = ({
  profiles,
  onProfileSelect,
  onCreateNew,
  onSetDefault,
  onDeleteProfile,
  canCreateProfile,
  maxFreeProfiles,
  isPremium
}: ProfilesListProps) => {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-6 sm:py-8">
        <div className="text-center space-y-2 px-4">
          <h3 className="text-lg sm:text-xl font-semibold">No Communication Profiles Yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Create your first communication profile to define how you prefer others to interact with you.
          </p>
        </div>
        <Button 
          onClick={onCreateNew} 
          className="mt-2 w-full sm:w-auto py-5 sm:py-2 text-base sm:text-sm max-w-xs"
        >
          <ListPlus className="mr-2 h-4 w-4" />
          Create Your First Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-2">
        <h3 className="text-lg sm:text-xl font-semibold">Your Communication Profiles</h3>
        <Button 
          onClick={onCreateNew} 
          size="sm" 
          className="w-full sm:w-auto py-5 sm:py-2 text-base sm:text-sm"
          disabled={!canCreateProfile && !isPremium}
        >
          <ListPlus className="mr-2 h-4 w-4" />
          Create New Profile
          {!canCreateProfile && !isPremium && <Lock className="ml-2 h-3.5 w-3.5" />}
        </Button>
      </div>

      {!isPremium && profiles.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {canCreateProfile 
            ? `Using ${profiles.length} of ${maxFreeProfiles} available profiles (Free plan)`
            : `Free plan limit reached (${profiles.length}/${maxFreeProfiles})`
          }
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <Card key={profile.profileId} className="overflow-hidden shadow-sm">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className="mr-1">{profile.profileName}</span>
                    {profile.isDefault && (
                      <Badge variant="default" className="ml-0 text-xs">
                        <Star className="h-3 w-3 mr-1" /> Default
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Updated: {format(new Date(profile.lastUpdated), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onProfileSelect(profile)} className="text-sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    {!profile.isDefault && (
                      <DropdownMenuItem onClick={() => onSetDefault(profile.profileId)} className="text-sm">
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive text-sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Profile
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg">Delete Profile</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            Are you sure you want to delete "{profile.profileName}"? This action cannot be undone.
                            {profile.isDefault && (
                              <p className="mt-2 font-semibold">
                                Warning: This is your default profile. Deleting it will set another profile as default.
                              </p>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2 sm:gap-0">
                          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteProfile(profile.profileId)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-1 sm:pt-2">
              <div className="space-y-2 text-sm">
                <ProfilePreviewInfo profile={profile} />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-4 py-5 sm:py-2 text-base sm:text-sm"
                  onClick={() => onProfileSelect(profile)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper component to show a preview of profile settings
const ProfilePreviewInfo = ({ profile }: { profile: CommunicationProfile }) => {
  const topChannels = profile.channelPreferences.rankedChannels
    .sort((a, b) => a.preference - b.preference)
    .slice(0, 2)
    .map(c => c.channel)
    .join(', ');

  return (
    <div className="space-y-2 mt-1">
      <div className="flex justify-between items-center text-xs sm:text-sm">
        <span className="font-medium">Top channels:</span>
        <span className="text-muted-foreground">{topChannels}</span>
      </div>
      <div className="flex justify-between items-center text-xs sm:text-sm">
        <span className="font-medium">Conversation depth:</span>
        <span className="text-muted-foreground">{profile.interactionStyle.conversationDepth}/10</span>
      </div>
      <div className="flex justify-between items-center text-xs sm:text-sm">
        <span className="font-medium">Ideal group size:</span>
        <span className="text-muted-foreground">{profile.boundaries.groupSizePreference.ideal} people</span>
      </div>
      <div className="flex justify-between items-center text-xs sm:text-sm">
        <span className="font-medium">Preparation needed:</span>
        <span className="text-muted-foreground">{profile.interactionStyle.preparationNeeded}/10</span>
      </div>
    </div>
  );
};

export default ProfilesList;
