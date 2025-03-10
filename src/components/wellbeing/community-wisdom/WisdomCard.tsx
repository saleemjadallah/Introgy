
import { WisdomItem } from "@/types/community-wisdom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck, MessageSquare, ThumbsUp, ZapIcon, Battery } from "lucide-react";

interface WisdomCardProps {
  wisdom: WisdomItem;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
}

const WisdomCard = ({ wisdom, isSaved, onSelect, onToggleSave }: WisdomCardProps) => {
  // Get energy level badge class
  const getEnergyBadgeClass = () => {
    switch (wisdom.energyLevel) {
      case "low":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "high":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "";
    }
  };

  // Get category badge class
  const getCategoryBadgeClass = () => {
    switch (wisdom.category) {
      case "practical-strategies":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "personal-insights":
        return "bg-purple-500/10 text-purple-600 border-purple-200";
      case "success-stories":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "coping-techniques":
        return "bg-orange-500/10 text-orange-600 border-orange-200";
      case "resources":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-200";
      default:
        return "";
    }
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  // Truncate text for preview
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="h-full flex flex-col hover:border-primary/50 transition-colors duration-200">
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${getCategoryBadgeClass()}`}>
            {formatCategory(wisdom.category)}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full -mr-2 -mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-base line-clamp-4 mb-4">
          {truncateText(wisdom.content, 180)}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {wisdom.situation}
          </Badge>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 text-xs ${getEnergyBadgeClass()}`}
          >
            <Battery className="h-3 w-3" />
            <span className="capitalize">{wisdom.energyLevel}</span> energy
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0 pb-4">
        <div className="flex items-center text-muted-foreground text-sm">
          <ThumbsUp className="h-3 w-3 mr-1" />
          <span>{wisdom.helpfulCount} helpful</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSelect}
          className="text-xs"
        >
          View More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WisdomCard;
