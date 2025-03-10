
import { Badge } from "@/components/ui/badge";
import { MindfulnessPractice } from "@/types/mindfulness";

interface PracticeInfoProps {
  practice: MindfulnessPractice;
}

const PracticeInfo = ({ practice }: PracticeInfoProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {practice.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Description</h4>
        <p className="text-sm text-muted-foreground">{practice.description}</p>
      </div>
    </>
  );
};

export default PracticeInfo;
