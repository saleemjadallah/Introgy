
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EventForm from "../EventForm";
import { SocialEvent } from "@/types/events";

interface EventFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingEvent: SocialEvent | null;
  onSubmit: (event: SocialEvent) => void;
  onCancel: () => void;
  triggerButton?: React.ReactNode;
}

const EventFormDialog = ({ 
  isOpen, 
  setIsOpen, 
  editingEvent, 
  onSubmit, 
  onCancel,
  triggerButton 
}: EventFormDialogProps) => {
  const isEditing = !!editingEvent;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton && (
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details for this event" 
              : "Add details about an upcoming social event you'll attend"
            }
          </DialogDescription>
        </DialogHeader>
        <EventForm 
          initialEvent={editingEvent || undefined}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
