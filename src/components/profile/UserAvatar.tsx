
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface UserAvatarProps {
  imageUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  status?: "online" | "offline" | "busy" | "away";
}

export const UserAvatar = ({
  imageUrl,
  name,
  size = "md",
  showStatus = false,
  status = "offline"
}: UserAvatarProps) => {
  const getSizeClass = () => {
    switch (size) {
      case "sm": return "h-8 w-8";
      case "lg": return "h-12 w-12";
      default: return "h-10 w-10";
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case "online": return "bg-green-500";
      case "busy": return "bg-red-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "";

  return (
    <div className="relative">
      <Avatar className={getSizeClass()}>
        <AvatarImage src={imageUrl} alt={name || "User avatar"} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials || <User className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span 
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusClass()}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
