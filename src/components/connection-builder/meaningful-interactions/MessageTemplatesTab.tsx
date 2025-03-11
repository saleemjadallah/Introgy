
import React from 'react';
import { MessageTemplate } from '@/types/meaningful-interactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MessageTemplatesTabProps {
  templates: MessageTemplate[];
}

const MessageTemplatesTab: React.FC<MessageTemplatesTabProps> = ({ templates }) => {
  // If no templates are available
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No message templates available right now.</p>
      </div>
    );
  }

  return (
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
  );
};

export default MessageTemplatesTab;
