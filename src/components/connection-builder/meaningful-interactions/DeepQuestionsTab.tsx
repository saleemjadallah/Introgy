
import React from 'react';
import { DeepQuestion } from '@/types/meaningful-interactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DeepQuestionsTabProps {
  questions: DeepQuestion[];
  onGenerate?: () => Promise<any>;
  isLoading?: boolean;
}

const DeepQuestionsTab: React.FC<DeepQuestionsTabProps> = ({ questions, onGenerate, isLoading }) => {
  // If no questions are available
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">No deep questions available right now.</p>
        {onGenerate && (
          <Button 
            onClick={onGenerate} 
            disabled={isLoading}
            className="mx-auto"
          >
            {isLoading ? 'Generating...' : 'Generate New Question'}
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
            {isLoading ? 'Generating...' : 'Generate New Question'}
          </Button>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {questions.map(question => (
          <Card key={question.id} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{question.category}</CardTitle>
              <CardDescription>Depth Level: {question.depthLevel}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-md">{question.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {question.topics && question.topics.map(topic => (
                  <span 
                    key={topic} 
                    className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeepQuestionsTab;
