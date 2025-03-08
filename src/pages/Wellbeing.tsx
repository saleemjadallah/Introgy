
import { LineChart, BookOpen, Users, Battery, Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntrovertGlossary from "@/components/wellbeing/IntrovertGlossary";

const Wellbeing = () => {
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
              <Card className="border-dashed">
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    Introvert Psychology Glossary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <IntrovertGlossary />
                </CardContent>
              </Card>
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
