
import { Heart } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface EnergyImpactVisualProps {
  energyImpact: number;
}

const EnergyImpactVisual = ({ energyImpact }: EnergyImpactVisualProps) => {
  const energyType = 
    energyImpact < 0 
      ? "Calming" 
      : energyImpact > 0 
        ? "Energizing" 
        : "Neutral";
  
  const energyColor = 
    energyImpact < 0 
      ? "bg-blue-500" 
      : energyImpact > 0 
        ? "bg-amber-500" 
        : "bg-green-500";

  return (
    <div className="border-t pt-4 mt-6">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-8 w-8 bg-primary">
          <Heart size={14} />
        </Avatar>
        <div>
          <p className="text-sm font-medium">Energy Impact</p>
          <p className="text-xs text-muted-foreground">
            {energyType}
          </p>
        </div>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 bottom-0 left-1/2 ${energyColor}`}
          style={{
            width: `${Math.abs(energyImpact * 10)}%`,
            left: energyImpact <= 0 ? `${50 - Math.abs(energyImpact * 10)}%` : "50%"
          }}
        />
        <div className="absolute top-0 bottom-0 left-1/2 w-1 -ml-0.5 bg-foreground" />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>Calming</span>
        <span>Neutral</span>
        <span>Energizing</span>
      </div>
    </div>
  );
};

export default EnergyImpactVisual;
