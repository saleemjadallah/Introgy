
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Heart, Clock, Battery, Zap, MessageCircle, ThumbsUp, ThumbsDown, Edit, Save, X } from "lucide-react";
import { useStrategy } from "@/hooks/useStrategy";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StrategyDetailProps {
  strategyId: string;
  onBack: () => void;
  toggleFavorite: (strategyId: string) => void;
}

const StrategyDetail = ({ strategyId, onBack, toggleFavorite }: StrategyDetailProps) => {
  const { strategy, relatedStrategies, saveNote, rateEffectiveness } = useStrategy(strategyId);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(strategy?.personalNote || "");

  if (!strategy) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Strategy not found</p>
        <Button variant="link" onClick={onBack} className="mt-2">
          Back to strategies
        </Button>
      </div>
    );
  }

  const handleSaveNote = () => {
    saveNote(strategyId, noteText);
    setIsEditingNote(false);
  };

  // Strategy type icon
  const getStrategyTypeIcon = () => {
    switch (strategy.type) {
      case "quick": return <Zap className="h-4 w-4" />;
      case "preparation": return <Clock className="h-4 w-4" />;
      case "recovery": return <Battery className="h-4 w-4" />;
      case "energy-conservation": return <Battery className="h-4 w-4" />;
      case "connection": return <Heart className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  // Energy level class
  const getEnergyLevelClass = () => {
    switch (strategy.energyLevel) {
      case "low": return "bg-green-500/10 text-green-600";
      case "medium": return "bg-yellow-500/10 text-yellow-600";
      case "high": return "bg-red-500/10 text-red-600";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleFavorite(strategy.id)}
        >
          <Heart
            className={`h-4 w-4 ${
              strategy.isFavorite ? "fill-primary text-primary" : ""
            }`}
          />
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold">{strategy.title}</h3>
        <p className="text-muted-foreground mt-1">{strategy.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={`flex items-center gap-1 ${getEnergyLevelClass()}`}
        >
          <Battery className="h-3 w-3" />
          <span className="capitalize">{strategy.energyLevel}</span> energy
        </Badge>
        <Badge
          variant="outline"
          className="flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          {strategy.prepTime} min
        </Badge>
        <Badge className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
          {getStrategyTypeIcon()}
          <span className="capitalize">{strategy.type.replace("-", " ")}</span>
        </Badge>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">How to implement this strategy</h4>
        <ol className="space-y-2 pl-5 list-decimal">
          {strategy.steps.map((step, index) => (
            <li key={index} className="text-sm">{step}</li>
          ))}
        </ol>
      </div>

      {strategy.examplePhrases && strategy.examplePhrases.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Example phrases</h4>
          <div className="space-y-2">
            {strategy.examplePhrases.map((phrase, index) => (
              <Alert key={index} className="bg-primary/5 text-sm py-2">
                <MessageCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{phrase}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-medium">Potential challenges</h4>
        <div className="space-y-2">
          {strategy.challenges.map((challenge, index) => (
            <div key={index} className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium mb-1">{challenge.challenge}</p>
              <p className="text-sm text-muted-foreground">{challenge.solution}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Personal notes</h4>
          {!isEditingNote ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingNote(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              {strategy.personalNote ? "Edit" : "Add"} Note
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveNote}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditingNote(false);
                  setNoteText(strategy.personalNote || "");
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {isEditingNote ? (
          <Textarea
            placeholder="Add your personal notes about this strategy..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="min-h-[100px]"
          />
        ) : (
          <div className="bg-muted p-3 rounded-md">
            {strategy.personalNote ? (
              <p className="text-sm">{strategy.personalNote}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No personal notes yet. Click "Add Note" to add your thoughts.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Rate this strategy</h4>
        <div className="flex space-x-2">
          <Button
            variant={strategy.rating === "effective" ? "default" : "outline"}
            size="sm"
            className="flex gap-1"
            onClick={() => rateEffectiveness(strategyId, "effective")}
          >
            <ThumbsUp className="h-4 w-4" />
            Effective
          </Button>
          <Button
            variant={strategy.rating === "neutral" ? "default" : "outline"}
            size="sm"
            className="flex gap-1"
            onClick={() => rateEffectiveness(strategyId, "neutral")}
          >
            Neutral
          </Button>
          <Button
            variant={strategy.rating === "ineffective" ? "default" : "outline"}
            size="sm"
            className="flex gap-1"
            onClick={() => rateEffectiveness(strategyId, "ineffective")}
          >
            <ThumbsDown className="h-4 w-4" />
            Ineffective
          </Button>
        </div>
      </div>

      {relatedStrategies.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="font-medium">Related strategies</h4>
          <div className="grid grid-cols-1 gap-2">
            {relatedStrategies.map((related) => (
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
                    onClick={() => {
                      onBack(); // This ensures we're back at the strategies list
                      setTimeout(() => { /* Using setTimeout to ensure state updates before selecting new strategy */
                        const detailElement = document.getElementById(related.id);
                        if (detailElement) detailElement.scrollIntoView({ behavior: 'smooth' });
                      }, 0);
                    }}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyDetail;
