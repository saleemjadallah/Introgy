
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";

interface StrategyNotesProps {
  strategyId: string;
  currentNote: string | undefined;
  saveNote: (strategyId: string, note: string) => void;
}

const StrategyNotes = ({ strategyId, currentNote, saveNote }: StrategyNotesProps) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(currentNote || "");

  const handleSaveNote = () => {
    saveNote(strategyId, noteText);
    setIsEditingNote(false);
  };

  return (
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
            {currentNote ? "Edit" : "Add"} Note
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
                setNoteText(currentNote || "");
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
          {currentNote ? (
            <p className="text-sm">{currentNote}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No personal notes yet. Click "Add Note" to add your thoughts.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StrategyNotes;
