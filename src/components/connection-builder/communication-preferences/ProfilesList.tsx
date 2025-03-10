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

interface ProfilesListProps {
  profiles: CommunicationProfile[];
  onProfileSelect: (profile: CommunicationProfile) => void;
  onCreateNew: () => void;
  onSetDefault: (profileId: string) => void;
  onDeleteProfile: (profileId: string) => void;
}

const ProfilesList = ({
  profiles,
  onProfileSelect,
  onCreateNew,
  onSetDefault,
  onDeleteProfile,
}: ProfilesListProps) => {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">No Communication Profiles Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Create your first communication profile to define how you prefer others to interact with you.
          </p>
        </div>
        <Button onClick={onCreateNew} className="mt-4">
          <ListPlus className="mr-2 h-4 w-4" />
          Create Your First Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Communication Profiles</h3>
        <Button onClick={onCreateNew}>
          <ListPlus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <Card key={profile.profileId} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {profile.profileName}
                    {profile.isDefault && (
                      <Badge variant="default" className="ml-2">
                        <Star className="h-3 w-3 mr-1" /> Default
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Last updated: {format(new Date(profile.lastUpdated), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onProfileSelect(profile)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    {!profile.isDefault && (
                      <DropdownMenuItem onClick={() => onSetDefault(profile.profileId)}>
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Profile
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Communication Profile</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{profile.profileName}"? This action cannot be undone.
                            {profile.isDefault && (
                              <p className="mt-2 font-semibold">
                                Warning: This is your default profile. Deleting it will set another profile as default.
                              </p>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            <CardContent>
              <div className="space-y-2">
                <ProfilePreviewInfo profile={profile} />
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
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
    <>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Top channels:</span>
        <span className="text-sm">{topChannels}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Conversation depth:</span>
        <span className="text-sm">{profile.interactionStyle.conversationDepth}/10</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Ideal group size:</span>
        <span className="text-sm">{profile.boundaries.groupSizePreference.ideal} people</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Preparation needed:</span>
        <span className="text-sm">{profile.interactionStyle.preparationNeeded}/10</span>
      </div>
    </>
  );
};

export default ProfilesList;