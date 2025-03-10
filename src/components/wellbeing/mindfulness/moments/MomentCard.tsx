
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { MindfulMoment } from "@/types/mindfulness";

interface MomentCardProps {
  moment: MindfulMoment;
  onClick: () => void;
  compact?: boolean;
}

const MomentCard = ({ moment, onClick, compact = false }: MomentCardProps) => {
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };
  
  return (
    <Card className={`hover:bg-muted/50 transition-colors cursor-pointer ${compact ? 'h-full' : ''}`} onClick={onClick}>
      <CardHeader className={compact ? 'p-4' : 'p-6'}>
        <div className="flex justify-between items-start">
          <CardTitle className={compact ? 'text-base' : 'text-xl'}>{moment.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
            <Clock className="h-3 w-3" />
            {formatDuration(moment.duration)}
          </Badge>
        </div>
        {!compact && (
          <CardDescription className="line-clamp-2">
            {moment.content.instructions}
          </CardDescription>
        )}
      </CardHeader>
      {!compact && (
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {moment.situation.slice(0, 3).map(situation => (
              <Badge key={situation} variant="secondary" className="text-xs">
                {situation.replace(/-/g, ' ')}
              </Badge>
            ))}
            {moment.situation.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{moment.situation.length - 3} more</Badge>
            )}
          </div>
        </CardContent>
      )}
      <CardFooter className={compact ? 'p-4 pt-0' : 'p-6'}>
        <Button 
          variant="secondary" 
          className="w-full" 
          size={compact ? "sm" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Start Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MomentCard;
