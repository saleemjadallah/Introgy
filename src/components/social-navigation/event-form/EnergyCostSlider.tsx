
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface EnergyCostSliderProps {
  energyCost: number;
  onEnergyCostChange: (value: number) => void;
}

const EnergyCostSlider = ({ energyCost, onEnergyCostChange }: EnergyCostSliderProps) => {
  return (
    <div className="space-y-2">
      <Label>Anticipated Social Energy Cost (1-10)</Label>
      <div className="flex items-center space-x-4 pt-2">
        <span className="text-sm">1</span>
        <Slider 
          value={[energyCost]} 
          min={1} 
          max={10}
          step={1}
          onValueChange={(value) => onEnergyCostChange(value[0])}
        />
        <span className="text-sm">10</span>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Current: {energyCost}
      </div>
    </div>
  );
};

export default EnergyCostSlider;
