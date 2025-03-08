
import { LineChart, BookOpen, Users, Battery, Book, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntrovertGlossary from "@/components/wellbeing/IntrovertGlossary";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Wellbeing = () => {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Wellbeing Center</h2>
        <p className="text-muted-foreground">Resources to support your introvert wellbeing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5" />
              Mindfulness Exercises
            </CardTitle>
            <CardDescription>Introvert-specific mindfulness practices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Education Center
            </CardTitle>
            <CardDescription>Learn about introvert psychology</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Collapsible
                open={isGlossaryOpen}
                onOpenChange={setIsGlossaryOpen}
                className="border rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-between w-full p-3 hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span className="font-medium">Introvert Psychology Glossary</span>
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${isGlossaryOpen ? "transform rotate-180" : ""}`} 
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <IntrovertGlossary />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Wisdom
            </CardTitle>
            <CardDescription>Anonymous sharing of introvert strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wellbeing;
