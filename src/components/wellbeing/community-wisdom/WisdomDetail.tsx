
import { useState } from "react";
import { WisdomItem } from "@/types/community-wisdom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Battery,
  Tag,
} from "lucide-react";
import { format } from "date-fns";

interface WisdomDetailProps {
  wisdom: WisdomItem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onMarkHelpful: (id: string) => void;
  similarWisdom: WisdomItem[];
  onSelectSimilar: (wisdom: WisdomItem) => void;
}

const WisdomDetail = ({
  wisdom,
  isSaved,
  onToggleSave,
  onMarkHelpful,
  similarWisdom,
  onSelectSimilar,
}: WisdomDetailProps) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [personalNote, setPersonalNote] = useState(wisdom.implementation?.personalNotes || "");
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const [implementation, setImplementation] = useState({
    tried: wisdom.implementation?.tried || false,
    effectiveness: wisdom.implementation?.effectiveness || "medium" as "low" | "medium" | "high",
  });

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

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleMarkHelpful = () => {
    if (!hasMarkedHelpful) {
      onMarkHelpful(wisdom.id);
      setHasMarkedHelpful(true);
    }
  };

  const handleSavePersonalNote = () => {
    // This would normally save to localStorage or database
    // For now, we'll just update the state
    console.log("Saving personal note:", personalNote);
    // In a real app, you would persist this data
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <Badge className={`${getCategoryBadgeClass()}`}>
              {formatCategory(wisdom.category)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onToggleSave(wisdom.id)}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>

          <div className="prose max-w-none dark:prose-invert mb-4">
            <p>{wisdom.content}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(wisdom.dateSubmitted), "MMM d, yyyy")}
            </Badge>
            <Badge variant="outline">
              {wisdom.situation}
            </Badge>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${getEnergyBadgeClass()}`}
            >
              <Battery className="h-3 w-3" />
              <span className="capitalize">{wisdom.energyLevel}</span> energy
            </Badge>
          </div>

          {wisdom.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              <span className="text-sm text-muted-foreground flex items-center">
                <Tag className="h-3 w-3 mr-1" /> Tags:
              </span>
              {wisdom.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              variant={hasMarkedHelpful ? "default" : "outline"}
              size="sm"
              onClick={handleMarkHelpful}
              disabled={hasMarkedHelpful}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="h-3 w-3" />
              {hasMarkedHelpful ? "Marked Helpful" : "This Was Helpful"}
              {wisdom.helpfulCount > 0 && !hasMarkedHelpful && (
                <Badge variant="secondary" className="ml-1">
                  {wisdom.helpfulCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex items-center gap-1"
            >
              <MessageSquare className="h-3 w-3" />
              Add Perspective
            </Button>
          </div>

          {showCommentForm && (
            <div className="mt-4 space-y-3">
              <Textarea
                placeholder="Share how this advice helped you or add your perspective..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCommentForm(false);
                    setCommentText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    // Add comment logic would go here
                    setShowCommentForm(false);
                    setCommentText("");
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          {wisdom.comments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Perspectives from others</h4>
              <div className="space-y-3">
                {wisdom.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-muted p-3 rounded-md text-sm"
                  >
                    <p>{comment.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(comment.dateSubmitted), "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isSaved && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-md font-medium mb-3">Personal Implementation</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tried-this"
                  className="mr-2"
                  checked={implementation.tried}
                  onChange={(e) =>
                    setImplementation({ ...implementation, tried: e.target.checked })
                  }
                />
                <Label htmlFor="tried-this">I've tried this strategy</Label>
              </div>

              {implementation.tried && (
                <div className="space-y-2">
                  <Label htmlFor="effectiveness">How effective was it for you?</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={implementation.effectiveness === "low" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setImplementation({ ...implementation, effectiveness: "low" })
                      }
                    >
                      Not very
                    </Button>
                    <Button
                      variant={implementation.effectiveness === "medium" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setImplementation({ ...implementation, effectiveness: "medium" })
                      }
                    >
                      Somewhat
                    </Button>
                    <Button
                      variant={implementation.effectiveness === "high" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setImplementation({ ...implementation, effectiveness: "high" })
                      }
                    >
                      Very
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="personal-notes">Personal notes</Label>
                <Textarea
                  id="personal-notes"
                  placeholder="Add your personal notes about this strategy..."
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleSavePersonalNote}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {similarWisdom.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Similar Insights</h3>
            <div className="grid grid-cols-1 gap-4">
              {similarWisdom.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => onSelectSimilar(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-2 mb-2">
                      <Badge className={getCategoryBadgeClass()}>
                        {formatCategory(item.category)}
                      </Badge>
                      <Badge variant="outline">
                        {item.situation}
                      </Badge>
                    </div>
                    <p className="line-clamp-2">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WisdomDetail;
