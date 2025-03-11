
import React from 'react';
import { MessageTemplate } from '@/types/meaningful-interactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MessageTemplatesTabProps {
  templates: MessageTemplate[];
  onGenerate?: () => Promise<any>;
  isLoading?: boolean;
}

const MessageTemplatesTab: React.FC<MessageTemplatesTabProps> = ({ templates, onGenerate, isLoading }) => {
  // If no templates are available
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">No message templates available right now.</p>
        {onGenerate && (
          <Button 
            onClick={onGenerate} 
            disabled={isLoading}
            className="mx-auto"
          >
            {isLoading ? 'Generating...' : 'Generate New Template'}
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
            {isLoading ? 'Generating...' : 'Generate New Template'}
          </Button>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map(template => (
          <Card key={template.id} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{template.purpose}</CardTitle>
              <CardDescription>Tone: {template.tone}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-md italic">{template.baseTemplate}</p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Energy Required: {template.energyRequired}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MessageTemplatesTab;
