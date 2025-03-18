
import { useState } from 'react';
import { useCommunicationProfiles } from '@/hooks/useCommunicationProfiles';
import { SharingConfiguration } from '@/types/communication-preferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  LinkIcon, 
  Copy, 
  Trash2, 
  Calendar, 
  Clock, 
  Eye, 
  Lock, 
  FileText, 
  Share2,
  RefreshCw,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SharingManager = () => {
  const { profiles, shares, createShareLink, revokeShare } = useCommunicationProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [expirationDays, setExpirationDays] = useState<number>(30);
  const [useAccessCode, setUseAccessCode] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [sharingFormat, setSharingFormat] = useState<'link' | 'card' | 'pdf'>('link');
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const selectedProfile = profiles.find(p => p.profileId === selectedProfileId);
  const profileShares = shares.filter(s => s.profileId === selectedProfileId);
  
  const handleCreateShare = () => {
    if (!selectedProfileId) {
      toast({
        title: 'No profile selected',
        description: 'Please select a profile to share.',
        variant: 'destructive',
      });
      return;
    }
    
    const shareConfig = createShareLink(
      selectedProfileId,
      expirationDays,
      useAccessCode ? accessCode : undefined,
      customMessage.trim() || undefined,
      sharingFormat
    );
    
    if (shareConfig) {
      toast({
        title: 'Share link created',
        description: 'Your profile is now ready to share.',
      });
      
      // Reset form
      setExpirationDays(30);
      setUseAccessCode(false);
      setAccessCode('');
      setCustomMessage('');
      setSharingFormat('link');
    }
  };

  const handleCopyLink = (shareId: string) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/connection-builder/shared/${shareId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: 'Link copied',
        description: 'The share link has been copied to your clipboard.',
      });
    });
  };

  const handleRevokeShare = (shareId: string) => {
    revokeShare(shareId);
  };

  const getExpirationStatus = (expiresAt: Date) => {
    const now = new Date();
    if (expiresAt < now) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Expired
        </Badge>
      );
    }
    
    const daysUntil = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 3) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1 bg-orange-500 text-white">
          <Clock className="h-3 w-3" />
          Expires soon
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-500">
        <CheckCheck className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  const getShareIcon = (format: string) => {
    switch (format) {
      case 'link':
        return <LinkIcon className="h-4 w-4" />;
      case 'card':
        return <FileText className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Share</CardTitle>
            <CardDescription>
              Create a shareable link to your communication preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-select">Select a profile to share</Label>
              <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
                <SelectTrigger id="profile-select">
                  <SelectValue placeholder="Choose a profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.profileId} value={profile.profileId}>
                      {profile.profileName}
                      {profile.isDefault && " (Default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiration">Link expiration</Label>
              <Select
                value={expirationDays.toString()}
                onValueChange={(value) => setExpirationDays(parseInt(value))}
              >
                <SelectTrigger id="expiration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="require-password" className="cursor-pointer">
                  Require access code
                </Label>
                <Switch
                  id="require-password"
                  checked={useAccessCode}
                  onCheckedChange={setUseAccessCode}
                />
              </div>
              
              {useAccessCode && (
                <Input
                  type="text"
                  placeholder="Enter an access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-message">Add a custom message (optional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Example: Here are my communication preferences as we discussed..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sharing-format">Sharing format</Label>
              <Select
                value={sharingFormat}
                onValueChange={(value: 'link' | 'card' | 'pdf') => setSharingFormat(value)}
              >
                <SelectTrigger id="sharing-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Simple link</SelectItem>
                  <SelectItem value="card">Visual card</SelectItem>
                  <SelectItem value="pdf">PDF document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={handleCreateShare}
              disabled={!selectedProfileId}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Generate Share Link
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Shares</CardTitle>
            <CardDescription>
              Manage your shared communication profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedProfileId ? (
              <div className="text-center py-8 text-muted-foreground">
                Select a profile to see active shares
              </div>
            ) : profileShares.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active shares for this profile
              </div>
            ) : (
              <div className="space-y-4">
                {profileShares.map((share) => (
                  <div key={share.shareId} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getShareIcon(share.sharingFormat)}
                        <span className="font-medium">
                          {share.sharingFormat.charAt(0).toUpperCase() + share.sharingFormat.slice(1)} Share
                        </span>
                      </div>
                      {getExpirationStatus(new Date(share.expiresAt))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Created:</span>
                      </div>
                      <div>
                        {format(new Date(share.createdAt), 'MMM d, yyyy')}
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Expires:</span>
                      </div>
                      <div>
                        {formatDistanceToNow(new Date(share.expiresAt), { addSuffix: true })}
                      </div>
                      
                      {share.accessCode && (
                        <>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            <span>Protected:</span>
                          </div>
                          <div>Yes (code required)</div>
                        </>
                      )}
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>Views:</span>
                      </div>
                      <div>
                        {share.accessLog.length} {share.accessLog.length === 1 ? 'view' : 'views'}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleCopyLink(share.shareId)}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        {copied ? 'Copied!' : 'Copy Link'}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Renew
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Renew Share Link</DialogTitle>
                            <DialogDescription>
                              This will reset the expiration date and create a new access log.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 py-4">
                            <Label htmlFor="renew-expiration">New expiration</Label>
                            <Select defaultValue="30">
                              <SelectTrigger id="renew-expiration">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="365">1 year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Renew Link</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke Share Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this share link. Anyone with this link will no longer be able to access your profile.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRevokeShare(share.shareId)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Revoke
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SharingManager;
