import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  MessageSquare, 
  Users, 
  FileEdit,
  Check,
  ArrowRight
} from 'lucide-react';
import { profileTemplates } from '@/data/communicationTemplates';
import { CommunicationProfile } from '@/types/communication-preferences';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TemplateSelectorProps {
  onSelectTemplate: (profile: CommunicationProfile) => void;
  onCancel: () => void;
}

const TemplateSelector = ({ onSelectTemplate, onCancel }: TemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [profileName, setProfileName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'async-first':
        return <MessageSquare className="h-5 w-5" />;
      case 'deep-connector':
        return <Users className="h-5 w-5" />;
      case 'structured-socializer':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <FileEdit className="h-5 w-5" />;
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = profileTemplates.find(t => t.id === templateId);
    if (template) {
      setProfileName(template.profile.profileName || '');
      setDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    const template = profileTemplates.find(t => t.id === selectedTemplate);
    if (template && profileName) {
      const newProfile = {
        ...template.profile,
        profileName,
      } as CommunicationProfile;
      
      onSelectTemplate(newProfile);
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
        <p className="text-muted-foreground">
          Start with a template that's close to your preferences, then customize it to match your exact needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedTemplate === template.id ? 'border-primary' : ''
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTemplateIcon(template.id)}
                {template.name}
                {selectedTemplate === template.id && (
                  <span className="ml-auto text-primary">
                    <Check className="h-5 w-5" />
                  </span>
                )}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <TemplateHighlight 
                  template={template.id} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Communication Profile</DialogTitle>
            <DialogDescription>
              Give your profile a name that helps you remember its purpose or context.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="profileName">Profile Name</Label>
            <Input
              id="profileName"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="e.g., Work Communication Style"
              className="mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!profileName.trim()}>
              Create Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel} className="mr-2">
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Helper component to show appropriate highlights based on template
const TemplateHighlight = ({ template }: { template: string }) => {
  switch (template) {
    case 'async-first':
      return (
        <>
          <div className="flex justify-between items-center">
            <span className="font-medium">Preferred channels:</span>
            <span>Text messaging, Email</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Response times:</span>
            <span>Text: 4h, Email: 24h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Conversation depth:</span>
            <span>Prefers deeper conversations</span>
          </div>
        </>
      );
    case 'deep-connector':
      return (
        <>
          <div className="flex justify-between items-center">
            <span className="font-medium">Preferred channels:</span>
            <span>In-person, Video call</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Group size:</span>
            <span>1-3 people</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Advance notice:</span>
            <span>Prefers 1 week</span>
          </div>
        </>
      );
    case 'structured-socializer':
      return (
        <>
          <div className="flex justify-between items-center">
            <span className="font-medium">Preferred channels:</span>
            <span>Email, Video call</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Ideal duration:</span>
            <span>60 min with breaks</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Planning needs:</span>
            <span>High (8/10)</span>
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="flex justify-between items-center">
            <span className="font-medium">Start from:</span>
            <span>Minimal defaults</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Customization:</span>
            <span>Complete control</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Visibility:</span>
            <span>You choose what to share</span>
          </div>
        </>
      );
  }
};

export default TemplateSelector;