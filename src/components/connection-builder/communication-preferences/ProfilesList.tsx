
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';
import { CommunicationProfile } from '@/types/communication-preferences';
import EmptyProfilesList from './profiles-list/EmptyProfilesList';
import ProfileGrid from './profiles-list/ProfileGrid';
import FreePlanNotice from './profiles-list/FreePlanNotice';

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
    return <EmptyProfilesList onCreateNew={onCreateNew} />;
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
        <FreePlanNotice 
          profilesCount={profiles.length} 
          maxFreeProfiles={maxFreeProfiles} 
          canCreateProfile={canCreateProfile} 
        />
      )}

      <ProfileGrid 
        profiles={profiles}
        onProfileSelect={onProfileSelect}
        onSetDefault={onSetDefault}
        onDeleteProfile={onDeleteProfile}
      />
    </div>
  );
};

export default ProfilesList;
