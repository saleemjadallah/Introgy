
import React from 'react';
import { ConnectionRitual } from '@/types/meaningful-interactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConnectionRitualsTabProps {
  rituals: ConnectionRitual[];
  onGenerate?: () => Promise<any>;
  isLoading?: boolean;
}

const ConnectionRitualsTab: React.FC<ConnectionRitualsTabProps> = ({ rituals, onGenerate, isLoading }) => {
  // If no rituals are available
  if (!rituals || rituals.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">No connection rituals available right now.</p>
        {onGenerate && (
          <Button 
            onClick={onGenerate} 
            disabled={isLoading}
            className="mx-auto"
          >
            {isLoading ? 'Generating...' : 'Generate New Ritual'}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onGenerate && (
        <div className="flex justify-end mb-4">
          <Button 
            onClick={onGenerate} 
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate New Ritual'}
          </Button>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {rituals.map(ritual => (
          <Card key={ritual.id} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{ritual.name}</CardTitle>
              <CardDescription>{ritual.interactionType}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-md">{ritual.description}</p>
              <div className="mt-4">
                <p className="text-sm flex items-center gap-2">
                  <span className="font-semibold">Energy Cost:</span> 
                  {ritual.energyCost}
                </p>
                <p className="text-sm flex items-center gap-2 mt-1">
                  <span className="font-semibold">Frequency:</span> 
                  {ritual.frequency && `${ritual.frequency.value} ${ritual.frequency.unit} (±${ritual.frequency.flexibility} days)`}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Adopt Ritual</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConnectionRitualsTab;
