
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CommunicationProfile } from '@/types/communication-preferences';
import { Check, MessageSquare, Users, Clock, Battery } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AIEnhancementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  enhancements: any;
  profile: Partial<CommunicationProfile>;
  onApplyEnhancements: (updatedProfile: Partial<CommunicationProfile>) => void;
}

const AIEnhancementsDialog = ({
  isOpen,
  onClose,
  enhancements,
  profile,
  onApplyEnhancements
}: AIEnhancementsDialogProps) => {
  const [activeTab, setActiveTab] = useState('inconsistencies');
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);
  
  if (!enhancements || !profile) return null;
  
  const handleToggleEnhancement = (key: string) => {
    if (selectedEnhancements.includes(key)) {
      setSelectedEnhancements(selectedEnhancements.filter(k => k !== key));
    } else {
      setSelectedEnhancements([...selectedEnhancements, key]);
    }
  };
  
  const handleApplyEnhancements = () => {
    // Create a deep copy of the profile
    const updatedProfile = JSON.parse(JSON.stringify(profile));
    
    // Apply selected enhancements
    if (selectedEnhancements.includes('channelPreferences') && enhancements.improvements?.channelPreferences) {
      Object.assign(updatedProfile.channelPreferences, enhancements.improvements.channelPreferences);
    }
    
    if (selectedEnhancements.includes('interactionStyle') && enhancements.improvements?.interactionStyle) {
      Object.assign(updatedProfile.interactionStyle, enhancements.improvements.interactionStyle);
    }
    
    if (selectedEnhancements.includes('boundaries') && enhancements.improvements?.boundaries) {
      Object.assign(updatedProfile.boundaries, enhancements.improvements.boundaries);
    }
    
    if (selectedEnhancements.includes('energyManagement') && enhancements.improvements?.energyManagement) {
      Object.assign(updatedProfile.energyManagement, enhancements.improvements.energyManagement);
    }
    
    // Apply new suggestions if selected
    if (selectedEnhancements.includes('exitPhrases') && enhancements.newSuggestions?.exitPhrases) {
      updatedProfile.energyManagement.exitPhrases = [
        ...new Set([...updatedProfile.energyManagement.exitPhrases, ...enhancements.newSuggestions.exitPhrases])
      ];
    }
    
    if (selectedEnhancements.includes('depletionSignals') && enhancements.newSuggestions?.depletionSignals) {
      updatedProfile.energyManagement.depletionSignals = [
        ...new Set([...updatedProfile.energyManagement.depletionSignals, ...enhancements.newSuggestions.depletionSignals])
      ];
    }
    
    if (selectedEnhancements.includes('preferredTopics') && enhancements.newSuggestions?.preferredTopics) {
      updatedProfile.interactionStyle.preferredTopics = [
        ...new Set([...updatedProfile.interactionStyle.preferredTopics, ...enhancements.newSuggestions.preferredTopics])
      ];
    }
    
    onApplyEnhancements(updatedProfile);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Enhancement Suggestions</DialogTitle>
          <DialogDescription>
            Review and select the improvements you'd like to apply to your communication profile
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inconsistencies" className="text-xs">
              Insights
            </TabsTrigger>
            <TabsTrigger value="improvements" className="text-xs">
              Improvements
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">
              New Items
            </TabsTrigger>
            <TabsTrigger value="explanation" className="text-xs">
              Explanation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inconsistencies" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Potential Inconsistencies and Insights</h3>
            {enhancements.inconsistencies?.length > 0 ? (
              <ul className="space-y-2">
                {enhancements.inconsistencies.map((item: string, index: number) => (
                  <li key={index} className="text-sm bg-muted p-3 rounded-md">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No inconsistencies were found in your profile</p>
            )}
          </TabsContent>
          
          <TabsContent value="improvements" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Suggested Improvements</h3>
            
            {enhancements.improvements?.channelPreferences && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">Channel Preferences</h4>
                  </div>
                  <Button 
                    variant={selectedEnhancements.includes('channelPreferences') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleEnhancement('channelPreferences')}
                  >
                    {selectedEnhancements.includes('channelPreferences') ? <Check className="h-4 w-4" /> : "Select"}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <pre className="text-xs overflow-auto p-2 bg-muted rounded-md">
                    {JSON.stringify(enhancements.improvements.channelPreferences, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {enhancements.improvements?.interactionStyle && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">Interaction Style</h4>
                  </div>
                  <Button 
                    variant={selectedEnhancements.includes('interactionStyle') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleEnhancement('interactionStyle')}
                  >
                    {selectedEnhancements.includes('interactionStyle') ? <Check className="h-4 w-4" /> : "Select"}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <pre className="text-xs overflow-auto p-2 bg-muted rounded-md">
                    {JSON.stringify(enhancements.improvements.interactionStyle, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {enhancements.improvements?.boundaries && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">Boundaries</h4>
                  </div>
                  <Button 
                    variant={selectedEnhancements.includes('boundaries') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleEnhancement('boundaries')}
                  >
                    {selectedEnhancements.includes('boundaries') ? <Check className="h-4 w-4" /> : "Select"}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <pre className="text-xs overflow-auto p-2 bg-muted rounded-md">
                    {JSON.stringify(enhancements.improvements.boundaries, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {enhancements.improvements?.energyManagement && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">Energy Management</h4>
                  </div>
                  <Button 
                    variant={selectedEnhancements.includes('energyManagement') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleEnhancement('energyManagement')}
                  >
                    {selectedEnhancements.includes('energyManagement') ? <Check className="h-4 w-4" /> : "Select"}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <pre className="text-xs overflow-auto p-2 bg-muted rounded-md">
                    {JSON.stringify(enhancements.improvements.energyManagement, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">New Suggested Items</h3>
            
            {enhancements.newSuggestions?.exitPhrases?.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Exit Phrases</h4>
                  <Button 
                    variant={selectedEnhancements.includes('exitPhrases') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleEnhancement('exitPhrases')}
                  >
                    {selectedEnhancements.includes('exitPhrases') ? <Check className="h-4 w-4" /> : "Select"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enhancements.newSuggestions.exitPhrases.map((phrase: string, index: number) => (
                    <Badge key={index} variant="secondary">{phrase}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {enhancements.newSuggestions?.depletionSignals?.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Depletion Signals</h4>
                  <Button 
                    variant={selectedEnhancements.includes('depletionSignals') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleEnhancement('depletionSignals')}
                  >
                    {selectedEnhancements.includes('depletionSignals') ? <Check className="h-4 w-4" /> : "Select"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enhancements.newSuggestions.depletionSignals.map((signal: string, index: number) => (
                    <Badge key={index} variant="secondary">{signal}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {enhancements.newSuggestions?.preferredTopics?.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Preferred Topics</h4>
                  <Button 
                    variant={selectedEnhancements.includes('preferredTopics') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleEnhancement('preferredTopics')}
                  >
                    {selectedEnhancements.includes('preferredTopics') ? <Check className="h-4 w-4" /> : "Select"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enhancements.newSuggestions.preferredTopics.map((topic: string, index: number) => (
                    <Badge key={index} variant="secondary">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="explanation" className="mt-4">
            <h3 className="text-sm font-medium">Explanation</h3>
            <div className="p-4 bg-muted rounded-md mt-2">
              <p className="text-sm whitespace-pre-line">{enhancements.explanation}</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApplyEnhancements}
              disabled={selectedEnhancements.length === 0}
            >
              Apply {selectedEnhancements.length} Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIEnhancementsDialog;
