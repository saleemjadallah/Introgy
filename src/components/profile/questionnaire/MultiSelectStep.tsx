
import React from "react";
import { Check } from "lucide-react";

interface MultiSelectStepProps {
  title: string;
  subtitle: string;
  options: string[];
  selectedItems: string[];
  onToggleItem: (value: string) => void;
}

const MultiSelectStep: React.FC<MultiSelectStepProps> = ({
  title,
  subtitle,
  options,
  selectedItems,
  onToggleItem
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => (
          <div 
            key={option}
            className={`flex items-center p-3 rounded-md cursor-pointer ${
              selectedItems.includes(option) 
                ? 'bg-primary/10 border border-primary/30' 
                : 'border hover:bg-secondary/50'
            }`}
            onClick={() => onToggleItem(option)}
          >
            <div className="flex-1">{option}</div>
            {selectedItems.includes(option) && (
              <Check size={18} className="text-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectStep;
