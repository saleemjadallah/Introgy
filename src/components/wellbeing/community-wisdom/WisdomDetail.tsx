
import { WisdomItem } from "@/types/community-wisdom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Bookmark, BookmarkCheck, MessageSquare, CalendarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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
  const [comment, setComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "unknown date";
    }
  };

  // Get category badge class
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
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
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const submitComment = () => {
    if (comment.trim()) {
      // Here we would normally submit the comment to a server
      // For now we'll just show a success message and reset form
      setComment("");
      setShowCommentForm(false);
      
      // This should be implemented in the parent component
      // const newComment = {
      //   id: `comment-${Date.now()}`,
      //   text: comment,
      //   dateSubmitted: new Date().toISOString(),
      // };
      // onAddComment(wisdom.id, newComment);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <Badge className={`${getCategoryBadgeClass(wisdom.category)}`}>
              {formatCategory(wisdom.category)}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkHelpful(wisdom.id)}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                Helpful ({wisdom.helpfulCount})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleSave(wisdom.id)}
                className="flex items-center gap-1"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-primary" />
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
          </div>

          <div className="prose max-w-none dark:prose-invert mb-6">
            <p className="text-base">{wisdom.content}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{wisdom.situation}</Badge>
            <Badge variant="outline">
              <span className="capitalize">{wisdom.energyLevel}</span> energy
            </Badge>
            {wisdom.tags.length > 0 &&
              wisdom.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
          </div>

          <div className="flex items-center text-sm text-muted-foreground gap-1 mb-6">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Shared {formatDate(wisdom.dateSubmitted)}</span>
          </div>

          {/* Comments section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">
                Comments ({wisdom.comments.length})
              </h3>
              {!showCommentForm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentForm(true)}
                  className="text-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  Add Comment
                </Button>
              )}
            </div>

            {showCommentForm && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Share how this wisdom helped you..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCommentForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={submitComment}
                    disabled={comment.trim() === ""}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {wisdom.comments.length > 0 ? (
              <div className="space-y-4">
                {wisdom.comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-0">
                    <p className="text-sm mb-1">{comment.text}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.dateSubmitted)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Similar wisdom section */}
      {similarWisdom.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Similar Wisdom</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarWisdom.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onSelectSimilar(item)}
              >
                <CardContent className="pt-6">
                  <Badge className={`${getCategoryBadgeClass(item.category)} mb-2`}>
                    {formatCategory(item.category)}
                  </Badge>
                  <p className="line-clamp-3 text-sm mb-2">{item.content}</p>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{item.helpfulCount} helpful</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WisdomDetail;
