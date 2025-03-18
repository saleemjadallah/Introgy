
import { Lightbulb, RefreshCw, MessageCircle } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunicationProfile } from '@/types/communication-preferences';

interface TabNavigationProps {
  activeTab: string;
  profile: Partial<CommunicationProfile> | undefined;
}

const TabNavigation = ({ activeTab, profile }: TabNavigationProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="create" className="flex items-center gap-1">
        <Lightbulb className="h-4 w-4" />
        <span>Create Profile</span>
      </TabsTrigger>
      <TabsTrigger 
        value="enhance" 
        className="flex items-center gap-1"
        disabled={!profile}
      >
        <RefreshCw className="h-4 w-4" />
        <span>Enhance Profile</span>
      </TabsTrigger>
      <TabsTrigger value="phrases" className="flex items-center gap-1">
        <MessageCircle className="h-4 w-4" />
        <span>Generate Phrases</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
