
import React from 'react';
import { SharedExperience } from '@/types/meaningful-interactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SharedExperiencesTabProps {
  experiences: SharedExperience[];
  onGenerate?: () => Promise<any>;
  isLoading?: boolean;
}

const SharedExperiencesTab: React.FC<SharedExperiencesTabProps> = ({ experiences, onGenerate, isLoading }) => {
  // If no experiences are available
  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">No shared experiences available right now.</p>
        {onGenerate && (
          <Button 
            onClick={onGenerate} 
            disabled={isLoading}
            className="mx-auto"
          >
            {isLoading ? 'Generating...' : 'Generate New Experience'}
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
            {isLoading ? 'Generating...' : 'Generate New Experience'}
          </Button>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {experiences.map(experience => (
          <Card key={experience.id} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{experience.title}</CardTitle>
              <CardDescription>{experience.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-md">{experience.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.interestTags && experience.interestTags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-semibold">Energy Required:</span> {experience.energyRequired}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Time Required:</span> {experience.timeRequired} min
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Save Experience</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SharedExperiencesTab;
