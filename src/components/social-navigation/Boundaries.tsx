
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Plus, X } from "lucide-react";

const Boundaries = () => {
  const [boundaries, setBoundaries] = useState<string[]>([
    "I can leave early if I need to",
    "It's okay to take breaks when needed",
    "I don't have to answer personal questions"
  ]);
  const [newBoundary, setNewBoundary] = useState("");
  
  const handleAddBoundary = () => {
    if (newBoundary.trim() === "") return;
    setBoundaries([...boundaries, newBoundary]);
    setNewBoundary("");
  };
  
  const handleRemoveBoundary = (index: number) => {
    setBoundaries(boundaries.filter((_, i) => i !== index));
  };

  return (
    <Card className="navigation-container-gradient w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Bell className="h-5 w-5 text-periwinkle" />
          Personal Boundaries
        </CardTitle>
        <CardDescription className="text-sm">
          Reminders of your personal limits for this social event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="flex gap-2 max-w-[calc(100vw-3rem)] sm:max-w-none">
          <Input 
            placeholder="Add a boundary reminder..." 
            value={newBoundary}
            onChange={(e) => setNewBoundary(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddBoundary()}
            className="flex-1 min-w-0"
          />
          <Button onClick={handleAddBoundary} size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 overflow-x-hidden">
          {boundaries.map((boundary, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-muted rounded-md text-sm sm:text-base"
            >
              <span className="mr-2 break-words flex-1 overflow-hidden">{boundary}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 shrink-0" 
                onClick={() => handleRemoveBoundary(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {boundaries.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Add some personal boundaries to remember during the event
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Boundaries;
