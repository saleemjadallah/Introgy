
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Plus, Check } from "lucide-react";

const defaultTemplates = [
  {
    id: 1,
    title: "Time Boundaries",
    phrases: [
      "I need advance notice for social plans",
      "I prefer to leave events early when needed",
      "I need regular alone time to recharge"
    ]
  },
  {
    id: 2,
    title: "Communication Boundaries",
    phrases: [
      "I prefer text over calls for non-urgent matters",
      "I might take time to respond to messages",
      "I need quiet time during evenings"
    ]
  }
];

const BoundaryTemplates = () => {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [newTemplate, setNewTemplate] = useState({ title: "", phrases: [""] });

  const handleAddPhrase = () => {
    setNewTemplate({
      ...newTemplate,
      phrases: [...newTemplate.phrases, ""]
    });
  };

  const handlePhraseChange = (index: number, value: string) => {
    const updatedPhrases = [...newTemplate.phrases];
    updatedPhrases[index] = value;
    setNewTemplate({
      ...newTemplate,
      phrases: updatedPhrases
    });
  };

  const handleSaveTemplate = () => {
    if (newTemplate.title && newTemplate.phrases.some(p => p)) {
      setTemplates([
        ...templates,
        {
          id: templates.length + 1,
          title: newTemplate.title,
          phrases: newTemplate.phrases.filter(p => p)
        }
      ]);
      setNewTemplate({ title: "", phrases: [""] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {template.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {template.phrases.map((phrase, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{phrase}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
          <CardDescription>Add a new boundary template with common phrases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Template Title</Label>
            <Input
              id="title"
              value={newTemplate.title}
              onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
              placeholder="e.g., Social Event Boundaries"
            />
          </div>

          <div className="space-y-2">
            <Label>Boundary Phrases</Label>
            {newTemplate.phrases.map((phrase, index) => (
              <Input
                key={index}
                value={phrase}
                onChange={(e) => handlePhraseChange(index, e.target.value)}
                placeholder="Add a boundary phrase"
                className="mb-2"
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddPhrase}>
              <Plus className="h-4 w-4 mr-1" /> Add Phrase
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoundaryTemplates;
