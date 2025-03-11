
import { CommunicationProfile } from '@/types/communication-preferences';
import AIEnhancementsDialog from '../../AIEnhancementsDialog';

interface EnhancementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  enhancements: any;
  profile: Partial<CommunicationProfile>;
  onApplyEnhancements: (profile: Partial<CommunicationProfile>) => void;
}

const EnhancementsDialog = ({
  isOpen,
  onClose,
  enhancements,
  profile,
  onApplyEnhancements
}: EnhancementsDialogProps) => {
  return (
    <AIEnhancementsDialog
      isOpen={isOpen}
      onClose={onClose}
      enhancements={enhancements}
      profile={profile}
      onApplyEnhancements={onApplyEnhancements}
    />
  );
};

export default EnhancementsDialog;
