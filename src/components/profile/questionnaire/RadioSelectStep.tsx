
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioSelectStepProps {
  title: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const RadioSelectStep: React.FC<RadioSelectStepProps> = ({
  title,
  options,
  selectedValue,
  onValueChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base">{title}</h3>
      <RadioGroup 
        value={selectedValue}
        onValueChange={onValueChange}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 p-3 rounded-md border">
            <RadioGroupItem value={option} id={`option-${option.substring(0, 10)}`} />
            <Label htmlFor={`option-${option.substring(0, 10)}`} className="flex-1 cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioSelectStep;
