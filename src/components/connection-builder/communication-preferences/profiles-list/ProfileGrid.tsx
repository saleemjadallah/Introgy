
import { CommunicationProfile } from '@/types/communication-preferences';
import ProfileCard from './ProfileCard';

interface ProfileGridProps {
  profiles: CommunicationProfile[];
  onProfileSelect: (profile: CommunicationProfile) => void;
  onSetDefault: (profileId: string) => void;
  onDeleteProfile: (profileId: string) => void;
  maxFreeProfiles?: number;
}

const ProfileGrid = ({ 
  profiles, 
  onProfileSelect, 
  onSetDefault, 
  onDeleteProfile
}: ProfileGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.profileId}
          profile={profile}
          onProfileSelect={onProfileSelect}
          onSetDefault={onSetDefault}
          onDeleteProfile={onDeleteProfile}
        />
      ))}
    </div>
  );
};

export default ProfileGrid;
