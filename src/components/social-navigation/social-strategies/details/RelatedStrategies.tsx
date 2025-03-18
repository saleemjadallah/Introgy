
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Strategy } from "@/types/social-strategies";

interface RelatedStrategiesProps {
  strategies: Strategy[];
  onViewStrategy: (strategyId: string) => void;
}

const RelatedStrategies = ({ strategies, onViewStrategy }: RelatedStrategiesProps) => {
  if (!strategies.length) {
    return null;
  }

  return (
    <div className="space-y-2 pt-2">
      <h4 className="font-medium">Related strategies</h4>
      <div className="grid grid-cols-1 gap-2">
        {strategies.map((related) => (
          <Card key={related.id} className="border hover:border-primary/50 transition-colors">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <h5 className="font-medium text-sm">{related.title}</h5>
                <p className="text-xs text-muted-foreground line-clamp-1">{related.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => onViewStrategy(related.id)}
              >
                View
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedStrategies;
