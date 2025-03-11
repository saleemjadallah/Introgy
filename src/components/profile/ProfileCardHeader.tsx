
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileCardHeaderProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSave: () => void;
}

const ProfileCardHeader = ({ isEditing, setIsEditing, onSave }: ProfileCardHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Manage your personal details and profile information
        </CardDescription>
      </div>
      {!isEditing ? (
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit size={16} className="mr-2" /> Edit
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={onSave}>
            <Save size={16} className="mr-2" /> Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            <X size={16} className="mr-1" /> Cancel
          </Button>
        </div>
      )}
    </CardHeader>
  );
};

export default ProfileCardHeader;
