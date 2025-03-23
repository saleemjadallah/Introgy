
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, MessageCircle, ArrowRight, DoorOpen, Reply } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIPhrasesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phrases: {
    introductions: string[];
    boundaries: string[];
    exitStrategies: string[];
    followUps: string[];
    explanation: string;
  } | null;
}

const AIPhrasesDialog = ({
  isOpen,
  onClose,
  phrases
}: AIPhrasesDialogProps) => {
  const { toast } = useToast();
  const [copiedPhrases, setCopiedPhrases] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('introductions');
  
  // Add null check to handle cases where phrases is null
  if (!phrases) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI-Generated Communication Phrases</DialogTitle>
            <DialogDescription>
              No phrases have been generated yet. Please generate some phrases first.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhrases([...copiedPhrases, text]);
    
    toast({
      title: 'Copied to clipboard',
      description: 'Phrase copied and ready to use',
    });
    
    // Remove from copied list after 3 seconds
    setTimeout(() => {
      setCopiedPhrases(prev => prev.filter(p => p !== text));
    }, 3000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>AI-Generated Communication Phrases</DialogTitle>
          <DialogDescription>
            Use these phrases as templates for your communication needs
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="introductions" className="flex flex-col items-center gap-1 py-2 h-auto">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Intros</span>
            </TabsTrigger>
            <TabsTrigger value="boundaries" className="flex flex-col items-center gap-1 py-2 h-auto">
              <ArrowRight className="h-4 w-4" />
              <span className="text-xs">Boundaries</span>
            </TabsTrigger>
            <TabsTrigger value="exits" className="flex flex-col items-center gap-1 py-2 h-auto">
              <DoorOpen className="h-4 w-4" />
              <span className="text-xs">Exits</span>
            </TabsTrigger>
            <TabsTrigger value="followups" className="flex flex-col items-center gap-1 py-2 h-auto">
              <Reply className="h-4 w-4" />
              <span className="text-xs">Follow-ups</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="introductions" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Introduction Phrases</h3>
            <div className="space-y-2">
              {phrases.introductions.map((phrase, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                  <p className="text-sm flex-1 mr-3">{phrase}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(phrase)}
                    className="h-8 flex-shrink-0"
                  >
                    {copiedPhrases.includes(phrase) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="boundaries" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Boundary-Setting Phrases</h3>
            <div className="space-y-2">
              {phrases.boundaries.map((phrase, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                  <p className="text-sm flex-1 mr-3">{phrase}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(phrase)}
                    className="h-8 flex-shrink-0"
                  >
                    {copiedPhrases.includes(phrase) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="exits" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Exit Strategies</h3>
            <div className="space-y-2">
              {phrases.exitStrategies.map((phrase, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                  <p className="text-sm flex-1 mr-3">{phrase}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(phrase)}
                    className="h-8 flex-shrink-0"
                  >
                    {copiedPhrases.includes(phrase) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="followups" className="mt-4 space-y-4">
            <h3 className="text-sm font-medium">Follow-Up Templates</h3>
            <div className="space-y-2">
              {phrases.followUps.map((phrase, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                  <p className="text-sm flex-1 mr-3">{phrase}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(phrase)}
                    className="h-8 flex-shrink-0"
                  >
                    {copiedPhrases.includes(phrase) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-3 bg-muted rounded-md">
          <h4 className="text-sm font-medium mb-2">Why These Phrases Work For You</h4>
          <p className="text-sm text-muted-foreground">{phrases.explanation}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPhrasesDialog;
