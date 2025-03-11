
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoundaryTemplates from "./BoundaryTemplates";
import SocialLimits from "./SocialLimits";
import CommunicationGuide from "./CommunicationGuide";

const BoundaryManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Boundary Manager</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create and manage your social boundaries with AI assistance
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Boundary Templates</TabsTrigger>
          <TabsTrigger value="limits">Social Limits</TabsTrigger>
          <TabsTrigger value="communication">Communication Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <BoundaryTemplates />
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <SocialLimits />
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <CommunicationGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoundaryManager;
