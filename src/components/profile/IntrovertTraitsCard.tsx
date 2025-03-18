
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface IntrovertTraitsCardProps {
  introvertPreferences: {
    energyDrains: string[];
    energyGains: string[];
    communicationStyle: string;
    socialGoals: string;
  };
  isEditing: boolean;
}

const IntrovertTraitsCard = ({ introvertPreferences, isEditing }: IntrovertTraitsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Introvert Traits & Preferences</CardTitle>
        <CardDescription>
          How you experience introversion and what works best for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Energy Drains</Label>
            <div className="flex flex-wrap gap-2">
              {introvertPreferences.energyDrains.map(item => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Energy Gains</Label>
            <div className="flex flex-wrap gap-2">
              {introvertPreferences.energyGains.map(item => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Communication Style</Label>
            <div className="text-muted-foreground">
              {introvertPreferences.communicationStyle}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Social Goals</Label>
            <div className="text-muted-foreground">
              {introvertPreferences.socialGoals}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/onboarding")}
          >
            Update Introvert Preferences
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default IntrovertTraitsCard;
