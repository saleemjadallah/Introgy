
import React from 'react';
import { DeepQuestion } from '@/types/meaningful-interactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DeepQuestionsTabProps {
  questions: DeepQuestion[];
}

const DeepQuestionsTab: React.FC<DeepQuestionsTabProps> = ({ questions }) => {
  // If no questions are available
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No deep questions available right now.</p>
      </div>
    );
  }

  return (
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
              {question.topics.map(topic => (
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
  );
};

export default DeepQuestionsTab;
