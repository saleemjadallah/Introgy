
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface FormFooterProps {
  isEditing: boolean;
  onCancel: () => void;
}

const FormFooter = ({ isEditing, onCancel }: FormFooterProps) => {
  return (
    <CardFooter className="flex justify-between sticky bottom-0 bg-card border-t py-3">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update Event" : "Create Event"}
      </Button>
    </CardFooter>
  );
};

export default FormFooter;
