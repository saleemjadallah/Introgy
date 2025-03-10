
import { WisdomItem } from "@/types/community-wisdom";
import WisdomCard from "../WisdomCard";

interface WisdomGridProps {
  items: WisdomItem[];
  savedItems: string[];
  onSelect: (item: WisdomItem) => void;
  onToggleSave: (id: string) => void;
}

const WisdomGrid = ({ items, savedItems, onSelect, onToggleSave }: WisdomGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <WisdomCard
          key={item.id}
          wisdom={item}
          isSaved={savedItems.includes(item.id)}
          onSelect={() => onSelect(item)}
          onToggleSave={() => onToggleSave(item.id)}
        />
      ))}
    </div>
  );
};

export default WisdomGrid;
