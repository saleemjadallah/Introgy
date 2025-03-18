
import { Button } from "@/components/ui/button";
import { WisdomItem } from "@/types/community-wisdom";
import WisdomDetail from "../WisdomDetail";

interface WisdomDetailViewProps {
  selectedWisdom: WisdomItem;
  savedItems: string[];
  onToggleSave: (id: string) => void;
  onMarkHelpful: (id: string) => void;
  onBack: () => void;
  onSelectSimilar: (wisdom: WisdomItem) => void;
  getSimilarWisdom: (item: WisdomItem) => WisdomItem[];
}

const WisdomDetailView = ({
  selectedWisdom,
  savedItems,
  onToggleSave,
  onMarkHelpful,
  onBack,
  onSelectSimilar,
  getSimilarWisdom,
}: WisdomDetailViewProps) => {
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-2"
      >
        ← Back to library
      </Button>
      <WisdomDetail
        wisdom={selectedWisdom}
        isSaved={savedItems.includes(selectedWisdom.id)}
        onToggleSave={onToggleSave}
        onMarkHelpful={onMarkHelpful}
        similarWisdom={getSimilarWisdom(selectedWisdom)}
        onSelectSimilar={onSelectSimilar}
      />
    </div>
  );
};

export default WisdomDetailView;
