
import { useState } from "react";
import { WisdomItem, WisdomCategory, SituationType, EnergyLevel } from "@/types/community-wisdom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";

interface WisdomSubmissionFormProps {
  onSubmit: (wisdom: WisdomItem) => void;
}

const WisdomSubmissionForm = ({ onSubmit }: WisdomSubmissionFormProps) => {
  const [formState, setFormState] = useState({
    content: "",
    category: "" as WisdomCategory,
    situation: "" as SituationType,
    energyLevel: "" as EnergyLevel,
    tagInput: "",
    tags: [] as string[],
    preview: false,
  });

  const handleTagAdd = () => {
    if (
      formState.tagInput &&
      !formState.tags.includes(formState.tagInput) &&
      formState.tags.length < 5
    ) {
      setFormState({
        ...formState,
        tags: [...formState.tags, formState.tagInput],
        tagInput: "",
      });
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormState({
      ...formState,
      tags: formState.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const newWisdom: WisdomItem = {
      id: uuidv4(),
      content: formState.content,
      category: formState.category,
      situation: formState.situation,
      energyLevel: formState.energyLevel,
      tags: formState.tags,
      helpfulCount: 0,
      comments: [],
      dateSubmitted: new Date().toISOString(),
    };

    onSubmit(newWisdom);
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      content: "",
      category: "" as WisdomCategory,
      situation: "" as SituationType,
      energyLevel: "" as EnergyLevel,
      tagInput: "",
      tags: [],
      preview: false,
    });
  };

  const isFormValid = () => {
    return (
      formState.content.length >= 20 &&
      formState.category &&
      formState.situation &&
      formState.energyLevel
    );
  };

  const togglePreview = () => {
    setFormState({
      ...formState,
      preview: !formState.preview,
    });
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get category badge class
  const getCategoryBadgeClass = () => {
    switch (formState.category) {
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

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-md border flex items-start gap-3">
        <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h3 className="font-medium mb-1">About Contributing</h3>
          <p className="text-sm text-muted-foreground">
            Your contribution will be completely anonymous. Share strategies that have
            worked for you as an introvert, but avoid including any personally
            identifying details. All submissions are reviewed to ensure they
            meet our community guidelines.
          </p>
        </div>
      </div>

      {formState.preview ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={togglePreview}>
            Back to Edit
          </Button>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <Badge className={getCategoryBadgeClass()}>
                  {formState.category ? formatCategory(formState.category) : "Category"}
                </Badge>
              </div>

              <div className="prose max-w-none dark:prose-invert mb-4">
                <p>{formState.content}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {formState.situation && (
                  <Badge variant="outline">
                    {formState.situation}
                  </Badge>
                )}
                {formState.energyLevel && (
                  <Badge variant="outline">
                    <span className="capitalize">{formState.energyLevel}</span> energy
                  </Badge>
                )}
              </div>

              {formState.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  {formState.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select
              value={formState.category}
              onValueChange={(value) =>
                setFormState({ ...formState, category: value as WisdomCategory })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="practical-strategies">
                  Practical Strategies
                </SelectItem>
                <SelectItem value="personal-insights">
                  Personal Insights
                </SelectItem>
                <SelectItem value="success-stories">
                  Success Stories
                </SelectItem>
                <SelectItem value="coping-techniques">
                  Coping Techniques
                </SelectItem>
                <SelectItem value="resources">
                  Resources
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="situation">Situation <span className="text-red-500">*</span></Label>
              <Select
                value={formState.situation}
                onValueChange={(value) =>
                  setFormState({ ...formState, situation: value as SituationType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="daily-life">Daily Life</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energyLevel">Energy Level Required <span className="text-red-500">*</span></Label>
              <Select
                value={formState.energyLevel}
                onValueChange={(value) =>
                  setFormState({ ...formState, energyLevel: value as EnergyLevel })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select energy level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Energy</SelectItem>
                  <SelectItem value="medium">Medium Energy</SelectItem>
                  <SelectItem value="high">High Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Your Wisdom <span className="text-red-500">*</span>
              <span className="text-muted-foreground text-xs ml-2">
                ({formState.content.length}/1000 characters)
              </span>
            </Label>
            <Textarea
              id="content"
              placeholder="Share your introvert wisdom, strategy, or insight..."
              value={formState.content}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  content: e.target.value.slice(0, 1000),
                })
              }
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">
              Tags <span className="text-xs text-muted-foreground">(up to 5)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={formState.tagInput}
                onChange={(e) =>
                  setFormState({ ...formState, tagInput: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTagAdd();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleTagAdd}
                disabled={
                  !formState.tagInput ||
                  formState.tags.includes(formState.tagInput) ||
                  formState.tags.length >= 5
                }
              >
                Add
              </Button>
            </div>
            {formState.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formState.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleTagRemove(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetForm}>
              Clear Form
            </Button>
            <Button
              variant="outline"
              onClick={togglePreview}
              disabled={!isFormValid()}
            >
              Preview
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WisdomSubmissionForm;
