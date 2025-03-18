
import PracticeRecommendations from "../PracticeRecommendations";

interface RecommendedTabProps {
  batteryLevel: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  completedPractices: string[];
  onSelectPractice: (id: string) => void;
}

const RecommendedTab = ({
  batteryLevel,
  timeOfDay,
  completedPractices,
  onSelectPractice
}: RecommendedTabProps) => {
  return (
    <div className="mt-6">
      <PracticeRecommendations 
        batteryLevel={batteryLevel}
        timeOfDay={timeOfDay}
        completedPractices={completedPractices}
        onSelectPractice={onSelectPractice}
      />
    </div>
  );
};

export default RecommendedTab;
