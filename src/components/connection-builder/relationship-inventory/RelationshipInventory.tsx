
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, List, ChartBar, Settings } from 'lucide-react';
import RelationshipMap from './RelationshipMap';
import RelationshipList from './RelationshipList';
import RelationshipInsights from './RelationshipInsights';
import RelationshipSettings from './RelationshipSettings';

const RelationshipInventory = () => {
  const [activeTab, setActiveTab] = useState<string>('map');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Relationship Inventory</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Visualize and manage your important connections
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger 
            value="map" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto"
          >
            <Map className="h-4 w-4 mb-1" />
            <span>Map View</span>
          </TabsTrigger>
          <TabsTrigger 
            value="list" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto"
          >
            <List className="h-4 w-4 mb-1" />
            <span>List View</span>
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto"
          >
            <ChartBar className="h-4 w-4 mb-1" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 text-xs sm:text-sm h-auto"
          >
            <Settings className="h-4 w-4 mb-1" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-6">
          <RelationshipMap />
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <RelationshipList />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <RelationshipInsights />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <RelationshipSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelationshipInventory;
