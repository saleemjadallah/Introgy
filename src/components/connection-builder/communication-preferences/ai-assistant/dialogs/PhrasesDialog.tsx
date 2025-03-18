
import AIPhrasesDialog from '../../AIPhrasesDialog';

interface PhrasesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phrases: any;
}

const PhrasesDialog = ({
  isOpen,
  onClose,
  phrases
}: PhrasesDialogProps) => {
  return (
    <AIPhrasesDialog
      isOpen={isOpen}
      onClose={onClose}
      phrases={phrases}
    />
  );
};

export default PhrasesDialog;
