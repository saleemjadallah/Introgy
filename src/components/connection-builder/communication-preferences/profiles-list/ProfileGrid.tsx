import { CommunicationProfile } from '@/types/communication-preferences';
import ProfileCard from './ProfileCard';
import { usePremium } from '@/contexts/premium';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  onDeleteProfile,
  maxFreeProfiles
}: ProfileGridProps) => {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  
  const showUpgradeMessage = !isPremium && maxFreeProfiles && profiles.length >= maxFreeProfiles;
  
  return (
    <>
      {showUpgradeMessage && (
        <Alert className="mb-4 bg-muted/50 border border-primary/20">
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>You've reached the limit of {maxFreeProfiles} profiles on the free plan.</span>
            <Button 
              size="sm" 
              onClick={() => navigate("/profile?tab=pricing")}
              className="whitespace-nowrap"
            >
              <Star className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
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
    </>
  );
};

export default ProfileGrid;
