
import { CommunicationProfile } from '@/types/communication-preferences';
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
  Share2,
  Trash2,
  MoreVertical 
} from 'lucide-react';
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
import ProfilePreviewInfo from './ProfilePreviewInfo';

interface ProfileCardProps {
  profile: CommunicationProfile;
  onProfileSelect: (profile: CommunicationProfile) => void;
  onSetDefault: (profileId: string) => void;
  onDeleteProfile: (profileId: string) => void;
}

const ProfileCard = ({ profile, onProfileSelect, onSetDefault, onDeleteProfile }: ProfileCardProps) => {
  return (
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
  );
};

export default ProfileCard;
