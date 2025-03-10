
import { getPracticeById } from "@/data/mindfulness";

interface HistoryTabProps {
  completedPractices: string[];
  onSelectPractice: (id: string) => void;
}

const HistoryTab = ({ completedPractices, onSelectPractice }: HistoryTabProps) => {
  return (
    <div className="mt-6">
      {completedPractices.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Practice History</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedPractices.map(id => {
              const practice = getPracticeById(id);
              if (!practice) return null;
              
              return (
                <div 
                  key={id} 
                  className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onSelectPractice(id)}
                >
                  <h4 className="font-medium">{practice.title}</h4>
                  <p className="text-sm text-muted-foreground">{practice.category}</p>
                  <p className="text-xs mt-2">{practice.duration} min • {practice.subcategory}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-64 border rounded-lg flex items-center justify-center">
          <p className="text-center text-muted-foreground">
            You haven't completed any practices yet
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
