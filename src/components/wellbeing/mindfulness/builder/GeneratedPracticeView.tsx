
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MindfulnessPractice } from "@/types/mindfulness";
import { Clock } from "lucide-react";

interface GeneratedPracticeViewProps {
  practice: MindfulnessPractice;
  onCreateAnother: () => void;
}

const GeneratedPracticeView = ({ practice, onCreateAnother }: GeneratedPracticeViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{practice.title}</h3>
          <p className="text-sm text-muted-foreground">
            {practice.duration} minutes • Custom Practice
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{practice.duration} min</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {practice.tags.slice(0, 5).map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Description</h4>
        <p className="text-sm text-muted-foreground">{practice.description}</p>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Practice Script</h4>
        <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-line">
          {practice.script}
        </div>
      </div>
    </div>
  );
};

export default GeneratedPracticeView;
