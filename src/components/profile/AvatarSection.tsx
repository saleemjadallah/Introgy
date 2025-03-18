
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/profile/UserAvatar";

interface AvatarSectionProps {
  displayName: string;
  isEditing: boolean;
}

const AvatarSection = ({ displayName, isEditing }: AvatarSectionProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <UserAvatar size="lg" name={displayName} />
      {isEditing && (
        <Button variant="outline" size="sm" className="text-xs">
          Change Avatar
        </Button>
      )}
    </div>
  );
};

export default AvatarSection;
