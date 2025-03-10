
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoonStar, Moon, CloudMoon } from "lucide-react";
import { useSocialBattery } from "@/hooks/useSocialBattery";

export type SleepQuality = "good" | "medium" | "bad";

interface SleepQualityOption {
  value: SleepQuality;
  label: string;
  icon: React.ReactNode;
  description: string;
  effect: string;
}

export function SleepQualityDialog() {
  const [open, setOpen] = useState(false);
  const { recordSleepQuality } = useSocialBattery();

  useEffect(() => {
    const checkSleepTracking = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Only show between 6AM and noon
      if (hour >= 6 && hour < 12) {
        // Check if we've already asked today
        const lastAskedDate = localStorage.getItem("lastSleepQualityPrompt");
        
        if (lastAskedDate) {
          const lastAsked = new Date(lastAskedDate);
          // If we already asked today, don't ask again
          if (lastAsked.toDateString() === now.toDateString()) {
            return;
          }
        }
        
        // Show dialog and record that we asked today
        setOpen(true);
        localStorage.setItem("lastSleepQualityPrompt", now.toISOString());
      }
    };
    
    // Check on component mount
    const timeoutId = setTimeout(checkSleepTracking, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const sleepOptions: SleepQualityOption[] = [
    {
      value: "good",
      label: "Good Sleep",
      icon: <MoonStar className="h-10 w-10 text-blue-500" />,
      description: "Restful and refreshing",
      effect: "+50% battery"
    },
    {
      value: "medium",
      label: "OK Sleep",
      icon: <Moon className="h-10 w-10 text-amber-500" />,
      description: "Could have been better",
      effect: "+10% battery"
    },
    {
      value: "bad",
      label: "Poor Sleep",
      icon: <CloudMoon className="h-10 w-10 text-red-500" />,
      description: "Restless or insufficient",
      effect: "-5% battery"
    }
  ];

  const handleSleepSelection = (quality: SleepQuality) => {
    recordSleepQuality(quality);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How did you sleep?</DialogTitle>
          <DialogDescription>
            Your sleep quality affects your social battery level for the day.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          {sleepOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 px-2 hover:bg-muted"
              onClick={() => handleSleepSelection(option.value)}
            >
              {option.icon}
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.effect}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
