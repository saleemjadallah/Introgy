
import { v4 as uuidv4 } from 'uuid';
import { 
  CommunicationProfile,
  SharingConfiguration 
} from '@/types/communication-preferences';

interface UseProfileManagementProps {
  profiles: CommunicationProfile[];
  shares: SharingConfiguration[];
  saveProfiles: (profiles: CommunicationProfile[]) => void;
  saveShares: (shares: SharingConfiguration[]) => void;
  setShares: React.Dispatch<React.SetStateAction<SharingConfiguration[]>>;
  toast: any;
}

export function useProfileManagement({
  profiles,
  shares,
  saveProfiles,
  saveShares,
  setShares,
  toast
}: UseProfileManagementProps) {
  
  // Create a new profile
  const createProfile = (newProfile: Omit<CommunicationProfile, 'profileId' | 'userId' | 'lastUpdated'>) => {
    // Generate an ID for the new profile
    const profileId = uuidv4();
    
    // Create profile with generated ID and current timestamp
    const profile: CommunicationProfile = {
      ...newProfile,
      profileId,
      userId: 'current-user', // For now, hardcode user ID
      lastUpdated: new Date(),
    };
    
    // If this is the first profile, make it the default
    if (profiles.length === 0) {
      profile.isDefault = true;
    }
    
    // Add to profiles collection
    const updatedProfiles = [...profiles, profile];
    saveProfiles(updatedProfiles);
    
    toast({
      title: 'Profile created',
      description: `Your communication profile "${profile.profileName}" has been created.`,
    });
    
    return profile;
  };

  // Update an existing profile
  const updateProfile = (profileId: string, updates: Partial<CommunicationProfile>) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.profileId === profileId) {
        return {
          ...profile,
          ...updates,
          lastUpdated: new Date(),
        };
      }
      return profile;
    });
    
    saveProfiles(updatedProfiles);
    
    toast({
      title: 'Profile updated',
      description: 'Your communication profile has been updated.',
    });
  };

  // Delete a profile
  const deleteProfile = (profileId: string) => {
    const profileToDelete = profiles.find(p => p.profileId === profileId);
    
    if (!profileToDelete) {
      toast({
        title: 'Profile not found',
        description: 'The profile you tried to delete could not be found.',
        variant: 'destructive',
      });
      return;
    }
    
    // Delete all shares for this profile
    const updatedShares = shares.filter(share => share.profileId !== profileId);
    saveShares(updatedShares);
    
    // Delete the profile
    const updatedProfiles = profiles.filter(profile => profile.profileId !== profileId);
    
    // If we're deleting the default profile and there are other profiles,
    // make another one the default
    if (profileToDelete.isDefault && updatedProfiles.length > 0) {
      updatedProfiles[0].isDefault = true;
    }
    
    saveProfiles(updatedProfiles);
    
    toast({
      title: 'Profile deleted',
      description: `Profile "${profileToDelete.profileName}" has been deleted.`,
    });
  };

  // Set a profile as the default
  const setDefaultProfile = (profileId: string) => {
    const updatedProfiles = profiles.map(profile => ({
      ...profile,
      isDefault: profile.profileId === profileId,
    }));
    
    saveProfiles(updatedProfiles);
    
    toast({
      title: 'Default profile updated',
      description: 'Your default communication profile has been updated.',
    });
  };

  return {
    createProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile
  };
}
