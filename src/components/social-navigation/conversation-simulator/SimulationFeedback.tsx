
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scenario } from "@/types/conversation";
import { Award, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, BarChart } from "lucide-react";

interface SimulationFeedbackProps {
  feedback: any;
  scenario: Scenario | null;
  onReset: () => void;
}

const SimulationFeedback = ({ feedback, scenario, onReset }: SimulationFeedbackProps) => {
  if (!feedback || !scenario) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No feedback available</h3>
        <p className="text-muted-foreground mb-4">
          Complete a conversation simulation to receive feedback.
        </p>
        <Button onClick={onReset} variant="outline">
          Start New Simulation
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">{scenario.name} - Feedback</h3>
        <p className="text-muted-foreground">
          {scenario.difficulty} • {scenario.duration} • {scenario.personaType}
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-2 py-4">
        <div className="relative w-32 h-32 mb-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">{feedback.overallScore}</span>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-muted-foreground/20"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary"
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * feedback.overallScore) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
        </div>
        <p className="text-lg font-medium">Overall Performance</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Engagement</span>
            <span className="font-medium">{feedback.engagementLevel}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Flow</span>
            <span className="font-medium">{feedback.conversationFlow}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.strengths.map((strength: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 flex-shrink-0 mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-amber-500" />
              Areas for Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.improvementAreas.map((area: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Key Learnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{feedback.keyLearnings}</p>
        </CardContent>
      </Card>
      
      <div className="flex justify-center pt-4">
        <Button onClick={onReset} className="px-8">
          <RotateCcw className="h-4 w-4 mr-2" />
          Practice Again
        </Button>
      </div>
    </div>
  );
};

export default SimulationFeedback;
