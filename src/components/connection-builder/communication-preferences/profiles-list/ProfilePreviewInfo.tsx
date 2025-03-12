
import { CommunicationProfile } from '@/types/communication-preferences';

interface ProfilePreviewInfoProps {
  profile: CommunicationProfile;
}

const ProfilePreviewInfo = ({ profile }: ProfilePreviewInfoProps) => {
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

export default ProfilePreviewInfo;
