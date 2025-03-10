
import { useState } from 'react';
import { Check, X, Trash2, Sliders, PlusCircle, Settings, Info, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RelationshipSettings = () => {
  const { toast } = useToast();
  const [autoHealthScoreEnabled, setAutoHealthScoreEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState('weekly');
  const [showArchived, setShowArchived] = useState(false);
  const [defaultImportanceLevel, setDefaultImportanceLevel] = useState('3');
  const [defaultCategory, setDefaultCategory] = useState('friend');
  
  const handleResetSettings = () => {
    setAutoHealthScoreEnabled(true);
    setReminderFrequency('weekly');
    setShowArchived(false);
    setDefaultImportanceLevel('3');
    setDefaultCategory('friend');
    
    toast({
      title: "Settings Reset",
      description: "Your relationship inventory settings have been reset to defaults."
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your relationship inventory settings have been updated."
    });
  };
  
  const handleClearData = () => {
    toast({
      title: "Data Cleared",
      description: "All relationship data has been removed.",
      variant: "destructive"
    });
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <span>Relationship Inventory Settings</span>
        </h3>
      </div>
      
      <div className="p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="display-settings">
            <AccordionTrigger className="text-base font-medium">
              <Eye className="h-4 w-4 mr-2" />
              Display Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-archived">Show Archived Contacts</Label>
                  <p className="text-sm text-muted-foreground">Display archived contacts in your relationship views</p>
                </div>
                <Switch 
                  id="show-archived" 
                  checked={showArchived} 
                  onCheckedChange={setShowArchived} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-category">Default Category</Label>
                <Select value={defaultCategory} onValueChange={setDefaultCategory}>
                  <SelectTrigger id="default-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="acquaintance">Acquaintance</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default category for new contacts</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-importance">Default Importance Level</Label>
                <Select value={defaultImportanceLevel} onValueChange={setDefaultImportanceLevel}>
                  <SelectTrigger id="default-importance">
                    <SelectValue placeholder="Select importance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Lowest</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - High</SelectItem>
                    <SelectItem value="5">5 - Highest</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default importance level for new contacts</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="automation-settings">
            <AccordionTrigger className="text-base font-medium">
              <RefreshCw className="h-4 w-4 mr-2" />
              Automation Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-health-score">Automatic Health Scores</Label>
                  <p className="text-sm text-muted-foreground">Calculate relationship health scores automatically</p>
                </div>
                <Switch 
                  id="auto-health-score" 
                  checked={autoHealthScoreEnabled} 
                  onCheckedChange={setAutoHealthScoreEnabled} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                  <SelectTrigger id="reminder-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How often to receive relationship maintenance reminders</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="data-management">
            <AccordionTrigger className="text-base font-medium">
              <Info className="h-4 w-4 mr-2" />
              Data Management
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="p-4 border rounded-md bg-slate-50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Import Relationships
                </h4>
                <p className="text-sm text-muted-foreground mb-3">Import contacts from external sources</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" disabled>
                    From CSV
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    From Contacts
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    From Google
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Contact import functionality coming soon
                </p>
              </div>
              
              <div className="p-4 border rounded-md bg-red-50">
                <h4 className="font-medium mb-2 text-red-700 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Danger Zone
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  These actions cannot be undone
                </p>
                
                <div className="space-y-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Clear All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your relationship data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData}>
                          Yes, delete everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Separator className="my-6" />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipSettings;
