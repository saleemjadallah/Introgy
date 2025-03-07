
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Check, FileText, Sparkles, BookOpenText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface PreparationMemoProps {
  eventId: string;
  memo?: string;
  onGenerate: () => Promise<void>;
}

const PreparationMemo = ({ eventId, memo, onGenerate }: PreparationMemoProps) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };
  
  const handleCopy = () => {
    if (memo) {
      navigator.clipboard.writeText(memo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5" />
            AI Preparation Memo
          </CardTitle>
          <CardDescription>
            Detailed preparation guidance tailored to this event
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {memo ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="p-4 bg-muted/50 rounded-md">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    Preparation Memo
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2" 
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Clipboard className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <ReactMarkdown className="text-sm">
                  {memo}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No preparation memo yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate an AI-powered preparation memo for this event
              </p>
              <Button onClick={handleGenerate} disabled={loading}>
                <Sparkles className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Generate Preparation Memo"}
              </Button>
            </div>
          )}
        </CardContent>
        
        {memo && (
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              variant="outline" 
              className="w-full"
              disabled={loading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? "Regenerating..." : "Regenerate Memo"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PreparationMemo;
