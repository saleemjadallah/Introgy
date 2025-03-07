
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface EmptyEventsListProps {
  onAddFirstEvent: () => void;
}

const EmptyEventsList = ({ onAddFirstEvent }: EmptyEventsListProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10 text-center">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No events yet</h3>
        <p className="text-muted-foreground mb-6">
          Add your upcoming social events to prepare for them
        </p>
        <Button onClick={onAddFirstEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Event
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyEventsList;
