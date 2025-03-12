
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

const PricingSkeletonCard: React.FC = () => {
  return (
    <Card className="border-2 animate-pulse">
      <CardHeader>
        <div className="w-36 h-8 bg-muted rounded" />
        <div className="w-full h-5 bg-muted rounded mt-2" />
        <div className="w-24 h-8 bg-muted rounded mt-3" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array(5).fill(0).map((_, j) => (
          <div key={j} className="space-y-2">
            <div className="w-24 h-5 bg-muted rounded" />
            <div className="space-y-1">
              {Array(3).fill(0).map((_, k) => (
                <div key={k} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted mt-1" />
                  <div className="w-full h-4 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="w-full h-10 bg-muted rounded" />
      </CardFooter>
    </Card>
  );
};

export default PricingSkeletonCard;
