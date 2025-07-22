
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BatteryStatus } from "@/components/social-battery/BatteryStatus";
import { BatteryHistory } from "@/components/social-battery/BatteryHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery, Activity, ListPlus, Zap, Timer, Brain, Download } from "lucide-react";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { WaitingListForm } from "@/components/WaitingListForm";

const SocialBattery = () => {
  const { batteryLevel, batteryHistory, handleSliderChange } = useSocialBattery();
  const [selectedTab, setSelectedTab] = useState("overview");

  const showDemoToast = () => {
    toast.info("Demo Feature", {
      description: "This would interact with your social battery in the actual app.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Social Battery</h2>
          <p className="text-muted-foreground">Monitor and manage your social energy levels throughout the day</p>
        </div>
        
        <Badge variant="outline" className="bg-purple-50 text-purple-700 flex items-center gap-1 py-1 px-3">
          <Battery className="h-3.5 w-3.5" />
          Featured in Introgy App
        </Badge>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
              What is Social Battery?
            </h3>
            <p className="text-sm text-muted-foreground">
              Social Battery is Introgy's core feature that helps you visualize, track, and manage your social energy. 
              Like a phone battery, your social energy gets depleted during social interactions and needs recharging.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Battery className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="recharge">Recharge</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <BatteryStatus 
            batteryLevel={batteryLevel} 
            onLevelChange={handleSliderChange} 
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Key Features
              </CardTitle>
              <CardDescription>Discover what the Social Battery feature offers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3 mb-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium">Real-time Monitoring</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track your energy levels throughout the day and receive alerts when you're running low.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3 mb-2">
                    <Timer className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Activity Impact</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Learn how different social activities impact your energy so you can plan accordingly.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3 mb-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Intelligent Insights</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get personalized recommendations based on your patterns and preferences.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3 mb-2">
                    <ListPlus className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">Customizable Activities</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add your own activities and how they affect your energy levels.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <WaitingListForm>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Join the Waiting List
                  </Button>
                </WaitingListForm>
                
                <Button onClick={showDemoToast} variant="outline" className="w-full">
                  Try in the Introgy App
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Battery History & Analytics</CardTitle>
              <CardDescription>Track your social energy over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[16/9] bg-gradient-to-b from-muted/50 to-muted p-6 flex items-center justify-center rounded-md border">
                <div className="text-center">
                  <Activity className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Visual battery history graphs and analytics
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available in the Introgy app
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium">Daily Patterns</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify your peak energy times and natural dips throughout the day
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-medium">Weekly Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summaries with insights about your social energy trends
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-medium">Event Correlation</h3>
                  <p className="text-sm text-muted-foreground">
                    See how scheduled events impact your battery before and after
                  </p>
                </div>
              </div>
              
              <Button onClick={showDemoToast} className="w-full">
                Download App to Track Your Battery
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recharge" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recharge Activities</CardTitle>
              <CardDescription>Discover ways to restore your social energy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-700 mb-2">Solo Activities</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Reading a book</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Taking a nature walk</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Meditation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Creative hobbies</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Mindfulness Practices</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Deep breathing exercises</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Grounding techniques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Body scan meditation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Journaling practices</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-purple-700 mb-2">Featured: Overnight Recharge</h3>
                <p className="text-sm">
                  The app automatically applies an overnight recharge to your social battery based on your sleep quality and duration.
                  You can customize the recharge amount in settings.
                </p>
              </div>
              
              <Button onClick={showDemoToast} className="w-full">
                Get Personalized Recharge Recommendations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Impact of Activities</CardTitle>
              <CardDescription>Learn how different activities affect your social battery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">High Energy Cost (70-100%)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Large social gatherings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Public speaking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Networking events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Crowded spaces</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Medium Energy Cost (30-70%)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span>Small group gatherings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span>One-on-one meetings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span>Team activities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span>Video calls</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Low Energy Cost (5-30%)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Brief interactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Text messaging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Social media browsing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Quick calls with close friends</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Customize Your Activities</h3>
                  <p className="text-sm">
                    In the app, you can add your own activities and rate how much they drain or recharge your social battery.
                    The app learns from your patterns to provide better recommendations over time.
                  </p>
                </div>
                
                <Button onClick={showDemoToast} className="w-full">
                  Create Your Custom Activity List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialBattery;
