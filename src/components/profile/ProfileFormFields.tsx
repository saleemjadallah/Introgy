
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormFieldsProps {
  userData: {
    displayName: string;
    email: string;
    bio: string;
    introvertLevel: number;
    joinDate: string;
  };
  isEditing: boolean;
  setUserData: (userData: any) => void;
}

const ProfileFormFields = ({ userData, isEditing, setUserData }: ProfileFormFieldsProps) => {
  return (
    <div className="space-y-4 flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          {isEditing ? (
            <Input 
              id="displayName" 
              value={userData.displayName} 
              onChange={(e) => setUserData({...userData, displayName: e.target.value})}
            />
          ) : (
            <div className="text-lg font-medium">{userData.displayName}</div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="text-lg font-medium text-muted-foreground">{userData.email}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        {isEditing ? (
          <Textarea 
            id="bio" 
            value={userData.bio} 
            onChange={(e) => setUserData({...userData, bio: e.target.value})}
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground">{userData.bio}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="introvertLevel">Introvert Level</Label>
          {isEditing ? (
            <Input 
              id="introvertLevel" 
              type="range" 
              min="1" 
              max="10" 
              value={userData.introvertLevel} 
              onChange={(e) => setUserData({...userData, introvertLevel: parseInt(e.target.value)})}
              className="w-full"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${userData.introvertLevel * 10}%` }}></div>
              </div>
              <span className="text-sm font-medium">{userData.introvertLevel}/10</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Member Since</Label>
          <div className="text-muted-foreground">{userData.joinDate}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFormFields;
