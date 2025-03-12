
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface MoneyBackGuaranteeProps {
  isMobile: boolean;
}

const MoneyBackGuarantee: React.FC<MoneyBackGuaranteeProps> = ({ isMobile }) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className={`${isMobile ? 'p-4' : 'pt-6'}`}>
        <div className="flex items-center gap-3">
          <DollarSign className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
          <div>
            <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>30-Day Money-Back Guarantee</h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              Try Premium risk-free. If you're not satisfied, get a full refund within 30 days.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoneyBackGuarantee;
