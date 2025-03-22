
import { Battery, Brain, Users, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { getBatteryColor } from "@/hooks/social-battery/batteryUtils";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { AnimatedProgress } from "@/components/animations/AnimatedProgress";
import { motion } from "framer-motion";

const Index = () => {
  // Use the social battery hook instead of mock data
  const { batteryLevel } = useSocialBattery();

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div 
      className="space-y-4 md:space-y-6 mx-auto w-full max-w-full px-1 sm:px-2 md:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="space-y-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">{getGreeting()}</h2>
        <p className="text-muted-foreground">Welcome to your personal space for managing social energy.</p>
      </motion.div>

      {/* Social battery summary */}
      <AnimatedCard className="battery-container-gradient w-full overflow-hidden shadow-lg border border-white/40">
        <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Battery className="h-5 w-5 text-sage" />
            Social Battery
          </CardTitle>
          <CardDescription>Your current social energy level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Level</span>
              <span className="text-sm font-medium">{batteryLevel}%</span>
            </div>
            <AnimatedProgress
              value={batteryLevel}
              className="my-1"
              barClassName="battery-indicator-gradient"
              showWaveEffect={true}
              pulseOnChange={true}
              celebrateOnMax={true}
              height={8}
            />
            <div className="pt-4 flex justify-center">
              <Link to="/social-battery" className="w-[80%]">
                <AnimatedButton variant="outline" size="sm" fullWidth={true}>Update Battery</AnimatedButton>
              </Link>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Link to="/social-navigation" className="block w-full">
            <AnimatedCard className="h-full navigation-container-gradient w-full overflow-hidden shadow-lg border border-white/40">
              <CardHeader className="px-4 pt-4 pb-2 md:px-6 md:pt-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Users className="h-5 w-5 text-periwinkle" />
                  Social Navigation
                </CardTitle>
                <CardDescription>Tools for navigating social situations</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <p className="text-sm">Prepare for events, practice conversations, and get real-time support.</p>
              </CardContent>
            </AnimatedCard>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Link to="/connection-builder" className="block w-full">
            <AnimatedCard className="h-full connection-container-gradient w-full overflow-hidden shadow-lg border border-white/40">
              <CardHeader className="px-4 pt-4 pb-2 md:px-6 md:pt-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Brain className="h-5 w-5 text-mauve" />
                  Connection Builder
                </CardTitle>
                <CardDescription>Create meaningful relationships</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <p className="text-sm">Find compatible connections and maintain relationships with less effort.</p>
              </CardContent>
            </AnimatedCard>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Link to="/wellbeing" className="block w-full">
            <AnimatedCard className="h-full wellbeing-container-gradient w-full overflow-hidden shadow-lg border border-white/40">
              <CardHeader className="px-4 pt-4 pb-2 md:px-6 md:pt-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <LineChart className="h-5 w-5 text-blueteal" />
                  Wellbeing Center
                </CardTitle>
                <CardDescription>Resources for introvert wellness</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <p className="text-sm">Mindfulness exercises, educational content, and community wisdom.</p>
              </CardContent>
            </AnimatedCard>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
