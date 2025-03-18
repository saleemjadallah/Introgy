
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle } from "lucide-react";

interface StrategyPhrasesProps {
  phrases: string[];
}

const StrategyPhrases = ({ phrases }: StrategyPhrasesProps) => {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium">Example phrases</h4>
      <div className="space-y-2">
        {phrases.map((phrase, index) => (
          <Alert key={index} className="bg-primary/5 text-sm py-2">
            <MessageCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{phrase}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default StrategyPhrases;
