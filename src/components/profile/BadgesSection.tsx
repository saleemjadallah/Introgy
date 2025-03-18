
import { useIsMobile } from "@/hooks/use-mobile";
import BadgesDisplay from "@/components/badges/BadgesDisplay";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface BadgesSectionProps {
  onEarnDemo: () => void;
}

const BadgesSection = ({ onEarnDemo }: BadgesSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-medium`}>Your Achievements</h2>
          <p className="text-muted-foreground">
            Track your personal growth journey as an introvert
          </p>
        </div>
        
        <Button variant="outline" size="sm" onClick={onEarnDemo} className="gap-1 whitespace-nowrap">
          <Trophy size={14} />
          Demo: Earn Badges
        </Button>
      </div>
      
      <BadgesDisplay />
    </div>
  );
};

export default BadgesSection;
