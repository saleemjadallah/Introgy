
import { Battery, Brain, Users, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  // Mock social battery data
  const socialBatteryLevel = 45;

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{getGreeting()}</h2>
        <p className="text-muted-foreground">Welcome to your personal space for managing social energy.</p>
      </div>

      {/* Social battery summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5" />
            Social Battery
          </CardTitle>
          <CardDescription>Your current social energy level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Level</span>
              <span className="text-sm font-medium">{socialBatteryLevel}%</span>
            </div>
            <Progress value={socialBatteryLevel} className="h-2" />
            <div className="pt-2">
              <Link to="/social-battery">
                <Button variant="outline" size="sm" className="w-full">Update Battery</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feature cards */}
        <Link to="/social-navigation" className="block">
          <Card className="h-full hover:bg-accent/10 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social Navigation
              </CardTitle>
              <CardDescription>Tools for navigating social situations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Prepare for events, practice conversations, and get real-time support.</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/connection-builder" className="block">
          <Card className="h-full hover:bg-accent/10 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Connection Builder
              </CardTitle>
              <CardDescription>Create meaningful relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Find compatible connections and maintain relationships with less effort.</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/wellbeing" className="block">
          <Card className="h-full hover:bg-accent/10 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Wellbeing Center
              </CardTitle>
              <CardDescription>Resources for introvert wellness</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Mindfulness exercises, educational content, and community wisdom.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Index;
