
import { v4 as uuidv4 } from 'uuid';
import { 
  CommunicationProfile,
  SharingConfiguration 
} from '@/types/communication-preferences';

interface UseSharesManagementProps {
  profiles: CommunicationProfile[];
  shares: SharingConfiguration[];
  saveShares: (shares: SharingConfiguration[]) => void;
  toast: any;
}

export function useSharesManagement({
  profiles,
  shares,
  saveShares,
  toast
}: UseSharesManagementProps) {
  
  // Create a sharing configuration
  const createShareLink = (
    profileId: string, 
    expiresInDays: number = 30, 
    accessCode?: string,
    customMessage?: string,
    sharingFormat: 'link' | 'card' | 'pdf' = 'link'
  ) => {
    const profile = profiles.find(p => p.profileId === profileId);
    
    if (!profile) {
      toast({
        title: 'Profile not found',
        description: 'The profile you tried to share could not be found.',
        variant: 'destructive',
      });
      return null;
    }
    
    const shareId = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const shareConfig: SharingConfiguration = {
      shareId,
      profileId,
      createdAt,
      expiresAt,
      accessCode,
      customMessage,
      accessLog: [],
      sharingFormat,
    };
    
    const updatedShares = [...shares, shareConfig];
    saveShares(updatedShares);
    
    toast({
      title: 'Profile shared',
      description: 'Your communication profile has been shared successfully.',
    });
    
    return shareConfig;
  };

  // Revoke a sharing configuration
  const revokeShare = (shareId: string) => {
    const updatedShares = shares.filter(share => share.shareId !== shareId);
    saveShares(updatedShares);
    
    toast({
      title: 'Sharing revoked',
      description: 'The shared profile has been revoked and is no longer accessible.',
    });
  };

  // Access a shared profile
  const accessSharedProfile = (shareId: string, accessCode?: string) => {
    const share = shares.find(s => s.shareId === shareId);
    
    if (!share) {
      return { success: false, message: 'Shared profile not found.' };
    }
    
    // Check if expired
    if (new Date() > share.expiresAt) {
      return { success: false, message: 'This shared profile has expired.' };
    }
    
    // Check access code if required
    if (share.accessCode && share.accessCode !== accessCode) {
      return { success: false, message: 'Invalid access code.' };
    }
    
    // Update access log
    const updatedShare = {
      ...share,
      accessLog: [
        ...share.accessLog,
        {
          accessedAt: new Date(),
          accessCount: 1,
        },
      ],
    };
    
    const updatedShares = shares.map(s => 
      s.shareId === shareId ? updatedShare : s
    );
    
    saveShares(updatedShares);
    
    // Get the profile
    const profile = profiles.find(p => p.profileId === share.profileId);
    
    if (!profile) {
      return { success: false, message: 'Profile not found.' };
    }
    
    return { 
      success: true, 
      profile, 
      sharingFormat: share.sharingFormat,
      customMessage: share.customMessage 
    };
  };

  return {
    createShareLink,
    revokeShare,
    accessSharedProfile
  };
}
